import React from 'react';
import { Link } from 'react-router-dom';
import { mockAdminStats, mockParkingLocations, mockBookings } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import Card from '../../components/Card';
import './AdminPages.css';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-badge-sub">OPERATIONS & OCCUPANCY</span>
          <h1 className="admin-page-title">City Parking Control Hub</h1>
          <p className="admin-page-sub">
            Real-time IoT telemetry, automated barrier events, and live occupancy across all 5 municipal facilities.
          </p>
        </div>
        <div className="admin-header-actions">
          <Button to="/admin/parking" variant="primary" size="sm">
            Manage Facilities
          </Button>
          <Button to="/admin/reservations" variant="secondary" size="sm">
            All Reservations
          </Button>
        </div>
      </div>

      {/* Admin KPI Stats Grid */}
      <div className="admin-kpi-grid">
        <Card className="kpi-card">
          <span className="kpi-title">Active Facilities</span>
          <span className="kpi-val">{mockAdminStats.totalLocations}</span>
          <span className="kpi-sub status-green">100% Online & Synced</span>
        </Card>

        <Card className="kpi-card">
          <span className="kpi-title">Monitored Bays</span>
          <span className="kpi-val">{mockAdminStats.totalSlots}</span>
          <span className="kpi-sub">5 Downtown Garages</span>
        </Card>

        <Card className="kpi-card">
          <span className="kpi-title">Active Passes</span>
          <span className="kpi-val">{mockAdminStats.activeReservations}</span>
          <span className="kpi-sub">Currently parked</span>
        </Card>

        <Card className="kpi-card">
          <span className="kpi-title">Est. Revenue (Today)</span>
          <span className="kpi-val">${mockAdminStats.totalRevenueToday.toFixed(2)}</span>
          <span className="kpi-sub status-green">+14.2% vs last week</span>
        </Card>

        <Card className="kpi-card">
          <span className="kpi-title">Citywide Occupancy</span>
          <span className="kpi-val">{mockAdminStats.occupancyRate}%</span>
          <span className="kpi-sub">Optimal capacity</span>
        </Card>
      </div>

      {/* Live Occupancy Facility Breakdown */}
      <div className="admin-grid-columns">
        <div className="admin-col-left">
          <Card className="admin-card" padding="lg">
            <div className="admin-card-header-flex">
              <div>
                <h2 className="admin-card-title">Live Facility Occupancy</h2>
                <p className="admin-card-sub">Real-time ultrasonic bay detector counts per parking structure.</p>
              </div>
              <Link to="/admin/parking" className="admin-link">
                Configure Facilities →
              </Link>
            </div>

            <div className="facility-occupancy-list">
              {mockParkingLocations.map((loc) => {
                const occ = Math.round(((loc.totalSlots - loc.availableSlots) / loc.totalSlots) * 100);
                return (
                  <div key={loc.id} className="facility-occupancy-item">
                    <div className="fac-occ-header">
                      <div className="fac-occ-title-group">
                        <span className="fac-name">{loc.name}</span>
                        <span className="fac-city-pill">{loc.distance}</span>
                      </div>
                      <div className="fac-occ-nums">
                        <span className="fac-slots-count">
                          <strong>{loc.availableSlots}</strong> free of {loc.totalSlots}
                        </span>
                        <span className="fac-percent">{occ}%</span>
                      </div>
                    </div>

                    <div className="occ-progress-track">
                      <div
                        className={`occ-progress-fill ${occ > 80 ? 'fill-red' : occ > 50 ? 'fill-amber' : 'fill-green'}`}
                        style={{ width: `${occ}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Recent Admin Activity / Feed */}
        <div className="admin-col-right">
          <Card className="admin-card" padding="lg">
            <h2 className="admin-card-title">Recent Gate Events</h2>
            <p className="admin-card-sub">License plate recognition (ALPR) automated barrier log.</p>

            <div className="admin-gate-feed">
              <div className="feed-item">
                <span className="feed-badge badge-entry">ENTRY</span>
                <div className="feed-info">
                  <span className="feed-text">Plate <strong>KA-05-MN-2024</strong> entered Bay A-04</span>
                  <span className="feed-time">2 mins ago • Metro Central</span>
                </div>
              </div>

              <div className="feed-item">
                <span className="feed-badge badge-exit">EXIT</span>
                <div className="feed-info">
                  <span className="feed-text">Plate <strong>DL-08-CC-4321</strong> exited Bay B-11</span>
                  <span className="feed-time">14 mins ago • Civic Hub</span>
                </div>
              </div>

              <div className="feed-item">
                <span className="feed-badge badge-entry">ENTRY</span>
                <div className="feed-info">
                  <span className="feed-text">Plate <strong>MH-02-EE-9900</strong> entered Bay C-02</span>
                  <span className="feed-time">22 mins ago • Harbor Point</span>
                </div>
              </div>

              <div className="feed-item">
                <span className="feed-badge badge-res">BOOKED</span>
                <div className="feed-info">
                  <span className="feed-text">Pass issued for Bay D-08</span>
                  <span className="feed-time">35 mins ago • Tech Park</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Reservations Table */}
      <Card className="admin-card" padding="lg">
        <div className="admin-card-header-flex">
          <div>
            <h2 className="admin-card-title">Live Reservation Queue</h2>
            <p className="admin-card-sub">Active and upcoming booked parking sessions across all facilities.</p>
          </div>
          <Link to="/admin/reservations" className="admin-link">
            Full Reservation Table ({mockBookings.length}) →
          </Link>
        </div>

        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Driver Name</th>
                <th>Facility</th>
                <th>Bay & Floor</th>
                <th>Schedule</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockBookings.map((b) => (
                <tr key={b.id}>
                  <td><code className="admin-code-pill">{b.id}</code></td>
                  <td>
                    <div className="driver-cell">
                      <span className="driver-name">{b.userName}</span>
                      <span className="driver-email">{b.userEmail}</span>
                    </div>
                  </td>
                  <td>{b.parkingName}</td>
                  <td>
                    <span className="bay-badge">Bay {b.slotNumber} ({b.level})</span>
                  </td>
                  <td>{b.date} • {b.startTime}</td>
                  <td><strong>${b.totalAmount.toFixed(2)}</strong></td>
                  <td><StatusBadge status={b.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
