import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockBookings, type Booking } from '../data/mockData';
import { getUserBookings } from '../firebase/bookingService';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import {
  SearchIcon,
  TicketIcon,
  CarIcon,
  ChevronRightIcon,
  ClockIcon,
  QrCodeIcon,
  BuildingIcon,
  MapPinIcon,
} from '../components/Icons';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { t } = useTranslation();
  const [bookingList, setBookingList] = useState<Booking[]>(mockBookings);

  useEffect(() => {
    let isMounted = true;
    getUserBookings(user?.uid || '')
      .then((bookings) => {
        if (isMounted && bookings.length > 0) {
          setBookingList(bookings);
        }
      })
      .catch((err) => console.warn('Could not load user dashboard bookings:', err));

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  const activeBooking = bookingList.find((b) => b.status === 'active');
  const recentBookings = bookingList.slice(0, 4);

  const activeCount = bookingList.filter((b) => b.status === 'active').length;
  const totalCount = bookingList.length;
  const hoursParked = bookingList.reduce((acc, b) => acc + (b.durationHours || 0), 0);
  const totalSpent = bookingList.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  const displayName =
    userProfile?.fullName ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    t('profile.standardDriver');


  return (
    <div className="dashboard-page smartpark-container">
      {/* Welcome Banner */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="dashboard-greeting">{t('dashboard.welcomeGreeting')}, {displayName}</h1>
          <p className="dashboard-sub">
            {t('dashboard.welcomeSub')}
          </p>
        </div>
        <div className="dashboard-header-actions">
          <Button to="/parking" variant="primary" size="md" icon={<SearchIcon size={16} />}>
            {t('dashboard.findParkingBtn')}
          </Button>
          <Button to="/bookings" variant="secondary" size="md" icon={<TicketIcon size={16} />}>
            {t('dashboard.allPassesBtn')}
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="dashboard-main-grid">
        {/* Left Primary Column */}
        <div className="dashboard-primary-col">
          {/* Active Booking Hero */}
          {activeBooking ? (
            <Card className="active-pass-card" padding="lg">
              <div className="active-pass-header">
                <div>
                  <div className="active-indicator-tag">
                    <span className="active-dot-pulse" aria-hidden="true" />
                    <span>{t('dashboard.activeReservationTag')}</span>
                  </div>
                  <h2 className="active-facility-title">{activeBooking.parkingName}</h2>
                  <p className="active-facility-address">
                    <MapPinIcon size={14} className="pass-address-icon" aria-hidden="true" />
                    <span>{activeBooking.parkingAddress}</span>
                  </p>
                </div>
                <div className="active-bay-pill">
                  <span className="bay-pill-caption">{t('dashboard.bayNumber')}</span>
                  <span className="bay-pill-code">{activeBooking.slotNumber}</span>
                  <span className="bay-pill-floor">{t('dashboard.floor')} {activeBooking.level}</span>
                </div>
              </div>

              <div className="active-spec-grid">
                <div className="active-spec-item">
                  <span className="spec-label">{t('dashboard.dateDuration')}</span>
                  <span className="spec-val">
                    {activeBooking.date} ({activeBooking.durationHours}h)
                  </span>
                </div>
                <div className="active-spec-item">
                  <span className="spec-label">{t('dashboard.timeWindow')}</span>
                  <span className="spec-val">
                    <ClockIcon size={13} className="spec-inline-icon" aria-hidden="true" />
                    {activeBooking.startTime} – {activeBooking.endTime}
                  </span>
                </div>
                <div className="active-spec-item">
                  <span className="spec-label">{t('dashboard.vehiclePlate')}</span>
                  <span className="spec-val font-mono">{activeBooking.vehicleNumber}</span>
                </div>
                <div className="active-spec-item">
                  <span className="spec-label">{t('dashboard.paymentRate')}</span>
                  <span className="spec-val text-green">
                    ${activeBooking.totalAmount.toFixed(2)} ({t('status.paid')})
                  </span>
                </div>
              </div>

              <div className="active-pass-actions">
                <Button
                  to={`/booking/${activeBooking.id}`}
                  variant="primary"
                  size="md"
                  icon={<QrCodeIcon size={16} />}
                >
                  {t('dashboard.viewPassQr')}
                </Button>
                <Button
                  to={`/parking/${activeBooking.parkingId}`}
                  variant="secondary"
                  size="md"
                  icon={<BuildingIcon size={15} />}
                >
                  {t('dashboard.facilityDetails')}
                </Button>
              </div>
            </Card>
          ) : (
            <EmptyState
              icon={<CarIcon size={32} />}
              title={t('dashboard.noActiveReservationTitle')}
              description={t('dashboard.noActiveReservationDesc')}
              action={{
                label: t('dashboard.findAvailableParkingCta'),
                to: '/parking',
                variant: 'primary',
                icon: <SearchIcon size={16} />,
              }}
            />
          )}

          {/* Quick Actions Bar */}
          <div className="quick-nav-bar">
            <h3 className="section-label">{t('dashboard.accountShortcuts')}</h3>
            <div className="quick-links-row">
              <Link to="/parking" className="quick-link-box">
                <div className="quick-icon-wrap" aria-hidden="true">
                  <SearchIcon size={18} />
                </div>
                <span className="quick-link-title">{t('dashboard.discoverGaragesTitle')}</span>
                <span className="quick-link-sub">{t('dashboard.discoverGaragesSub')}</span>
              </Link>
              <Link to="/bookings" className="quick-link-box">
                <div className="quick-icon-wrap" aria-hidden="true">
                  <TicketIcon size={18} />
                </div>
                <span className="quick-link-title">{t('dashboard.managePassesTitle')}</span>
                <span className="quick-link-sub">{t('dashboard.managePassesSub')}</span>
              </Link>
              <Link to="/profile" className="quick-link-box">
                <div className="quick-icon-wrap" aria-hidden="true">
                  <CarIcon size={18} />
                </div>
                <span className="quick-link-title">{t('dashboard.vehicleSettingsTitle')}</span>
                <span className="quick-link-sub">{t('dashboard.vehicleSettingsSub')}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Secondary Column */}
        <div className="dashboard-secondary-col">
          {/* Summary Key Metrics */}
          <Card className="summary-metrics-card" padding="md">
            <h3 className="section-label">{t('dashboard.parkingActivityHeading')}</h3>
            <div className="metrics-compact-list">
              <div className="metric-row">
                <span className="m-label">{t('dashboard.activePassesMetric')}</span>
                <span className="m-val">{activeCount}</span>
              </div>
              <div className="metric-row">
                <span className="m-label">{t('dashboard.totalBookingsMetric')}</span>
                <span className="m-val">{totalCount}</span>
              </div>
              <div className="metric-row">
                <span className="m-label">{t('dashboard.hoursParkedMetric')}</span>
                <span className="m-val">{hoursParked} {t('dashboard.hoursUnit')}</span>
              </div>
              <div className="metric-row">
                <span className="m-label">{t('dashboard.favoriteHubMetric')}</span>
                <span className="m-val val-truncate">${totalSpent.toFixed(2)} {t('dashboard.totalSpentLabel') || 'Spent'}</span>
              </div>
            </div>
          </Card>

          {/* Recent Reservations */}
          <Card className="recent-reservations-card" padding="md">
            <div className="recent-res-header">
              <h3 className="section-label">{t('dashboard.recentBookingsHeading')}</h3>
              <Link to="/bookings" className="view-link">
                <span>{t('dashboard.viewAll')}</span>
                <ChevronRightIcon size={14} aria-hidden="true" />
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
                      <span>
                        {t('dashboard.bayPrefix')} <strong>{b.slotNumber}</strong>
                      </span>
                      <span>•</span>
                      <span>{b.date}</span>
                      <span>•</span>
                      <span>${b.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <ChevronRightIcon size={16} className="recent-res-chevron" aria-hidden="true" />
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

