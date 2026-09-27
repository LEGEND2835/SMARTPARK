import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockBookings, type Booking as BookingType } from '../data/mockData';
import { getUserBookings, cancelBooking } from '../firebase/bookingService';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import {
  CalendarIcon,
  ClockIcon,
  CarIcon,
  MapPinIcon,
  TicketIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  SearchIcon,
  LayersIcon,
} from '../components/Icons';
import './Bookings.css';

export const Bookings: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [bookingList, setBookingList] = useState<BookingType[]>(mockBookings);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getUserBookings(user?.uid || '')
      .then((bookings) => {
        if (isMounted && bookings.length > 0) {
          setBookingList(bookings);
        }
      })
      .catch((err) => console.warn('Could not fetch bookings:', err));

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  const filteredBookings = bookingList.filter((booking) => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
    } catch (err) {
      console.warn('Failed to cancel on server:', err);
    }

    setBookingList((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'cancelled' as const, paymentStatus: 'refunded' as const }
          : b
      )
    );
    setActionNotice(`${t('bookings.refNumber')} #${bookingId} ${t('status.cancelled').toLowerCase()}.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const counts = {
    all: bookingList.length,
    active: bookingList.filter((b) => b.status === 'active').length,
    upcoming: bookingList.filter((b) => b.status === 'upcoming').length,
    completed: bookingList.filter((b) => b.status === 'completed').length,
    cancelled: bookingList.filter((b) => b.status === 'cancelled').length,
  };

  return (
    <div className="bookings-page smartpark-container">
      {/* Page Header */}
      <div className="bookings-page-header">
        <div className="bookings-header-text">
          <div className="bookings-pill-tag">
            <TicketIcon size={14} aria-hidden="true" />
            <span>{t('bookings.permitManagementTag')}</span>
          </div>
          <h1 className="bookings-page-title">{t('bookings.pageTitle')}</h1>
          <p className="bookings-page-desc">
            {t('bookings.pageDesc')}
          </p>
        </div>
        <Button to="/parking" variant="primary" size="md" icon={<SearchIcon size={16} />}>
          {t('bookings.findParkingBtn')}
        </Button>
      </div>

      {actionNotice && (
        <div className="bookings-action-notice" role="status">
          <CheckCircle2Icon size={16} aria-hidden="true" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bookings-filter-tabs" role="tablist" aria-label="Reservation status filter">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'all'}
          className={`tab-filter-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span>{t('bookings.tabAll')}</span>
          <span className="tab-count-pill">{counts.all}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'active'}
          className={`tab-filter-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <span>{t('bookings.tabActive')}</span>
          <span className="tab-count-pill">{counts.active}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'upcoming'}
          className={`tab-filter-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          <span>{t('bookings.tabUpcoming')}</span>
          <span className="tab-count-pill">{counts.upcoming}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'completed'}
          className={`tab-filter-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <span>{t('bookings.tabCompleted')}</span>
          <span className="tab-count-pill">{counts.completed}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'cancelled'}
          className={`tab-filter-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          <span>{t('bookings.tabCancelled')}</span>
          <span className="tab-count-pill">{counts.cancelled}</span>
        </button>
      </div>

      {/* Bookings List */}
      <div className="bookings-list-container">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => (
            <Card key={b.id} className="booking-record-card" padding="md" elevation="sm">
              <div className="booking-card-topbar">
                <div className="booking-id-cluster">
                  <span className="booking-ref">{t('bookings.refNumber')} #{b.id}</span>
                  <StatusBadge status={b.status} size="sm" />
                </div>
                <span className="booking-timestamp">{t('bookings.bookedOn')}: {b.createdAt}</span>
              </div>

              <div className="booking-card-layout">
                {/* Facility & Slot Info */}
                <div className="booking-facility-col">
                  <h3 className="booking-facility-heading">
                    <Link to={`/parking/${b.parkingId}`} className="facility-link">
                      {b.parkingName}
                    </Link>
                  </h3>
                  <p className="booking-facility-sub">
                    <MapPinIcon size={14} aria-hidden="true" />
                    <span>{b.parkingAddress}</span>
                  </p>
                </div>

                {/* Bay Badge */}
                <div className="booking-bay-box">
                  <span className="bay-caption">{t('bookings.bayLabel')}</span>
                  <span className="bay-code">{b.slotNumber}</span>
                  <span className="bay-floor">
                    <LayersIcon size={11} aria-hidden="true" /> {t('bookings.floorLabel')} {b.level}
                  </span>
                </div>

                {/* Timing Meta */}
                <div className="booking-timing-col">
                  <div className="meta-pair">
                    <CalendarIcon size={14} className="meta-icon" aria-hidden="true" />
                    <span className="meta-k">{t('bookings.dateLabel')}:</span>
                    <span className="meta-v">{b.date}</span>
                  </div>
                  <div className="meta-pair">
                    <ClockIcon size={14} className="meta-icon" aria-hidden="true" />
                    <span className="meta-k">{t('bookings.windowLabel')}:</span>
                    <span className="meta-v">
                      {b.startTime} – {b.endTime} ({b.durationHours}h)
                    </span>
                  </div>
                  <div className="meta-pair">
                    <CarIcon size={14} className="meta-icon" aria-hidden="true" />
                    <span className="meta-k">{t('bookings.vehicleLabel')}:</span>
                    <span className="meta-v font-mono">{b.vehicleNumber}</span>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="booking-actions-col">
                  <div className="booking-total-box">
                    <span className="total-label">{t('bookings.totalLabel')}</span>
                    <span className="total-figure">${b.totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="booking-button-cluster">
                    <Button
                      to={`/booking/${b.id}`}
                      variant="primary"
                      size="sm"
                      icon={<ArrowRightIcon size={14} />}
                      iconPosition="right"
                    >
                      {t('bookings.viewPassBtn')}
                    </Button>
                    {(b.status === 'upcoming' || b.status === 'active') && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(b.id)}
                      >
                        {t('bookings.cancelBtn')}
                      </Button>
                    )}
                    {b.status === 'completed' && (
                      <Button to={`/parking/${b.parkingId}`} variant="secondary" size="sm">
                        {t('bookings.rebookBtn')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={<TicketIcon size={32} />}
            title={t('bookings.emptyTitle')}
            description={t('bookings.emptyDesc')}
            action={{
              label: t('bookings.findParkingAction'),
              to: '/parking',
              variant: 'primary',
              icon: <SearchIcon size={16} />,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Bookings;

