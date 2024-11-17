import React, { useEffect, useRef } from "react";
import "./css/Popup.css";

const Popup = ({ show, onClose, title, size, content, hideCloseButton }) => {
  const popupRef = useRef();

  const handleOutsideClick = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [show]);

  if (!show) return null;
  const reSize = size === "small";
  return (
    <div className="popup-overlay" style={{ zIndex: 20000 }}>
      <div className={`popup-content ${reSize ? "size" : ""}`}>
        <div className="popup-header">
          <h2 className="popupTitle">{title}</h2>
          {!hideCloseButton && (
            <span className="close-button" onClick={onClose}>
              &#10005;
            </span>
          )}
        </div>
        <div className="popup-body">{content}</div>
      </div>
    </div>
  );
};

export default Popup;
