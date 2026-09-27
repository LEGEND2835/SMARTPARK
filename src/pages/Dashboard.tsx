import React from 'react';
import { Link } from 'react-router-dom';
import { mockBookings, mockUserStats } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Card from '../components/Card';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const activeBooking = mockBookings.find((b) => b.status === 'active');
  const recentBookings = mockBookings.slice(0, 4);

  const displayName =
    userProfile?.fullName ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Driver';

  return (
    <div className="dashboard-page smartpark-container">
      {/* Welcome Banner */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="dashboard-greeting">Welcome, {displayName}</h1>
          <p className="dashboard-sub">
            Overview of your active parking reservations, vehicle profiles, and recent activity.
          </p>
        </div>
        <div className="dashboard-header-actions">
          <Button to="/parking" variant="primary" size="md">
            Find Parking
          </Button>
          <Button to="/bookings" variant="secondary" size="md">
            All Reservations
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="dashboard-main-grid">
        {/* Left Primary Column */}
        <div className="dashboard-primary-col">
          {/* Active Booking Hero */}
          {activeBooking && (
            <Card className="active-pass-card" padding="md">
              <div className="active-pass-header">
                <div>
                  <span className="active-indicator-tag">ACTIVE RESERVATION</span>
                  <h2 className="active-facility-title">{activeBooking.parkingName}</h2>
                  <p className="active-facility-address">{activeBooking.parkingAddress}</p>
                </div>
                <div className="active-bay-pill">
                  <span className="bay-pill-caption">BAY NUMBER</span>
                  <span className="bay-pill-code">{activeBooking.slotNumber}</span>
                  <span className="bay-pill-floor">{activeBooking.level}</span>
                </div>
              </div>

              <div className="active-spec-grid">
                <div className="active-spec-item">
                  <span className="spec-label">Date & Duration</span>
                  <span className="spec-val">{activeBooking.date} ({activeBooking.durationHours}h)</span>
                </div>
                <div className="active-spec-item">
                  <span className="spec-label">Time Window</span>
                  <span className="spec-val">{activeBooking.startTime} – {activeBooking.endTime}</span>
                </div>
                <div className="active-spec-item">
                  <span className="spec-label">Vehicle Plate</span>
                  <span className="spec-val font-mono">{activeBooking.vehicleNumber}</span>
                </div>
                <div className="active-spec-item">
                  <span className="spec-label">Rate Status</span>
                  <span className="spec-val text-green">${activeBooking.totalAmount.toFixed(2)} (Confirmed)</span>
                </div>
              </div>

              <div className="active-pass-actions">
                <Button to={`/booking/${activeBooking.id}`} variant="primary" size="md">
                  View Pass & Entry QR →
                </Button>
                <Button to={`/parking/${activeBooking.parkingId}`} variant="secondary" size="md">
                  Facility Details
                </Button>
              </div>
            </Card>
          )}

          {/* Quick Actions Bar */}
          <div className="quick-nav-bar">
            <h3 className="section-label">Account Shortcuts</h3>
            <div className="quick-links-row">
              <Link to="/parking" className="quick-link-box">
                <span className="quick-link-title">Discover Garages</span>
                <span className="quick-link-sub">Find real-time open slots near destination</span>
              </Link>
              <Link to="/bookings" className="quick-link-box">
                <span className="quick-link-title">Manage Passes</span>
                <span className="quick-link-sub">View upcoming and historical receipts</span>
              </Link>
              <Link to="/profile" className="quick-link-box">
                <span className="quick-link-title">Vehicle Settings</span>
                <span className="quick-link-sub">Register license plates for touchless ALPR</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Secondary Column */}
        <div className="dashboard-secondary-col">
          {/* Subtle Key Metrics */}
          <Card className="summary-metrics-card" padding="md">
            <h3 className="section-label">Parking Activity</h3>
            <div className="metrics-compact-list">
              <div className="metric-row">
                <span className="m-label">Active Bookings</span>
                <span className="m-val">{mockUserStats.activeBookings}</span>
              </div>
              <div className="metric-row">
                <span className="m-label">Lifetime Bookings</span>
                <span className="m-val">{mockUserStats.totalBookings}</span>
              </div>
              <div className="metric-row">
                <span className="m-label">Total Hours Parked</span>
                <span className="m-val">{mockUserStats.hoursParked} hrs</span>
              </div>
              <div className="metric-row">
                <span className="m-label">Frequent Garage</span>
                <span className="m-val val-truncate">{mockUserStats.favoriteParking}</span>
              </div>
            </div>
          </Card>

          {/* Recent Reservations */}
          <Card className="recent-reservations-card" padding="md">
            <div className="recent-res-header">
              <h3 className="section-label">Recent Bookings</h3>
              <Link to="/bookings" className="view-link">
                All →
              </Link>
            </div>

            <div className="recent-res-list">
              {recentBookings.map((b) => (
                <Link to={`/booking/${b.id}`} key={b.id} className="recent-res-item">
                  <div className="recent-res-main">
                    <div className="recent-res-title-row">
                      <span className="recent-garage-name">{b.parkingName}</span>
                      <StatusBadge status={b.status} size="sm" />
                    </div>
                    <div className="recent-res-meta">
                      <span>Bay <strong>{b.slotNumber}</strong></span>
                      <span>•</span>
                      <span>{b.date}</span>
                      <span>•</span>
                      <span>${b.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <span className="recent-res-arrow">→</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
