import React, { useState, useEffect } from "react";
import "./css/Header.css";
import closeLogo from "../assets/logo.svg";
import {
  FaTh,
  FaBars,
  FaRegChartBar,
  FaCommentAlt,
  FaGlassWhiskey,
  FaCog,
  FaSignOutAlt,
  FaFirstAid
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import { useAuth } from "../auth/auth";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem] = useState("");

  const { LogoutUser } = useAuth();

  const toggle = () => setIsOpen(!isOpen);

  const primaryMenu = [
    {
      path: "/",
      name: "Dashboard",
      icon: <FaTh />,
    },
    {
      path: "/inventory",
      name: "Inventory",
      icon: <FaGlassWhiskey />,
    },
    {
      path: "/reports",
      name: "Reports",
      icon: <FaRegChartBar />,
    },
    {
      path: "/sales",
      name: "Sales",
      icon: <FaCommentAlt />,
    },
    {
      path: "/add-sale",
      name: "Add sales",
      icon: <FaFirstAid />,
    },
  ];

  const bottomMenu = [
    {
      path: "/settings",
      name: "Settings",
      icon: <FaCog />,
    },
    {
      name: "Logout",
      icon: <FaSignOutAlt />,
      onClick: LogoutUser,
    },
  ];

  return (
    <div className="Container">
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="logo">
          <img src={closeLogo} alt="" />
          <p className={`logoText ${isOpen ? "show" : "hide"}`}>4 SALE</p>
        </div>

        {/* Primary Menu */}
        <div className="menu-section">
          {primaryMenu.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={`link ${activeItem === item.name ? "active" : ""}`}
            >
              <div className="IconWithName rounded p-1">
                <div className={`icon ${isOpen ? "notcenter" : "center"}`}>
                  {item.icon}
                </div>
                <div className={`link_text ${isOpen ? "show" : "hide"}`}>
                  {item.name}
                </div>
              </div>
            </NavLink>
          ))}
        </div>

        {/* Bottom Menu */}
        <div className="bottom-section">
          {bottomMenu.map((item, index) =>
            item.path ? (
              <NavLink
                to={item.path}
                key={index}
                className={`link ${activeItem === item.name ? "active" : ""}`}
              >
                <div className="IconWithName rounded p-1">
                  <div className={`icon ${isOpen ? "notcenter" : "center"}`}>
                    {item.icon}
                  </div>
                  <div className={`link_text ${isOpen ? "show" : "hide"}`}>
                    {item.name}
                  </div>
                </div>
              </NavLink>
            ) : (
              <div
                key={index}
                className={`link ${activeItem === item.name ? "active" : ""}`}
                onClick={item.onClick}
                style={{cursor: "pointer"}}
              >
                <div className="IconWithName">
                  <div className={`icon ${isOpen ? "notcenter" : "center"}`}>
                    {item.icon}
                  </div>
                  <div className={`link_text ${isOpen ? "show" : "hide"}`}>
                    {item.name}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="mainContent">
        {/* Top Bar */}
        <div className="topBar">
          <div className="bars">
            <FaBars onClick={toggle} />
          </div>
          <div className="Active">
            <div className="header">
              <Breadcrumb />
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default Sidebar;
