import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="smartpark-footer">
      <div className="smartpark-container footer-inner">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <span className="footer-brand-symbol">P</span>
              <span className="footer-brand-text">SmartPark</span>
            </div>
            <p className="footer-tagline">
              Urban parking management and instant spot reservation for modern transit hubs.
            </p>
            <div className="footer-system-status">
              <span className="status-indicator-live"></span>
              <span>All 5 City Garages Operational</span>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-nav-col">
              <h4 className="footer-heading">Platform</h4>
              <ul className="footer-links-list">
                <li><Link to="/parking">Find Parking</Link></li>
                <li><Link to="/bookings">My Reservations</Link></li>
                <li><Link to="/dashboard">User Dashboard</Link></li>
                <li><Link to="/profile">Account Settings</Link></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4 className="footer-heading">Operations</h4>
              <ul className="footer-links-list">
                <li><Link to="/admin">Admin Overview</Link></li>
                <li><Link to="/admin/parking">Facility Inventory</Link></li>
                <li><Link to="/admin/reservations">Live Bookings</Link></li>
                <li><Link to="/login">Operator Sign-in</Link></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4 className="footer-heading">Capabilities</h4>
              <ul className="footer-features-list">
                <li>EV Fast-Charging Bays</li>
                <li>Automated License Plate Access</li>
                <li>Digital Touchless Pass</li>
                <li>24/7 Monitored Facilities</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p className="footer-copy">© {new Date().getFullYear()} SmartPark Technologies. Urban Mobility Platform.</p>
          <div className="footer-meta-tags">
            <span>Real-Time Sensor Sync</span>
            <span>•</span>
            <span>Zero Search Transit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
