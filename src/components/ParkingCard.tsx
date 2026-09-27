import React from 'react';
import { Link } from 'react-router-dom';
import type { ParkingLocation } from '../data/mockData';
import { useTranslation } from '../i18n';
import StatusBadge from './StatusBadge';
import Button from './Button';
import { MapPinIcon, ClockIcon, BoltIcon, ArrowRightIcon } from './Icons';
import './ParkingCard.css';

interface ParkingCardProps {
  parking: ParkingLocation;
}

export const ParkingCard: React.FC<ParkingCardProps> = ({ parking }) => {
  const { t } = useTranslation();
  const isAvailable = parking.availableSlots > 0;
  const occupancyPercentage = Math.round(((parking.totalSlots - parking.availableSlots) / parking.totalSlots) * 100);
  const hasEv = parking.features.some(f => f.toLowerCase().includes('ev') || f.toLowerCase().includes('charging'));

  const statusLabel = isAvailable
    ? `${parking.availableSlots} ${t('common.bays')} ${t('status.available')}`
    : t('parking.facilityFull');

  return (
    <div className="parking-facility-card">
      <div className="facility-card-header">
        <div className="facility-status-row">
          <StatusBadge
            status={isAvailable ? 'available' : 'occupied'}
            label={statusLabel}
            size="sm"
          />
          <span className="facility-distance">{parking.distance}</span>
        </div>
        <h3 className="facility-name">
          <Link to={`/parking/${parking.id}`} className="facility-title-link">
            {parking.name}
          </Link>
        </h3>
        <p className="facility-address">
          <MapPinIcon size={14} className="address-icon" />
          <span>{parking.address}</span>
        </p>
      </div>

      <div className="facility-card-body">
        <div className="facility-metrics-row">
          <div className="metric-box">
            <span className="metric-label">{t('detail.hourlyRate')}</span>
            <span className="metric-value">${parking.pricePerHour.toFixed(2)}/{t('common.hr')}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">{t('parking.hours')}</span>
            <span className="metric-value">
              <ClockIcon size={12} className="metric-inline-icon" />
              {parking.operatingHours}
            </span>
          </div>
          <div className="metric-box">
            <span className="metric-label">{t('parking.capacity')}</span>
            <span className="metric-value">{parking.availableSlots} / {parking.totalSlots}</span>
          </div>
        </div>

        {/* Capacity utilization indicator */}
        <div className="facility-occupancy-bar">
          <div className="occupancy-info-row">
            <span>{t('parking.occupancy')}</span>
            <span>{occupancyPercentage}%</span>
          </div>
          <div className="occupancy-track">
            <div
              className={`occupancy-fill ${occupancyPercentage > 85 ? 'fill-high' : occupancyPercentage > 60 ? 'fill-medium' : 'fill-normal'}`}
              style={{ width: `${occupancyPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Amenity tags */}
        <div className="facility-tags-list">
          {hasEv && (
            <span className="facility-tag tag-highlight">
              <BoltIcon size={12} className="tag-icon" /> {t('home.evCharging')}
            </span>
          )}
          {parking.features
            .filter(f => !f.toLowerCase().includes('ev') && !f.toLowerCase().includes('charging'))
            .slice(0, hasEv ? 2 : 3)
            .map((feat, idx) => (
              <span key={idx} className="facility-tag">
                {feat}
              </span>
            ))}
          {parking.features.length > 3 && (
            <span className="facility-tag tag-more">+{parking.features.length - 3}</span>
          )}
        </div>
      </div>

      <div className="facility-card-footer">
        <Button to={`/parking/${parking.id}`} variant="primary" fullWidth size="md">
          <span>{t('parking.viewBaysAndReserve')}</span>
          <ArrowRightIcon size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ParkingCard;

