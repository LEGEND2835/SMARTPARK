import React from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import { LanguageSelector } from './LanguageSelector';
import {
  ParkingIcon,
  BarChart3Icon,
  BuildingIcon,
  TicketIcon,
  ArrowRightIcon,
  SunIcon,
  MoonIcon,
  ShieldCheckIcon,
} from './Icons';
import './AdminLayout.css';

export const AdminLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="admin-app-wrapper">
      {/* Top Header */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <Link to="/admin" className="admin-brand-link">
            <div className="admin-symbol">
              <ParkingIcon size={16} />
            </div>
            <span className="admin-brand-text">
              Smart<span className="brand-accent">Park</span>
            </span>
            <span className="admin-console-pill">{t('admin.operationsHubTag')}</span>
          </Link>
        </div>

        <div className="admin-topbar-right">
          <div className="admin-telemetry-pill">
            <span className="telemetry-live-dot"></span>
            <span>{t('footer.allConnected')}</span>
          </div>

          <LanguageSelector />

          <button
            type="button"
            className="theme-toggle-btn admin-theme-btn"
            onClick={toggleTheme}
            aria-label={t('nav.switchTheme')}
            title={t('nav.switchTheme')}
          >
            {theme === 'light' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
          </button>

          <Link to="/dashboard" className="btn-exit-admin">
            <span>{t('admin.exitAdmin')}</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>
      </header>

      <div className="admin-body-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar" aria-label="Operations Navigation">
          <div className="sidebar-section-title">{t('admin.pageTitle')}</div>
          <nav className="admin-nav-menu">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <BarChart3Icon size={17} className="admin-nav-icon" />
              <span className="nav-item-name">{t('admin.pageTitle')}</span>
            </NavLink>
            <NavLink
              to="/admin/parking"
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <BuildingIcon size={17} className="admin-nav-icon" />
              <span className="nav-item-name">{t('admin.manageFacilities')}</span>
            </NavLink>
            <NavLink
              to="/admin/reservations"
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <TicketIcon size={17} className="admin-nav-icon" />
              <span className="nav-item-name">{t('admin.allReservations')}</span>
            </NavLink>
          </nav>

          <div className="sidebar-footer-card">
            <div className="sidebar-hub-header">
              <ShieldCheckIcon size={14} className="hub-shield-icon" />
              <span className="sidebar-hub-title">SmartPark Grid</span>
            </div>
            <p className="sidebar-hub-desc">{t('footer.tagline')}</p>
            <span className="sidebar-ver">v3.0.0 • {t('status.active')}</span>
          </div>
        </aside>

        {/* Content View */}
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
