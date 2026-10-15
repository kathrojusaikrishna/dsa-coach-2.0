import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Loaded immediately (first page most visitors see)
import Landing from "./pages/Landing";

// Loaded on demand, one chunk per page
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const Revision = lazy(() => import("./pages/Revision"));
const ResumeAnalyzer = lazy(() => import("./pages/ResumeAnalyzer"));
const Community = lazy(() => import("./pages/Community"));
const Chat = lazy(() => import("./pages/Chat"));

function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/revision" element={<Revision />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/community" element={<Community />} />
          <Route path="/messages" element={<Chat />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
