import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockParkingLocations, type ParkingSlot } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Card from '../components/Card';
import './ParkingDetail.css';

export const ParkingDetail: React.FC = () => {
  const { parkingId } = useParams<{ parkingId: string }>();
  const navigate = useNavigate();

  // Find parking by ID or fallback to the first one
  const parking = mockParkingLocations.find((p) => p.id === parkingId) || mockParkingLocations[0];

  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [durationHours, setDurationHours] = useState<number>(2);
  const [vehiclePlate, setVehiclePlate] = useState<string>('KA-05-MN-2024');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationNotice, setReservationNotice] = useState<string | null>(null);

  const filteredSlots = parking.slots.filter((slot) => {
    if (selectedLevel === 'All') return true;
    return slot.level === selectedLevel;
  });

  const availableSlotsCount = parking.slots.filter((s) => s.status === 'available').length;
  const occupiedSlotsCount = parking.slots.filter((s) => s.status === 'occupied').length;
  const reservedSlotsCount = parking.slots.filter((s) => s.status === 'reserved').length;

  const currentRate = selectedSlot ? selectedSlot.pricePerHour : parking.pricePerHour;
  const estimatedTotal = currentRate * durationHours;

  const handleSlotClick = (slot: ParkingSlot) => {
    if (slot.status !== 'available') return;
    setSelectedSlot(slot);
    setReservationNotice(null);
  };

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setReservationNotice('Please select an available parking bay on the floor plan.');
      return;
    }

    setIsSubmitting(true);
    setReservationNotice(`Bay ${selectedSlot.slotNumber} selected. Preparing digital pass...`);
    setTimeout(() => {
      navigate('/booking/SP-89421');
    }, 600);
  };

  return (
    <div className="parking-detail-page smartpark-container">
      {/* Breadcrumb Navigation */}
      <div className="detail-breadcrumb">
        <Link to="/parking" className="breadcrumb-link">
          ← Facilities
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{parking.name}</span>
      </div>

      {/* Facility Header Card */}
      <div className="facility-overview-card">
        <div className="facility-overview-main">
          <div className="facility-overview-badges">
            <StatusBadge
              status={availableSlotsCount > 0 ? 'available' : 'occupied'}
              label={availableSlotsCount > 0 ? `${availableSlotsCount} Bays Open` : 'Facility Full'}
            />
            <span className="facility-rating-badge">
              ★ {parking.rating} ({parking.reviewsCount} reviews)
            </span>
          </div>

          <h1 className="facility-overview-title">{parking.name}</h1>
          <p className="facility-overview-address">{parking.address}, {parking.city}</p>
          <p className="facility-overview-desc">{parking.description}</p>

          <div className="facility-amenities-row">
            {parking.features.map((feat, idx) => (
              <span key={idx} className="amenity-pill">
                {feat}
              </span>
            ))}
          </div>
        </div>

        <div className="facility-overview-stats">
          <div className="stat-metric-cell">
            <span className="metric-tag">Hourly Rate</span>
            <span className="metric-figure">${parking.pricePerHour.toFixed(2)}/hr</span>
          </div>
          <div className="stat-metric-cell">
            <span className="metric-tag">Operating Hours</span>
            <span className="metric-figure">{parking.operatingHours}</span>
          </div>
          <div className="stat-metric-cell">
            <span className="metric-tag">Distance</span>
            <span className="metric-figure">{parking.distance}</span>
          </div>
          <div className="stat-metric-cell">
            <span className="metric-tag">Total Capacity</span>
            <span className="metric-figure">{parking.totalSlots} bays</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid & Checkout Sidebar */}
      <div className="detail-main-layout">
        {/* Left Column: Interactive Slot Floor Plan */}
        <div className="layout-col-floorplan">
          <Card padding="md" className="floorplan-card">
            <div className="floorplan-header">
              <div>
                <h2 className="floorplan-heading">Facility Floor Plan</h2>
                <p className="floorplan-subheading">Select an available open bay to reserve.</p>
              </div>

              {/* Level Filter Controls */}
              <div className="level-pills">
                <button
                  type="button"
                  className={`level-btn ${selectedLevel === 'All' ? 'active' : ''}`}
                  onClick={() => setSelectedLevel('All')}
                >
                  All Levels
                </button>
                <button
                  type="button"
                  className={`level-btn ${selectedLevel === 'L1' ? 'active' : ''}`}
                  onClick={() => setSelectedLevel('L1')}
                >
                  Level 1 (Ground)
                </button>
                <button
                  type="button"
                  className={`level-btn ${selectedLevel === 'L2' ? 'active' : ''}`}
                  onClick={() => setSelectedLevel('L2')}
                >
                  Level 2 (Upper)
                </button>
              </div>
            </div>

            {/* Visual Legend */}
            <div className="floorplan-legend">
              <div className="legend-item">
                <span className="legend-swatch swatch-available"></span>
                <span>Available ({availableSlotsCount})</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-chosen"></span>
                <span>Selected</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-occupied"></span>
                <span>Occupied ({occupiedSlotsCount})</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-reserved"></span>
                <span>Reserved ({reservedSlotsCount})</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-disabled"></span>
                <span>Maintenance</span>
              </div>
            </div>

            {/* Interactive Grid of Slots */}
            <div className="bays-grid-container" role="region" aria-label="Parking slots layout">
              {filteredSlots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                const isAvailable = slot.status === 'available';

                let slotClass = `bay-item status-${slot.status}`;
                if (isSelected) slotClass += ' is-selected';

                return (
                  <button
                    key={slot.id}
                    type="button"
                    className={slotClass}
                    onClick={() => handleSlotClick(slot)}
                    disabled={!isAvailable}
                    aria-label={`Slot ${slot.slotNumber}, Level ${slot.level}, Type ${slot.type}, Status ${slot.status}`}
                    aria-pressed={isSelected}
                  >
                    <div className="bay-top-row">
                      <span className="bay-level-tag">{slot.level}</span>
                      {slot.type === 'ev' && <span className="bay-type-badge" title="EV Charging">⚡</span>}
                      {slot.type === 'handicapped' && <span className="bay-type-badge" title="Accessible Bay">♿</span>}
                    </div>
                    <span className="bay-number">{slot.slotNumber}</span>
                    <span className="bay-state-label">
                      {isSelected ? 'SELECTED' : slot.status.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Checkout / Reservation Summary Panel */}
        <div className="layout-col-checkout">
          <Card padding="md" className="checkout-panel-card">
            <h3 className="checkout-title">Reservation Summary</h3>

            {reservationNotice && (
              <div className="checkout-alert" role="status">
                <span>{reservationNotice}</span>
              </div>
            )}

            <form onSubmit={handleReserveSubmit} className="checkout-form">
              {/* Selected Slot Information */}
              <div className="checkout-bay-box">
                <span className="checkout-field-label">Selected Bay</span>
                {selectedSlot ? (
                  <div className="chosen-bay-details">
                    <div className="chosen-bay-id">{selectedSlot.slotNumber}</div>
                    <div className="chosen-bay-specs">
                      <span>Floor: <strong>{selectedSlot.level}</strong></span>
                      <span>Type: <strong style={{ textTransform: 'uppercase' }}>{selectedSlot.type}</strong></span>
                    </div>
                    <div className="chosen-bay-rate">${selectedSlot.pricePerHour.toFixed(2)}/hr</div>
                  </div>
                ) : (
                  <div className="empty-slot-prompt">
                    Click any open green bay on the floor plan.
                  </div>
                )}
              </div>

              {/* License Plate */}
              <div className="form-group">
                <label htmlFor="vehiclePlate" className="checkout-field-label">
                  Vehicle License Plate
                </label>
                <input
                  id="vehiclePlate"
                  type="text"
                  className="checkout-input"
                  placeholder="e.g. KA-05-MN-2024"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  required
                />
              </div>

              {/* Duration Selector */}
              <div className="form-group">
                <label className="checkout-field-label">Estimated Duration</label>
                <div className="duration-button-group">
                  {[1, 2, 3, 4, 8].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      className={`btn-duration ${durationHours === hrs ? 'active' : ''}`}
                      onClick={() => setDurationHours(hrs)}
                    >
                      {hrs} hr{hrs > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="checkout-pricing-breakdown">
                <div className="pricing-line">
                  <span>Base Rate ({durationHours}h × ${currentRate.toFixed(2)})</span>
                  <span>${estimatedTotal.toFixed(2)}</span>
                </div>
                <div className="pricing-line">
                  <span>Municipal Sensor Fee</span>
                  <span className="text-free">FREE</span>
                </div>
                <div className="pricing-line total-line">
                  <span>Estimated Total</span>
                  <span className="total-amount">${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                variant={selectedSlot ? 'success' : 'primary'}
                fullWidth
                size="lg"
                disabled={!selectedSlot || isSubmitting}
              >
                {isSubmitting
                  ? 'Reserving Bay...'
                  : selectedSlot
                  ? `Reserve Bay ${selectedSlot.slotNumber} ($${estimatedTotal.toFixed(2)})`
                  : 'Select an Available Bay'}
              </Button>

              <p className="checkout-disclaimer">
                Instant digital boarding pass issued upon reservation. Free cancellation up to 15 minutes before scheduled start time.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParkingDetail;
