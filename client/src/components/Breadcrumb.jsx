import React from 'react';
import { useLocation } from 'react-router-dom';
import './css/Breadcrumb.css'; // Import the CSS for styling

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x); // Split the path and filter out empty segments

  return (
    <div className="breadcrumb">
      {/* Display "Dashboard" if at the root route */}
      {pathnames.length === 0 ? (
        <span>Dashboard</span>
      ) : (
        pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;

          let displayName;

          // Show "Inventory" for the 'inventory' path
          if (name === 'inventory') {
            displayName = 'Inventory';
          } 
          // Show "Reports" for the 'reports' path
          else if (name === 'reports') {
            displayName = 'Reports';
          }
          
          // Check for 'add-sale' as the last part of the path
          else if (name === 'add-sale') {
            displayName = 'Add Sale'; // Show 'Add Sale' if in add-sale path
          }
          // If it's a product ID after 'inventory' or 'sales', show the appropriate name
          else if (isLast) {
            if (pathnames[index - 1] === 'inventory') {
              displayName = 'Product Details'; // Show for 'inventory' last ID
            } else if (pathnames[index - 1] === 'sales') {
              displayName = 'Sale Info'; // Show for 'sales' last ID
            } else {
              displayName = name.charAt(0).toUpperCase() + name.slice(1); // Capitalize other names
            }
          } else {
            displayName = name.charAt(0).toUpperCase() + name.slice(1); // Capitalize first letter for other segments
          }

          return (
            <span key={index}>
              {displayName}
              {!isLast && ' / '}
            </span>
          );
        })
      )}
    </div>
  );
};

export default Breadcrumb;
