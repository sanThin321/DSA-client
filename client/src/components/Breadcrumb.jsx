import React from 'react';
import { useLocation } from 'react-router-dom';
import './css/Breadcrumb.css'; // Import the CSS for styling

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x); // Split the path and filter out empty segments

  return (
    <div className="breadcrumb">
      {pathnames.length === 0 ? (
        <h5 className='mb-0'>Dashboard</h5>
      ) : (
        pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;

          let displayName;

          if (name === 'inventory') {
            displayName = 'Inventory';
          } 
          else if (name === 'reports') {
            displayName = 'Reports';
          }
          
          else if (name === 'add-sale') {
            displayName = 'Add Sale'; 
          }
          else if (isLast) {
            if (pathnames[index - 1] === 'inventory') {
              displayName = 'Product Details'; 
            } else if (pathnames[index - 1] === 'sales') {
              displayName = 'Sale Info'; 
            } else {
              displayName = name.charAt(0).toUpperCase() + name.slice(1);
            }
          } else {
            displayName = name.charAt(0).toUpperCase() + name.slice(1); 
          }

          return (
            <h5 className='mb-0' key={index}>
              {displayName}
              {!isLast && ' / '}
            </h5>
          );
        })
      )}
    </div>
  );
};

export default Breadcrumb;
