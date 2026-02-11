// src/components/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Add Income", path: "/add-income" },
    { name: "Add Expense", path: "/add-expense" },
    // { name: "Settings", path: "/settings" },
  ];

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
    </nav>
  );
};

export default Sidebar;
