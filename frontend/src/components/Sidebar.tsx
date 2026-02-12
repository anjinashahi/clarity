// src/components/Sidebar.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Add Income", path: "/add-income" },
    { name: "Add Expense", path: "/add-expense" },
    {name: "History", path: "/history"},
    // { name: "Settings", path: "/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <nav className="sidebar">
      <h2 className="sidebar-title">Clarity</h2>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        {userName && (
          <div className="user-greeting">
            👋 Hello, {userName}
          </div>
        )}
        <div className="button-group">
          <button className="theme-toggle-btn" onClick={toggleDarkMode} title={isDarkMode ? "Light Mode" : "Dark Mode"}>
            {isDarkMode ? "☀️" : "🌙"}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
