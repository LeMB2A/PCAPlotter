import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'

const Sidebar = ({ apps }) => {
  return (
    <div className="sidebar">
      <h2>PCAPlotter</h2>
      <ul>
        <li key="all">
          <NavLink 
            to="/"
            className={({ isActive }) =>
              isActive ? "sidebar-active" : "sidebar-nonactive"
            }
            >
            All Apps
          </NavLink>   
        </li>
        {apps.map((app) => (
          <li key={app} >
            <NavLink 
              to={`/${app}`}
              className={({ isActive }) =>
                isActive ? "sidebar-active" : "sidebar-nonactive"
              }
            >
              {app[0].toUpperCase() + app.slice(1)}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
