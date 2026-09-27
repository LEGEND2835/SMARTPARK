import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockBookings, type Booking as BookingType } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Card from '../components/Card';
import './Bookings.css';

export const Bookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [bookingList, setBookingList] = useState<BookingType[]>(mockBookings);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredBookings = bookingList.filter((booking) => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  const handleCancelBooking = (bookingId: string) => {
    setBookingList((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const, paymentStatus: 'refunded' as const } : b))
    );
    setActionNotice(`Booking #${bookingId} has been cancelled.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="bookings-page smartpark-container">
      {/* Page Header */}
      <div className="bookings-page-header">
        <div>
          <h1 className="bookings-page-title">Reservations</h1>
          <p className="bookings-page-desc">
            Manage your active digital permits, view scheduled parking windows, and access receipts.
          </p>
        </div>
        <Button to="/parking" variant="primary" size="md">
          Find Parking
        </Button>
      </div>

      {actionNotice && (
        <div className="bookings-action-notice" role="status">
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bookings-filter-tabs">
        <button
          type="button"
          className={`tab-filter-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({bookingList.length})
        </button>
        <button
          type="button"
          className={`tab-filter-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active ({bookingList.filter((b) => b.status === 'active').length})
        </button>
        <button
          type="button"
          className={`tab-filter-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({bookingList.filter((b) => b.status === 'upcoming').length})
        </button>
        <button
          type="button"
          className={`tab-filter-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({bookingList.filter((b) => b.status === 'completed').length})
        </button>
        <button
          type="button"
          className={`tab-filter-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled ({bookingList.filter((b) => b.status === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="bookings-list-container">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => (
            <Card key={b.id} className="booking-record-card" padding="md">
              <div className="booking-card-topbar">
                <div className="booking-id-cluster">
                  <span className="booking-ref">REF #{b.id}</span>
                  <StatusBadge status={b.status} size="sm" />
                </div>
                <span className="booking-timestamp">Booked: {b.createdAt}</span>
              </div>

              <div className="booking-card-layout">
                {/* Facility & Slot Info */}
                <div className="booking-facility-col">
                  <h3 className="booking-facility-heading">
                    <Link to={`/parking/${b.parkingId}`} className="facility-link">
                      {b.parkingName}
                    </Link>
                  </h3>
                  <p className="booking-facility-sub">{b.parkingAddress}</p>
                </div>

                {/* Bay Badge */}
                <div className="booking-bay-box">
                  <span className="bay-caption">Bay</span>
                  <span className="bay-code">{b.slotNumber}</span>
                  <span className="bay-floor">Floor {b.level}</span>
                </div>

                {/* Timing Meta */}
                <div className="booking-timing-col">
                  <div className="meta-pair">
                    <span className="meta-k">Date:</span>
                    <span className="meta-v">{b.date}</span>
                  </div>
                  <div className="meta-pair">
                    <span className="meta-k">Window:</span>
                    <span className="meta-v">{b.startTime} – {b.endTime} ({b.durationHours}h)</span>
                  </div>
                  <div className="meta-pair">
                    <span className="meta-k">Vehicle:</span>
                    <span className="meta-v font-mono">{b.vehicleNumber}</span>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="booking-actions-col">
                  <div className="booking-total-box">
                    <span className="total-label">Total</span>
                    <span className="total-figure">${b.totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="booking-button-cluster">
                    <Button to={`/booking/${b.id}`} variant="primary" size="sm">
                      View Pass
                    </Button>
                    {(b.status === 'upcoming' || b.status === 'active') && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(b.id)}
                      >
                        Cancel
                      </Button>
                    )}
                    {b.status === 'completed' && (
                      <Button to={`/parking/${b.parkingId}`} variant="secondary" size="sm">
                        Rebook
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="empty-bookings-box">
            <h3>No Reservations in this View</h3>
            <p>You have no {activeTab !== 'all' ? activeTab : ''} parking passes recorded.</p>
            <Button to="/parking" variant="primary" size="md">
              Browse Available Garages
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
