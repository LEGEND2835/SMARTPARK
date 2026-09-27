import React from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import './AdminLayout.css';

export const AdminLayout: React.FC = () => {
  return (
    <div className="admin-app-wrapper">
      {/* Top Header */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <Link to="/admin" className="admin-brand-link">
            <span className="admin-symbol">P</span>
            <span className="admin-brand-text">SmartPark</span>
            <span className="admin-console-pill">Operations Console</span>
          </Link>
        </div>

        <div className="admin-topbar-right">
          <div className="admin-telemetry-pill">
            <span className="telemetry-live-dot"></span>
            <span>IoT Sensors Active (5/5)</span>
          </div>
          <Link to="/dashboard" className="btn-exit-admin">
            Exit to App →
          </Link>
        </div>
      </header>

      <div className="admin-body-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar" aria-label="Operations Navigation">
          <div className="sidebar-section-title">Operations</div>
          <nav className="admin-nav-menu">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <span className="nav-item-name">Overview & Metrics</span>
            </NavLink>
            <NavLink
              to="/admin/parking"
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <span className="nav-item-name">Facility Inventory</span>
            </NavLink>
            <NavLink
              to="/admin/reservations"
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              <span className="nav-item-name">Active Reservations</span>
            </NavLink>
          </nav>

          <div className="sidebar-footer-card">
            <span className="sidebar-hub-title">City Network</span>
            <p className="sidebar-hub-desc">Gateway connected to Municipal Transit Grid.</p>
            <span className="sidebar-ver">v2.4.0 • Node Live</span>
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
