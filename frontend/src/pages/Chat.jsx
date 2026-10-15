import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import toast from "react-hot-toast";
import "../styles/community.css";
import "../styles/chat.css";

const socketURL = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const socketRef = useRef(null);
  const selectedIdRef = useRef(null);
  const currentUserId = (() => {
    try {
      return JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id;
    } catch {
      return "";
    }
  })();

  useEffect(() => {
    selectedIdRef.current = selected?._id || null;
  }, [selected]);

  useEffect(() => {
    api
      .get("/chat/conversations")
      .then((res) => setConversations(res.data.conversations))
      .catch(() => toast.error("Unable to load conversations"));
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.trim().length < 2) {
        setUsers([]);
        return;
      }

      try {
        const res = await api.get("/chat/users", {
          params: { search: search.trim() },
        });
        setUsers(res.data.users);
      } catch {
        toast.error("Unable to search users");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!selected?._id) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    setLoadingMessages(true);

    api
      .get(`/chat/conversations/${selected._id}/messages`)
      .then((res) => {
        if (!cancelled) setMessages(res.data.messages);
      })
      .catch(() => toast.error("Unable to load messages"))
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });

    api.post(`/chat/conversations/${selected._id}/read`).catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [selected?._id]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const socket = io(socketURL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect_error", () => {
      toast.error("Chat connection failed. Check your connection.");
    });

    socket.on("new_message", (message) => {
      if (String(message.conversation) === selectedIdRef.current) {
        setMessages((current) => {
          if (current.some((item) => item._id === message._id)) {
            return current;
          }
          return [...current, message];
        });

        if (String(message.sender?._id) !== currentUserId) {
          api
            .post(`/chat/conversations/${message.conversation}/read`)
            .catch(() => {});
        }
      }

      setConversations((current) =>
        current.map((conversation) =>
          conversation._id === message.conversation
            ? { ...conversation, lastMessage: message }
            : conversation,
        ),
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUserId]);

  useEffect(() => {
    if (!selected?._id || !socketRef.current) return;

    socketRef.current.emit(
      "join_conversation",
      { conversationId: selected._id },
      (result) => {
        if (!result?.ok) {
          toast.error(result?.message || "Unable to join conversation");
        }
      },
    );
  }, [selected?._id]);

  async function startConversation(userId) {
    try {
      const res = await api.post("/chat/conversations", { userId });
      const conversation = res.data.conversation;

      setConversations((current) => {
        const exists = current.some((item) => item._id === conversation._id);

        return exists ? current : [conversation, ...current];
      });

      setSelected(conversation);
      setSearch("");
      setUsers([]);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to start conversation",
      );
    }
  }

  async function sendMessage(event) {
    event.preventDefault();

    const text = content.trim();
    const socket = socketRef.current;

    if (!text || !selected?._id || sending) return;

    if (!socket?.connected) {
      toast.error("Chat is disconnected. Please reconnect.");
      return;
    }

    setSending(true);

    socket.emit(
      "send_message",
      {
        conversationId: selected._id,
        content: text,
      },
      (result) => {
        setSending(false);

        if (!result?.ok) {
          toast.error(result?.message || "Message could not be sent");
          return;
        }

        setContent("");
      },
    );
  }

  function getOtherUser(conversation) {
    return conversation.participants?.find(
      (user) => String(user._id) !== currentUserId,
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content chat-page">
        <h1>Messages</h1>
        <p className="community-subtitle">
          Connect privately with other DSA Coach members.
        </p>

        <div className="chat-layout">
          <aside className="chat-contacts">
            <h2>Find people</h2>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or email..."
            />

            {users.map((user) => (
              <button
                className="chat-user-result"
                key={user._id}
                onClick={() => startConversation(user._id)}
              >
                <span className="post-avatar">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
                <span>
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </span>
              </button>
            ))}

            <h2 className="conversation-heading">Conversations</h2>

            {conversations.map((conversation) => {
              const other = getOtherUser(conversation);

              return (
                <button
                  key={conversation._id}
                  className={`chat-contact ${
                    selected?._id === conversation._id ? "active" : ""
                  }`}
                  onClick={() => setSelected(conversation)}
                >
                  <span className="post-avatar">
                    {other?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                  <span>
                    <strong>{other?.name || "User"}</strong>
                    <small>
                      {conversation.lastMessage?.content || "Start chatting"}
                    </small>
                  </span>
                </button>
              );
            })}
          </aside>

          <section className="chat-window">
            {!selected ? (
              <div className="community-empty">
                <h2>Your conversations</h2>
                <p>Search for a user or select an existing conversation.</p>
              </div>
            ) : (
              <>
                <header className="chat-header">
                  <h2>{getOtherUser(selected)?.name || "Conversation"}</h2>
                  <p>Private messages</p>
                </header>

                <div className="chat-messages">
                  {loadingMessages ? (
                    <p>Loading messages...</p>
                  ) : messages.length === 0 ? (
                    <p className="chat-empty">
                      No messages yet. Start the conversation.
                    </p>
                  ) : (
                    messages.map((message) => {
                      const own = String(message.sender?._id) === currentUserId;

                      return (
                        <div
                          key={message._id}
                          className={`chat-message ${own ? "own" : ""}`}
                        >
                          <p>{message.content}</p>
                          <small>
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                            {own && message.readAt ? " · Read" : ""}
                          </small>
                        </div>
                      );
                    })
                  )}
                </div>

                <form className="chat-composer" onSubmit={sendMessage}>
                  <input
                    value={content}
                    maxLength={5000}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Write a message..."
                  />
                  <button type="submit" disabled={!content.trim() || sending}>
                    {sending ? "Sending..." : "Send"}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
