import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockBookings, type Booking } from '../../data/mockData';
import { useTranslation } from '../../i18n';
import StatusBadge from '../../components/StatusBadge';
import Card from '../../components/Card';
import {
  TicketIcon,
  SearchIcon,
  XIcon,
  CheckCircle2Icon,
  CarIcon,
  ClockIcon
} from '../../components/Icons';
import './AdminPages.css';

export const AdminReservations: React.FC = () => {
  const { t } = useTranslation();
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
    setActionNotice(`${t('bookings.refNumber')} #${id} ${t(`status.${newStatus}`).toLowerCase()}.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const getStatusCount = (st: string) => {
    if (st === 'all') return reservations.length;
    return reservations.filter((r) => r.status === st).length;
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-header-titles">
          <div className="admin-pill-tag">
            <TicketIcon size={13} />
            <span>{t('admin.allReservations')}</span>
          </div>
          <h1 className="admin-page-title">{t('admin.reservationsManagementTitle')}</h1>
          <p className="admin-page-sub">
            {t('admin.reservationsManagementSub')}
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="admin-alert-banner" role="status">
          <CheckCircle2Icon size={16} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-input-box">
          <SearchIcon size={16} className="search-box-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder={t('parking.searchPlaceholder')}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
          {searchFilter && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchFilter('')}
              aria-label={t('parking.clearSearch')}
            >
              <XIcon size={14} />
            </button>
          )}
        </div>

        <div className="admin-filter-tabs">
          {(['all', 'active', 'upcoming', 'completed', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              type="button"
              className={`filter-tab-pill ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              <span>{st === 'all' ? t('bookings.tabAll') : t(`status.${st}`)}</span>
              <span className="tab-pill-count">{getStatusCount(st)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <Card className="admin-card" padding="none" elevation="sm">
        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.colBookingId')}</th>
                <th>{t('admin.colDriver')}</th>
                <th>{t('admin.colFacility')}</th>
                <th>{t('admin.colSchedule')}</th>
                <th>{t('admin.colAmount')}</th>
                <th>{t('admin.colStatus')}</th>
                <th>{t('admin.operationsHubTag')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length > 0 ? (
                filteredReservations.map((res) => (
                  <tr key={res.id}>
                    <td>
                      <Link to={`/booking/${res.id}`} className="admin-id-link" title={t('bookings.viewPassBtn')}>
                        <code className="admin-code-pill">{res.id}</code>
                      </Link>
                    </td>
                    <td>
                      <div className="driver-cell">
                        <strong className="driver-name">{res.userName}</strong>
                        <span className="driver-email">{res.userEmail}</span>
                        <span className="driver-plate">
                          <CarIcon size={11} /> {res.vehicleNumber || 'KA-05-MN-2024'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="fac-table-col">
                        <span className="fac-title-strong">{res.parkingName}</span>
                        <span className="bay-badge">
                          {t('dashboard.bayPrefix')} {res.slotNumber} (L{res.level})
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="schedule-cell">
                        <span className="sched-date">{res.date}</span>
                        <span className="sched-time">
                          <ClockIcon size={11} /> {res.startTime} - {res.endTime} ({res.durationHours}h)
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="amount-cell">
                        <span className="amt-val">${res.totalAmount.toFixed(2)}</span>
                        <span className="amt-status">{t(`status.${res.paymentStatus}`).toUpperCase()}</span>
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
                          >
                            {t('status.active')}
                          </button>
                        )}
                        {res.status === 'active' && (
                          <button
                            type="button"
                            className="table-btn-checkout"
                            onClick={() => handleUpdateStatus(res.id, 'completed')}
                          >
                            {t('status.completed')}
                          </button>
                        )}
                        {(res.status === 'upcoming' || res.status === 'active') && (
                          <button
                            type="button"
                            className="table-btn-del"
                            onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                          >
                            {t('common.cancel')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="admin-empty-table-cell">
                    <p>{t('bookings.emptyDesc')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminReservations;

