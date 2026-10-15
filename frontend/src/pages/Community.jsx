import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import toast from "react-hot-toast";
import "../styles/community.css";

const emptyForm = {
  type: "discussion",
  title: "",
  content: "",
  tags: "",
  company: "",
  role: "",
  location: "",
  jobType: "internship",
  applicationUrl: "",
  deadline: "",
};

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [commentDrafts, setCommentDrafts] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const currentUserId = (() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return "";

      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || "";
    } catch {
      return "";
    }
  })();

  async function loadPosts(nextPage = 1) {
    try {
      setLoading(true);

      const params = { page: nextPage, limit: 10 };

      if (filter !== "all") params.type = filter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get("/community/posts", { params });

      setPosts(res.data.posts);
      setPage(res.data.page);
      setPages(Math.max(1, res.data.pages));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load community");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts(1);
  }, [filter]);

  async function handleCreatePost(event) {
    event.preventDefault();

    try {
      const payload = {
        type: form.type,
        title: form.title,
        content: form.content,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (form.type === "job") {
        payload.jobDetails = {
          company: form.company,
          role: form.role,
          location: form.location,
          jobType: form.jobType,
          applicationUrl: form.applicationUrl,
          deadline: form.deadline || null,
        };
      }

      await api.post("/community/posts", payload);

      toast.success("Post published");
      setForm(emptyForm);
      setShowForm(false);
      await loadPosts(1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to publish post");
    }
  }

  async function handleLike(postId) {
    try {
      const res = await api.post(`/community/posts/${postId}/like`);

      setPosts((current) =>
        current.map((post) => {
          if (post._id !== postId) return post;

          const likes = post.likes || [];
          const nextLikes = res.data.liked
            ? [...likes, currentUserId]
            : likes.filter((id) => String(id) !== currentUserId);

          return { ...post, likes: nextLikes };
        }),
      );
    } catch {
      toast.error("Unable to update like");
    }
  }

  async function handleComment(postId) {
    const content = commentDrafts[postId]?.trim();

    if (!content) {
      toast.error("Enter a comment first");
      return;
    }

    try {
      const res = await api.post(`/community/posts/${postId}/comments`, {
        content,
      });

      setPosts((current) =>
        current.map((post) => (post._id === postId ? res.data.post : post)),
      );

      setCommentDrafts((current) => ({
        ...current,
        [postId]: "",
      }));

      toast.success("Comment added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add comment");
    }
  }

  async function handleDelete(postId) {
    if (!window.confirm("Delete this post?")) return;

    try {
      await api.delete(`/community/posts/${postId}`);

      setPosts((current) => current.filter((post) => post._id !== postId));

      toast.success("Post deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete post");
    }
  }

  const updateForm = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content community-page">
        <div className="community-heading">
          <div>
            <p className="community-eyebrow">DSA COACH NETWORK</p>
            <h1>Community</h1>
            <p className="community-subtitle">
              Ask questions, share knowledge and discover opportunities.
            </p>
          </div>

          <button
            className="community-primary"
            onClick={() => setShowForm((value) => !value)}
          >
            {showForm ? "Cancel" : "+ Create post"}
          </button>
        </div>

        <div className="community-tabs">
          {[
            ["all", "All posts"],
            ["discussion", "Discussions"],
            ["question", "Questions"],
            ["job", "Jobs & internships"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={filter === value ? "active" : ""}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <form
          className="community-search"
          onSubmit={(event) => {
            event.preventDefault();
            loadPosts(1);
          }}
        >
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search questions, topics or companies..."
          />
          <button type="submit">Search</button>
        </form>

        {showForm && (
          <form className="community-form" onSubmit={handleCreatePost}>
            <h2>Create a post</h2>

            <label>Post type</label>
            <select
              value={form.type}
              onChange={(event) => updateForm("type", event.target.value)}
            >
              <option value="discussion">Discussion</option>
              <option value="question">Question</option>
              <option value="job">Job or internship</option>
            </select>

            <label>Title</label>
            <input
              required
              maxLength={180}
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              placeholder="What would you like to share?"
            />

            <label>Description</label>
            <textarea
              required
              maxLength={10000}
              rows={5}
              value={form.content}
              onChange={(event) => updateForm("content", event.target.value)}
              placeholder="Add details, context or your question..."
            />

            {form.type === "job" && (
              <div className="job-fields">
                <label>Company</label>
                <input
                  required
                  value={form.company}
                  onChange={(event) =>
                    updateForm("company", event.target.value)
                  }
                />

                <label>Role</label>
                <input
                  required
                  value={form.role}
                  onChange={(event) => updateForm("role", event.target.value)}
                />

                <label>Location</label>
                <input
                  value={form.location}
                  onChange={(event) =>
                    updateForm("location", event.target.value)
                  }
                  placeholder="Remote / Bengaluru / ..."
                />

                <label>Opportunity type</label>
                <select
                  value={form.jobType}
                  onChange={(event) =>
                    updateForm("jobType", event.target.value)
                  }
                >
                  <option value="internship">Internship</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="referral">Referral</option>
                </select>

                <label>Application URL</label>
                <input
                  type="url"
                  value={form.applicationUrl}
                  onChange={(event) =>
                    updateForm("applicationUrl", event.target.value)
                  }
                  placeholder="https://..."
                />

                <label>Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(event) =>
                    updateForm("deadline", event.target.value)
                  }
                />
              </div>
            )}

            <label>Tags (comma-separated)</label>
            <input
              value={form.tags}
              onChange={(event) => updateForm("tags", event.target.value)}
              placeholder="DSA, C++, interviews"
            />

            <button className="community-primary" type="submit">
              Publish post
            </button>
          </form>
        )}

        {loading ? (
          <div className="community-empty">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="community-empty">
            <h2>No posts found</h2>
            <p>Try a different filter or start the first discussion.</p>
          </div>
        ) : (
          <div className="community-feed">
            {posts.map((post) => {
              const liked = (post.likes || []).some(
                (id) => String(id) === currentUserId,
              );

              return (
                <article className="community-post" key={post._id}>
                  <div className="community-post-meta">
                    <span className="post-avatar">
                      {(post.author?.name || "U").charAt(0).toUpperCase()}
                    </span>

                    <div>
                      <strong>{post.author?.name || "User"}</strong>
                      <p>{new Date(post.createdAt).toLocaleString()}</p>
                    </div>

                    <span className={`post-type type-${post.type}`}>
                      {post.type}
                    </span>
                  </div>

                  <h2>{post.title}</h2>
                  <p className="post-content">{post.content}</p>

                  {post.type === "job" && post.jobDetails && (
                    <div className="job-card">
                      <strong>{post.jobDetails.role}</strong>
                      <p>
                        {post.jobDetails.company}
                        {post.jobDetails.location
                          ? ` · ${post.jobDetails.location}`
                          : ""}
                      </p>
                      <p>{post.jobDetails.jobType || "Opportunity"}</p>

                      {post.jobDetails.deadline && (
                        <p>
                          Deadline:{" "}
                          {new Date(
                            post.jobDetails.deadline,
                          ).toLocaleDateString()}
                        </p>
                      )}

                      {post.jobDetails.applicationUrl && (
                        <a
                          href={post.jobDetails.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View application
                        </a>
                      )}
                    </div>
                  )}

                  {post.tags?.length > 0 && (
                    <div className="post-tags">
                      {post.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="post-actions">
                    <button
                      className={liked ? "liked" : ""}
                      onClick={() => handleLike(post._id)}
                    >
                      ♥ {post.likes?.length || 0} Likes
                    </button>

                    <span>{post.comments?.length || 0} Comments</span>

                    {String(post.author?._id) === currentUserId && (
                      <button onClick={() => handleDelete(post._id)}>
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="post-comments">
                    {(post.comments || []).map((comment) => (
                      <div key={comment._id} className="post-comment">
                        <strong>{comment.author?.name || "User"}</strong>
                        <p>{comment.content}</p>
                      </div>
                    ))}

                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleComment(post._id);
                      }}
                      className="comment-form"
                    >
                      <input
                        value={commentDrafts[post._id] || ""}
                        maxLength={3000}
                        onChange={(event) =>
                          setCommentDrafts((current) => ({
                            ...current,
                            [post._id]: event.target.value,
                          }))
                        }
                        placeholder="Write a comment..."
                      />
                      <button type="submit">Reply</button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && pages > 1 && (
          <div className="community-pagination">
            <button disabled={page <= 1} onClick={() => loadPosts(page - 1)}>
              Previous
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button
              disabled={page >= pages}
              onClick={() => loadPosts(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
