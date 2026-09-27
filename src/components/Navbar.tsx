import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, userProfile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const displayName =
    userProfile?.fullName ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Account';

  return (
    <header className="smartpark-header">
      <div className="smartpark-navbar-container">
        {/* Brand */}
        <Link to="/" className="smartpark-brand" aria-label="SmartPark Home">
          <span className="brand-symbol">P</span>
          <span className="brand-name">SmartPark</span>
        </Link>

        {/* Navigation Links */}
        <nav className="smartpark-nav-links" aria-label="Primary Navigation">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            end
          >
            Overview
          </NavLink>
          <NavLink
            to="/parking"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Find Parking
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/bookings"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Reservations
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Account
              </NavLink>
            </>
          )}
        </nav>

        {/* Auth / Right Actions */}
        <div className="smartpark-auth-links">
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? 'auth-link admin-pill active' : 'auth-link admin-pill'
              }
            >
              Admin Portal
            </NavLink>
          )}

          {isAuthenticated ? (
            <div className="user-auth-cluster">
              <Link to="/profile" className="user-profile-badge" title="Go to Account Settings">
                <span className="user-avatar-dot">●</span>
                <span className="user-name-label">{displayName}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="auth-link logout-btn"
                aria-label="Log Out of SmartPark"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'auth-link login active' : 'auth-link login')}
              >
                Sign in
              </NavLink>
              <NavLink
                to="/register"
                className="auth-link register"
              >
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
