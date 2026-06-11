import React from "react";
import {
  FaHome,
  FaUser,
  FaHistory,
  FaBrain,
  FaSignOutAlt,
  FaBookOpen,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <h2>DSA Coach</h2>

      <nav>
        <NavLink to="/dashboard">
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/recommendations">
          <FaBrain />
          Recommendations
        </NavLink>

        <NavLink to="/revision">
          <FaHistory />
          Revision
        </NavLink>

        <NavLink to="/profile">
          <FaUser />
          Profile
        </NavLink>
        <NavLink to={"/resume-analyzer"}>
          <FaBookOpen />
          Resume
        </NavLink>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}
