import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockBookings, type Booking } from '../data/mockData';
import { getBookingById } from '../firebase/bookingService';
import { useTranslation } from '../i18n';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingState from '../components/LoadingState';
import {
  CheckCircle2Icon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  CarIcon,
  UserIcon,
  QrCodeIcon,
  SearchIcon,
  LayersIcon,
  ArrowRightIcon
} from '../components/Icons';
import './BookingConfirmation.css';

export const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { t } = useTranslation();
  const [booking, setBooking] = useState<Booking | null>(() => {
    return mockBookings.find((b) => b.id === bookingId) || null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(bookingId));

  useEffect(() => {
    if (!bookingId) return;
    let isMounted = true;
    getBookingById(bookingId)
      .then((fetched) => {
        if (isMounted && fetched) {
          setBooking(fetched);
        }
      })
      .catch((err) => console.warn('Error loading booking:', err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  if (isLoading && !booking) {
    return (
      <div className="confirmation-page smartpark-container" style={{ padding: '60px 0' }}>
        <LoadingState message={t('common.loading') || 'Loading reservation pass...'} fullPage={false} />
      </div>
    );
  }

  const activeBooking = booking || mockBookings[0];

  return (
    <div className="confirmation-page smartpark-container">
      <div className="confirmation-card-wrapper">
        {/* Success Header */}
        <div className="confirmation-header-banner">
          <div className="confirmation-success-badge">
            <CheckCircle2Icon size={18} />
            <span>{t('confirmation.permitIssuedBadge')}</span>
          </div>
          <h1 className="conf-title">{t('confirmation.permitTitle')}</h1>
          <p className="conf-subtitle">
            {t('confirmation.permitSubtitle')}
          </p>
        </div>

        {/* Digital Boarding Pass Ticket */}
        <Card className="parking-pass-ticket" padding="none" elevation="md">
          <div className="ticket-top">
            <div className="ticket-brand-row">
              <div className="ticket-brand">
                <div className="t-symbol">P</div>
                <div className="t-brand-titles">
                  <span className="t-name">SmartPark Pass</span>
                  <span className="t-subname">{t('confirmation.municipalAccessKey')}</span>
                </div>
              </div>
              <StatusBadge
                status={activeBooking.status}
                label={activeBooking.status === 'active' ? t('confirmation.activePermit') : t('confirmation.confirmedPermit')}
                size="sm"
              />
            </div>

            <div className="ticket-main-grid">
              <div className="ticket-garage-col">
                <span className="t-label">{t('confirmation.facilityLocation')}</span>
                <h2 className="t-garage-name">
                  <Link to={`/parking/${activeBooking.parkingId}`} className="garage-detail-link">
                    {activeBooking.parkingName}
                  </Link>
                </h2>
                <p className="t-garage-addr">
                  <MapPinIcon size={14} />
                  <span>{activeBooking.parkingAddress}</span>
                </p>
              </div>

              <div className="ticket-slot-col">
                <span className="t-label">{t('confirmation.assignedBay')}</span>
                <span className="t-slot-num">{activeBooking.slotNumber}</span>
                <span className="t-slot-floor">
                  <LayersIcon size={12} /> {t('confirmation.level')} {activeBooking.level}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Perforation Divider */}
          <div className="ticket-notch-divider" aria-hidden="true">
            <div className="notch notch-left"></div>
            <div className="notch-line"></div>
            <div className="notch notch-right"></div>
          </div>

          <div className="ticket-bottom">
            <div className="ticket-meta-grid">
              <div className="t-meta-item">
                <span className="t-label">{t('confirmation.driver')}</span>
                <div className="t-value-with-icon">
                  <UserIcon size={14} className="t-meta-icon" />
                  <span className="t-value">{activeBooking.userName}</span>
                </div>
              </div>
              <div className="t-meta-item">
                <span className="t-label">{t('confirmation.licensePlate')}</span>
                <div className="t-value-with-icon">
                  <CarIcon size={14} className="t-meta-icon" />
                  <span className="t-value font-mono plate-highlight">{activeBooking.vehicleNumber || 'KA-05-MN-2024'}</span>
                </div>
              </div>
              <div className="t-meta-item">
                <span className="t-label">{t('confirmation.reservationDate')}</span>
                <div className="t-value-with-icon">
                  <CalendarIcon size={14} className="t-meta-icon" />
                  <span className="t-value">{activeBooking.date}</span>
                </div>
              </div>
              <div className="t-meta-item">
                <span className="t-label">{t('confirmation.parkingWindow')}</span>
                <div className="t-value-with-icon">
                  <ClockIcon size={14} className="t-meta-icon" />
                  <span className="t-value">{activeBooking.startTime} – {activeBooking.endTime} ({activeBooking.durationHours}h)</span>
                </div>
              </div>
              <div className="t-meta-item">
                <span className="t-label">{t('confirmation.totalAmount')}</span>
                <span className="t-value total-figure-highlight">${activeBooking.totalAmount.toFixed(2)}</span>
              </div>
              <div className="t-meta-item">
                <span className="t-label">{t('confirmation.paymentStatus')}</span>
                <div className="t-value-with-icon status-confirmed">
                  <CheckCircle2Icon size={14} />
                  <span>{t('confirmation.authorized')}</span>
                </div>
              </div>
            </div>

            {/* QR Code / Scanner Simulation */}
            <div className="ticket-qr-section">
              <div className="qr-box-simulated">
                <QrCodeIcon size={44} />
              </div>
              <div className="qr-instructions">
                <div className="qr-header-row">
                  <strong>{t('confirmation.alprHeading')}</strong>
                  <span className="qr-status-pill">{t('confirmation.alprArmedPill')}</span>
                </div>
                <p>{t('confirmation.alprInstructions')}</p>
                <code className="qr-id-code">SP-AUTH-{activeBooking.id}-{activeBooking.slotNumber}</code>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <Button to="/bookings" variant="primary" size="md" icon={<ArrowRightIcon size={16} />}>
            {t('confirmation.viewAllReservations')}
          </Button>
          <Button to="/parking" variant="secondary" size="md" icon={<SearchIcon size={16} />}>
            {t('confirmation.findMoreParking')}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => window.print()}
          >
            {t('confirmation.printPermit')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

