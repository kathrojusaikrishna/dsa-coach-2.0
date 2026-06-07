import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>DSA Coach 2.0</h2>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>

        <Link to={"/login"}>Login</Link>
        <Link to={"/register"}>Get Started</Link>
      </div>
    </nav>
  );
}
