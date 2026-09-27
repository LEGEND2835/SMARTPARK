import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { LanguageSelector } from './LanguageSelector';
import {
  ParkingIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  ShieldCheckIcon,
} from './Icons';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, userProfile, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const displayName =
    userProfile?.fullName ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    t('nav.profile');

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="smartpark-header">
      <div className="smartpark-navbar-container">
        {/* Brand */}
        <Link
          to="/"
          className="smartpark-brand"
          aria-label="SmartPark"
          onClick={closeMobileMenu}
        >
          <div className="brand-badge" aria-hidden="true">
            <ParkingIcon size={18} className="brand-badge-icon" />
          </div>
          <span className="brand-name">
            Smart<span className="brand-accent">Park</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="smartpark-nav-links" aria-label="Primary Navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
            end
          >
            {t('nav.explore')}
          </NavLink>
          <NavLink
            to="/parking"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            {t('nav.findParking')}
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                {t('nav.dashboard')}
              </NavLink>
              <NavLink
                to="/bookings"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                {t('nav.reservations')}
              </NavLink>
            </>
          )}
        </nav>

        {/* Desktop Controls (Language + Theme + Auth) */}
        <div className="smartpark-actions-cluster">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={t('nav.switchTheme')}
            title={t('nav.switchTheme')}
          >
            {theme === 'light' ? (
              <MoonIcon size={17} aria-hidden="true" />
            ) : (
              <SunIcon size={17} aria-hidden="true" />
            )}
          </button>

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? 'admin-pill-link active' : 'admin-pill-link'
              }
              title={t('nav.adminPortal')}
            >
              <ShieldCheckIcon size={14} aria-hidden="true" />
              <span>{t('nav.adminPortal')}</span>
            </NavLink>
          )}

          {isAuthenticated ? (
            <div className="user-profile-cluster">
              <Link
                to="/profile"
                className="user-profile-btn"
                title={t('nav.profile')}
                aria-label={`${t('nav.profile')}: ${displayName}`}
              >
                <UserIcon size={15} className="user-btn-icon" aria-hidden="true" />
                <span className="user-display-text">{displayName}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-logout"
                title={t('nav.signOut')}
                aria-label={t('nav.signOut')}
              >
                <LogOutIcon size={16} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="guest-auth-cluster">
              <Link to="/login" className="btn-signin">
                {t('nav.signIn')}
              </Link>
              <Link to="/register" className="btn-signup">
                {t('nav.getStarted')}
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? t('nav.menuClose') : t('nav.menuOpen')}
          >
            {mobileMenuOpen ? (
              <XIcon size={20} aria-hidden="true" />
            ) : (
              <MenuIcon size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <nav className="mobile-nav-list">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'mobile-nav-item active' : 'mobile-nav-item'
              }
              end
              onClick={closeMobileMenu}
            >
              {t('nav.explore')}
            </NavLink>
            <NavLink
              to="/parking"
              className={({ isActive }) =>
                isActive ? 'mobile-nav-item active' : 'mobile-nav-item'
              }
              onClick={closeMobileMenu}
            >
              {t('nav.findParking')}
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? 'mobile-nav-item active' : 'mobile-nav-item'
                  }
                  onClick={closeMobileMenu}
                >
                  {t('nav.dashboard')}
                </NavLink>
                <NavLink
                  to="/bookings"
                  className={({ isActive }) =>
                    isActive ? 'mobile-nav-item active' : 'mobile-nav-item'
                  }
                  onClick={closeMobileMenu}
                >
                  {t('nav.reservations')}
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? 'mobile-nav-item active' : 'mobile-nav-item'
                  }
                  onClick={closeMobileMenu}
                >
                  {t('nav.profile')}
                </NavLink>

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      isActive ? 'mobile-nav-item active' : 'mobile-nav-item'
                    }
                    onClick={closeMobileMenu}
                  >
                    {t('nav.adminPortal')}
                  </NavLink>
                )}

                <div className="mobile-nav-divider" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mobile-logout-btn"
                >
                  <LogOutIcon size={18} aria-hidden="true" />
                  <span>{t('nav.signOut')} ({displayName})</span>
                </button>
              </>
            ) : (
              <>
                <div className="mobile-nav-divider" />
                <Link
                  to="/login"
                  className="mobile-nav-item auth-action"
                  onClick={closeMobileMenu}
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/register"
                  className="mobile-nav-item auth-action-primary"
                  onClick={closeMobileMenu}
                >
                  {t('nav.getStarted')}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
