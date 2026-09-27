import React from 'react';
import { Link } from 'react-router-dom';
import { mockAdminStats, mockParkingLocations, mockBookings } from '../../data/mockData';
import { useTranslation } from '../../i18n';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import Card from '../../components/Card';
import {
  BuildingIcon,
  ParkingIcon,
  TicketIcon,
  BarChart3Icon,
  ArrowRightIcon,
  LayersIcon,
  MapPinIcon,
  CheckCircle2Icon,
  ClockIcon
} from '../../components/Icons';
import './AdminPages.css';

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-header-titles">
          <div className="admin-pill-tag">
            <BarChart3Icon size={13} />
            <span>{t('admin.operationsHubTag')}</span>
          </div>
          <h1 className="admin-page-title">{t('admin.pageTitle')}</h1>
          <p className="admin-page-sub">
            {t('admin.pageSub')}
          </p>
        </div>
        <div className="admin-header-actions">
          <Button to="/admin/parking" variant="primary" size="sm" icon={<BuildingIcon size={14} />}>
            {t('admin.manageFacilities')}
          </Button>
          <Button to="/admin/reservations" variant="secondary" size="sm" icon={<TicketIcon size={14} />}>
            {t('admin.allReservations')}
          </Button>
        </div>
      </div>

      {/* Admin KPI Stats Grid */}
      <div className="admin-kpi-grid">
        <Card className="kpi-card" padding="md" elevation="sm">
          <div className="kpi-top">
            <span className="kpi-title">{t('admin.activeFacilitiesKpi')}</span>
            <div className="kpi-icon-pill">
              <BuildingIcon size={15} />
            </div>
          </div>
          <span className="kpi-val">{mockAdminStats.totalLocations}</span>
          <span className="kpi-sub status-green">
            <CheckCircle2Icon size={12} /> {t('admin.facilitiesOnlineStatus')}
          </span>
        </Card>

        <Card className="kpi-card" padding="md" elevation="sm">
          <div className="kpi-top">
            <span className="kpi-title">{t('admin.monitoredBaysKpi')}</span>
            <div className="kpi-icon-pill">
              <ParkingIcon size={15} />
            </div>
          </div>
          <span className="kpi-val">{mockAdminStats.totalSlots}</span>
          <span className="kpi-sub">{t('admin.garagesCountSubtitle')}</span>
        </Card>

        <Card className="kpi-card" padding="md" elevation="sm">
          <div className="kpi-top">
            <span className="kpi-title">{t('admin.activePassesKpi')}</span>
            <div className="kpi-icon-pill">
              <TicketIcon size={15} />
            </div>
          </div>
          <span className="kpi-val">{mockAdminStats.activeReservations}</span>
          <span className="kpi-sub">{t('admin.currentlyParkedSubtitle')}</span>
        </Card>

        <Card className="kpi-card" padding="md" elevation="sm">
          <div className="kpi-top">
            <span className="kpi-title">{t('admin.revenueTodayKpi')}</span>
            <div className="kpi-icon-pill">
              <BarChart3Icon size={15} />
            </div>
          </div>
          <span className="kpi-val">${mockAdminStats.totalRevenueToday.toFixed(2)}</span>
          <span className="kpi-sub status-green">{t('admin.revenueTrendSubtitle')}</span>
        </Card>

        <Card className="kpi-card" padding="md" elevation="sm">
          <div className="kpi-top">
            <span className="kpi-title">{t('admin.occupancyRateKpi')}</span>
            <div className="kpi-icon-pill">
              <LayersIcon size={15} />
            </div>
          </div>
          <span className="kpi-val">{mockAdminStats.occupancyRate}%</span>
          <span className="kpi-sub">{t('admin.nominalCapacitySubtitle')}</span>
        </Card>
      </div>

      {/* Live Occupancy Facility Breakdown */}
      <div className="admin-grid-columns">
        <div className="admin-col-left">
          <Card className="admin-card" padding="lg" elevation="sm">
            <div className="admin-card-header-flex">
              <div>
                <h2 className="admin-card-title">{t('admin.liveOccupancyTitle')}</h2>
                <p className="admin-card-sub">{t('admin.liveOccupancySub')}</p>
              </div>
              <Link to="/admin/parking" className="admin-link">
                {t('admin.configureFacilitiesLink')} <ArrowRightIcon size={12} />
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
                        <span className="fac-city-pill">
                          <MapPinIcon size={10} /> {loc.distance}
                        </span>
                      </div>
                      <div className="fac-occ-nums">
                        <span className="fac-slots-count">
                          <strong>{loc.availableSlots}</strong> {t('admin.freeOfTotal')} {loc.totalSlots}
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
          <Card className="admin-card" padding="lg" elevation="sm">
            <h2 className="admin-card-title">{t('admin.recentGateEventsTitle')}</h2>
            <p className="admin-card-sub">{t('admin.recentGateEventsSub')}</p>

            <div className="admin-gate-feed">
              <div className="feed-item">
                <span className="feed-badge badge-entry">{t('admin.badgeEntry')}</span>
                <div className="feed-info">
                  <span className="feed-text">Plate <strong>KA-05-MN-2024</strong> entered Bay A-04</span>
                  <span className="feed-time">
                    <ClockIcon size={11} /> 2 mins ago • Metro Central
                  </span>
                </div>
              </div>

              <div className="feed-item">
                <span className="feed-badge badge-exit">{t('admin.badgeExit')}</span>
                <div className="feed-info">
                  <span className="feed-text">Plate <strong>DL-08-CC-4321</strong> exited Bay B-11</span>
                  <span className="feed-time">
                    <ClockIcon size={11} /> 14 mins ago • Civic Hub
                  </span>
                </div>
              </div>

              <div className="feed-item">
                <span className="feed-badge badge-entry">{t('admin.badgeEntry')}</span>
                <div className="feed-info">
                  <span className="feed-text">Plate <strong>MH-02-EE-9900</strong> entered Bay C-02</span>
                  <span className="feed-time">
                    <ClockIcon size={11} /> 22 mins ago • Harbor Point
                  </span>
                </div>
              </div>

              <div className="feed-item">
                <span className="feed-badge badge-res">{t('admin.badgeBooked')}</span>
                <div className="feed-info">
                  <span className="feed-text">Pass issued for Bay D-08</span>
                  <span className="feed-time">
                    <ClockIcon size={11} /> 35 mins ago • Tech Park
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Reservations Table */}
      <Card className="admin-card" padding="lg" elevation="sm">
        <div className="admin-card-header-flex">
          <div>
            <h2 className="admin-card-title">{t('admin.liveReservationQueueTitle')}</h2>
            <p className="admin-card-sub">{t('admin.liveReservationQueueSub')}</p>
          </div>
          <Link to="/admin/reservations" className="admin-link">
            {t('admin.fullReservationTable')} ({mockBookings.length}) <ArrowRightIcon size={12} />
          </Link>
        </div>

        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.colBookingId')}</th>
                <th>{t('admin.colDriver')}</th>
                <th>{t('admin.colFacility')}</th>
                <th>{t('admin.colBayLevel')}</th>
                <th>{t('admin.colSchedule')}</th>
                <th>{t('admin.colAmount')}</th>
                <th>{t('admin.colStatus')}</th>
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
                    <span className="bay-badge">{t('dashboard.bayPrefix')} {b.slotNumber} (L{b.level})</span>
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

