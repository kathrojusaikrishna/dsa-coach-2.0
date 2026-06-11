import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

//pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Recommendations from "./pages/Recommendations";
import Revision from "./pages/Revision";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/revision" element={<Revision />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
      </Routes>
    </BrowserRouter>
  );
}
