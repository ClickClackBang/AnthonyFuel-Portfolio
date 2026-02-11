import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import ProjectsPage from "./pages/ProjectsPage";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div
        className="app-root"
        style={{ width: "100%", minHeight: "100vh", fontFamily: "sans-serif" }}
      >
        {/* Navigation Bar */}
        <nav
          style={{
            padding: "10px 0",
            textAlign: "center",
            width: "100%",
            borderBottom: "1px solid #ccc",
          }}
        >
          <b>
            <Link to="/" style={{ margin: "0 15px", textDecoration: "none", color: "black" }}>
              Home
            </Link>
            <span style={{ margin: "0 15px" }}>Skills</span>
            <Link to="/projects" style={{ margin: "0 15px", textDecoration: "none", color: "black" }}>
              Projects
            </Link>
            <span style={{ margin: "0 15px" }}>Contact</span>
          </b>
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>

        {/* Footer */}
        <footer
          style={{
            marginTop: "40px",
            padding: "10px",
            textAlign: "center",
            width: "100%",
            borderTop: "1px solid #ccc",
          }}
        >
          <p style={{ margin: "5px 0" }}>Footer</p>
          <b>
            <span style={{ margin: "0 10px" }}>LinkedIn</span>
            <span style={{ margin: "0 10px" }}>GitHub</span>
            <span style={{ margin: "0 10px" }}>Email</span>
          </b>
        </footer>
      </div>
    </Router>
  );
}

export default App;