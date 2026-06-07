import React from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //gsap
  useGSAP(() => {
    gsap.from(".auth-card", {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
      toast.success("Login successful!");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "login failed");
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>

        <p className="auth-subtitle">Continue your DSA journey</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}
