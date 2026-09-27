import React from 'react';
import { useParams } from 'react-router-dom';
import { mockBookings } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Card from '../components/Card';
import './BookingConfirmation.css';

export const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();

  // Find booking or fallback to first
  const booking = mockBookings.find((b) => b.id === bookingId) || mockBookings[0];

  return (
    <div className="confirmation-page smartpark-container">
      <div className="confirmation-card-wrapper">
        {/* Success Header */}
        <div className="confirmation-header-banner">
          <span className="permit-status-tag">RESERVATION CONFIRMED</span>
          <h1 className="conf-title">Parking Permit Ready</h1>
          <p className="conf-subtitle">
            Your parking bay has been reserved. Automated gate barriers will open upon reading your license plate or scanning the pass below.
          </p>
        </div>

        {/* Digital Boarding Pass Ticket */}
        <Card className="parking-pass-ticket" padding="none">
          <div className="ticket-top">
            <div className="ticket-brand-row">
              <div className="ticket-brand">
                <span className="t-symbol">P</span>
                <span className="t-name">SmartPark Permit</span>
              </div>
              <StatusBadge status={booking.status} label={booking.status === 'active' ? 'Active Pass' : 'Confirmed'} size="sm" />
            </div>

            <div className="ticket-main-grid">
              <div className="ticket-garage-col">
                <span className="t-label">FACILITY LOCATION</span>
                <h2 className="t-garage-name">{booking.parkingName}</h2>
                <p className="t-garage-addr">{booking.parkingAddress}</p>
              </div>

              <div className="ticket-slot-col">
                <span className="t-label">ASSIGNED BAY</span>
                <span className="t-slot-num">{booking.slotNumber}</span>
                <span className="t-slot-floor">Floor {booking.level}</span>
              </div>
            </div>
          </div>

          {/* Ticket Perforation Divider */}
          <div className="ticket-notch-divider">
            <div className="notch notch-left"></div>
            <div className="notch-line"></div>
            <div className="notch notch-right"></div>
          </div>

          <div className="ticket-bottom">
            <div className="ticket-meta-grid">
              <div className="t-meta-item">
                <span className="t-label">DRIVER</span>
                <span className="t-value">{booking.userName}</span>
              </div>
              <div className="t-meta-item">
                <span className="t-label">LICENSE PLATE</span>
                <span className="t-value font-mono">{booking.vehicleNumber || 'KA-05-MN-2024'}</span>
              </div>
              <div className="t-meta-item">
                <span className="t-label">DATE</span>
                <span className="t-value">{booking.date}</span>
              </div>
              <div className="t-meta-item">
                <span className="t-label">TIME WINDOW</span>
                <span className="t-value">{booking.startTime} – {booking.endTime} ({booking.durationHours}h)</span>
              </div>
              <div className="t-meta-item">
                <span className="t-label">TOTAL AMOUNT</span>
                <span className="t-value font-mono">${booking.totalAmount.toFixed(2)}</span>
              </div>
              <div className="t-meta-item">
                <span className="t-label">PAYMENT STATUS</span>
                <span className="t-value text-green">● Confirmed (Demo)</span>
              </div>
            </div>

            {/* QR Code / Scanner Simulation */}
            <div className="ticket-qr-section">
              <div className="qr-box-simulated">
                <div className="qr-pattern">
                  <div className="qr-corner top-left"></div>
                  <div className="qr-corner top-right"></div>
                  <div className="qr-corner bottom-left"></div>
                  <div className="qr-center-grid">
                    <span>■ ■ ■</span>
                    <span>■ P ■</span>
                    <span>■ ■ ■</span>
                  </div>
                </div>
              </div>
              <div className="qr-instructions">
                <strong>Gate Scanner Code</strong>
                <p>Present this barcode to the scanner column or drive up for camera recognition.</p>
                <code className="qr-id-code">SP-AUTH-{booking.id}-{booking.slotNumber}</code>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <Button to="/bookings" variant="primary" size="md">
            View All Reservations
          </Button>
          <Button to="/parking" variant="secondary" size="md">
            Find Another Garage
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => window.print()}
          >
            Print Permit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
