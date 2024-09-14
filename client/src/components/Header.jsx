import React, { useState, useEffect } from "react";
import "./css/Header.css";
import closeLogo from "../assets/logo.svg";
import {
  FaTh,
  FaBars,
  FaUserAlt,
  FaRegChartBar,
  FaCommentAlt,
  FaShoppingBag,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Combine both primary and bottom menu items
    const allMenuItems = [...primaryMenu, ...bottomMenu];
    
    // Set the active item based on the current route
    const path = location.pathname;
    const currentItem = allMenuItems.find(item => item.path === path)?.name || "";
    setActiveItem(currentItem);
  }, [location.pathname]);

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
      icon: <FaShoppingBag />,
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
  ];

  const bottomMenu = [
    {
      path: "/settings",
      name: "Settings",
      icon: <FaCog />,
    },
    {
      path: "/logout",
      name: "Logout",
      icon: <FaSignOutAlt />,
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
              <div className="IconWithName">
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
          {bottomMenu.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={`link ${activeItem === item.name ? "active" : ""}`}
            >
              <div className="IconWithName">
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
      </div>

      <div className="mainContent">
        {/* Top Bar */}
        <div className="topBar">
          <div className="bars">
            <FaBars onClick={toggle} />
          </div>
          <div className="Active">
            <div className="header">
              <h2>{activeItem}</h2>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
