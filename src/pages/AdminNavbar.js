import React, { useState } from 'react';
import {
  FaClipboardList, FaFilePdf, FaPlusSquare, FaUsers, FaBars
} from 'react-icons/fa';
import { useLocation, Link } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Orders', icon: <FaClipboardList /> },
    { path: '/add-product', label: 'Products', icon: <FaPlusSquare /> },
    {/*{ path: '/add-catalog', label: 'Add Catalog', icon: <FaFilePdf /> },
    { path: '/subscribers', label: 'Subscribers', icon: <FaUsers /> } */}
  ];

  return (
    <>
      <nav className="admin-navbar">
        <div className="admin-brand">Mahaveer Enterprises</div>
        <div className="admin-nav-links">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-btn ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="admin-hamburger" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <FaBars />
        </div>
      </nav>

      {showMobileMenu && (
        <div className="admin-mobile-menu">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-btn ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setShowMobileMenu(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default AdminNavbar;
