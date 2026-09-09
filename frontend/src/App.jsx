import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import LoginForm from "./pages/auth/LoginForm";
import SignUpForm from "./pages/auth/SignUpForm";
import CreatePoll from "./pages/Dashboard/CreatePoll";
import MyPolls from "./pages/Dashboard/MyPolls";
import VotedPolls from "./pages/Dashboard/VotedPolls";
import Bookmarks from "./pages/Dashboard/Bookmarks";
import Home from "./pages/Dashboard/Home";
import UserProvider from "./context/UserContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/signUp" element={<SignUpForm />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/create-poll" element={<CreatePoll />} />
            <Route path="/my-polls" element={<MyPolls />} />
            <Route path="/voted-polls" element={<VotedPolls />} />
            <Route path="/bookmarked-polls" element={<Bookmarks />} />
            {/* Fallback to root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontSize: '13px',
              borderRadius: '8px'
            }
          }}
        />
      </UserProvider>
    </div>
  );
};

export default App;

// Define the root component to handle initial redirect
const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};