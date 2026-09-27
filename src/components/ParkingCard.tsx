import React from 'react';
import { Link } from 'react-router-dom';
import type { ParkingLocation } from '../data/mockData';
import StatusBadge from './StatusBadge';
import Button from './Button';
import './ParkingCard.css';

interface ParkingCardProps {
  parking: ParkingLocation;
}

export const ParkingCard: React.FC<ParkingCardProps> = ({ parking }) => {
  const isAvailable = parking.availableSlots > 0;
  const occupancyPercentage = Math.round(((parking.totalSlots - parking.availableSlots) / parking.totalSlots) * 100);

  return (
    <div className="parking-facility-card">
      <div className="facility-card-header">
        <div className="facility-status-row">
          <StatusBadge
            status={isAvailable ? 'available' : 'occupied'}
            label={isAvailable ? `${parking.availableSlots} available` : 'Full'}
            size="sm"
          />
          <span className="facility-distance">{parking.distance}</span>
        </div>
        <h3 className="facility-name">
          <Link to={`/parking/${parking.id}`} className="facility-title-link">
            {parking.name}
          </Link>
        </h3>
        <p className="facility-address">{parking.address}</p>
      </div>

      <div className="facility-card-body">
        <div className="facility-metrics-row">
          <div className="metric-box">
            <span className="metric-label">Hourly Rate</span>
            <span className="metric-value">${parking.pricePerHour.toFixed(2)}/hr</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Hours</span>
            <span className="metric-value">{parking.operatingHours}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Capacity</span>
            <span className="metric-value">{parking.availableSlots} / {parking.totalSlots}</span>
          </div>
        </div>

        {/* Subtle Capacity Gauge */}
        <div className="facility-occupancy-bar">
          <div className="occupancy-info-row">
            <span>Capacity Utilized</span>
            <span>{occupancyPercentage}%</span>
          </div>
          <div className="occupancy-track">
            <div
              className={`occupancy-fill ${occupancyPercentage > 85 ? 'fill-high' : 'fill-normal'}`}
              style={{ width: `${occupancyPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Amenity tags */}
        <div className="facility-tags-list">
          {parking.features.slice(0, 3).map((feat, idx) => (
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
          View Bays & Reserve
        </Button>
      </div>
    </div>
  );
};

export default ParkingCard;
