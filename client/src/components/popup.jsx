import React, { useEffect, useRef } from 'react';
import './css/Popup.css'; // Import CSS for styling

const Popup = ({ show, onClose, title, content,hideCloseButton }) => {
    const popupRef = useRef();

    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
  
    useEffect(() => {
      if (show) {
        document.addEventListener('mousedown', handleOutsideClick);
      } else {
        document.removeEventListener('mousedown', handleOutsideClick);
      }
      
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, [show]);
  
    if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>{title}</h2>
          {!hideCloseButton && (
            <span className="close-button" onClick={onClose}>
              &#10005; {/* Close icon */}
            </span>
          )}
        </div>
        <div className="popup-body">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Popup;