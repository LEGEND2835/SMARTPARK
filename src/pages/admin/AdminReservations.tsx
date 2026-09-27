import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockBookings, type Booking } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';
import Card from '../../components/Card';
import './AdminPages.css';

export const AdminReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Booking[]>(mockBookings);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredReservations = reservations.filter((res) => {
    const q = searchFilter.toLowerCase().trim();
    const matchesSearch =
      !q ||
      res.id.toLowerCase().includes(q) ||
      res.userName.toLowerCase().includes(q) ||
      res.parkingName.toLowerCase().includes(q) ||
      (res.vehicleNumber && res.vehicleNumber.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && res.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = (id: string, newStatus: 'active' | 'completed' | 'cancelled') => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    setActionNotice(`Reservation #${id} status changed to "${newStatus.toUpperCase()}" (Mock Mode).`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-badge-sub">TRANSACTION & SESSION LOG</span>
          <h1 className="admin-page-title">City Reservations</h1>
          <p className="admin-page-sub">
            Monitor vehicle check-ins, license plate recognition matches, and payment settlements across all garages.
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="admin-alert-banner" role="status">
          <span>✓</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-input-box">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by Pass ID, Driver Name, Facility, or Plate..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>

        <div className="admin-filter-tabs">
          {['all', 'active', 'upcoming', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              type="button"
              className={`filter-tab-pill ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <Card className="admin-card" padding="none">
        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Driver & Vehicle</th>
                <th>Facility & Bay</th>
                <th>Schedule</th>
                <th>Amount & Settlement</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((res) => (
                <tr key={res.id}>
                  <td>
                    <Link to={`/booking/${res.id}`} className="admin-id-link" title="Open digital pass">
                      <code className="admin-code-pill">{res.id}</code>
                    </Link>
                  </td>
                  <td>
                    <div className="driver-cell">
                      <strong className="driver-name">{res.userName}</strong>
                      <span className="driver-email">{res.userEmail}</span>
                      <span className="driver-plate">{res.vehicleNumber || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="fac-table-col">
                      <span className="fac-title-strong">{res.parkingName}</span>
                      <span className="bay-badge">Bay {res.slotNumber} ({res.level})</span>
                    </div>
                  </td>
                  <td>
                    <div className="schedule-cell">
                      <span className="sched-date">{res.date}</span>
                      <span className="sched-time">{res.startTime} - {res.endTime} ({res.durationHours}h)</span>
                    </div>
                  </td>
                  <td>
                    <div className="amount-cell">
                      <span className="amt-val">${res.totalAmount.toFixed(2)}</span>
                      <span className="amt-status">{res.paymentStatus.toUpperCase()}</span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={res.status} size="sm" />
                  </td>
                  <td>
                    <div className="action-btn-group">
                      {res.status === 'upcoming' && (
                        <button
                          type="button"
                          className="table-btn-checkin"
                          onClick={() => handleUpdateStatus(res.id, 'active')}
                          title="Manually trigger barrier check-in"
                        >
                          Check In
                        </button>
                      )}
                      {res.status === 'active' && (
                        <button
                          type="button"
                          className="table-btn-checkout"
                          onClick={() => handleUpdateStatus(res.id, 'completed')}
                          title="Manually complete parking session"
                        >
                          Exit Gate
                        </button>
                      )}
                      {(res.status === 'upcoming' || res.status === 'active') && (
                        <button
                          type="button"
                          className="table-btn-del"
                          onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                          title="Cancel and issue refund"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminReservations;
