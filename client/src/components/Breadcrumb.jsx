import React from 'react';
import { useLocation } from 'react-router-dom';
import './css/Breadcrumb.css'; // Import the CSS for styling

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x); // Split the path and filter out empty segments

  return (
    <div className="breadcrumb">
      {/* Add a condition to display "Dashboard" if at the root route */}
      {pathnames.length === 0 ? (
        <span>Dashboard</span>
      ) : (
        pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          let displayName;

          // Show "Inventory" for the inventory path
          if (name === 'inventory') {
            displayName = 'Inventory';
          } 
          // Show "Product Details" for the last item (regardless of the actual product name)
          else if (isLast) {
            displayName = 'Product Details'; // Fixed display name for product details
          } 
          // Capitalize first letter for other segments
          else {
            displayName = name.charAt(0).toUpperCase() + name.slice(1);
          }
          return (
            <span key={index}>
              {displayName}
              {!isLast && " / "}
            </span>
          );
        })
      )}
    </div>
  );
};

export default Breadcrumb;
