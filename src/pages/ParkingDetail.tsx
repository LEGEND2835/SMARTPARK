import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockParkingLocations, type ParkingSlot } from '../data/mockData';
import { useTranslation } from '../i18n';
import { createBooking } from '../firebase/bookingService';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Card from '../components/Card';
import {
  ArrowLeftIcon,
  MapPinIcon,
  ClockIcon,
  BoltIcon,
  CheckCircle2Icon,
  CarIcon,
  ArrowRightIcon,
} from '../components/Icons';
import './ParkingDetail.css';

export const ParkingDetail: React.FC = () => {
  const { parkingId } = useParams<{ parkingId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Find parking by ID or fallback to the first one
  const parking = mockParkingLocations.find((p) => p.id === parkingId) || mockParkingLocations[0];

  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [durationHours, setDurationHours] = useState<number>(2);
  const [vehiclePlate, setVehiclePlate] = useState<string>('KA-05-MN-2024');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationNotice, setReservationNotice] = useState<string | null>(null);
  const [reservationError, setReservationError] = useState<string | null>(null);

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
    setReservationError(null);
  };

  const handleReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setReservationNotice(t('detail.baySelectionRequired'));
      return;
    }

    setIsSubmitting(true);
    setReservationError(null);
    setReservationNotice(`${t('detail.selectedBayLabel')} ${selectedSlot.slotNumber} — ${t('detail.reservingBay')}`);

    try {
      const now = new Date();
      const end = new Date(now.getTime() + durationHours * 60 * 60 * 1000);
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

      const newBooking = await createBooking({
        parkingId: parking.id,
        parkingName: parking.name,
        parkingAddress: `${parking.address}, ${parking.city}`,
        slotNumber: selectedSlot.slotNumber,
        level: selectedSlot.level,
        date: dateStr,
        startTime: formatTime(now),
        endTime: formatTime(end),
        durationHours,
        totalAmount: estimatedTotal,
        vehicleNumber: vehiclePlate.trim() || 'KA-05-MN-2024',
      });

      navigate(`/booking/${newBooking.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown booking error';
      if (message === 'SLOT_ALREADY_RESERVED') {
        setReservationError('This bay has just been reserved by another user. Please choose another bay.');
      } else {
        setReservationError('Unable to complete reservation. Please check your network and try again.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="parking-detail-page smartpark-container">
      {/* Breadcrumb Navigation */}
      <div className="detail-breadcrumb">
        <Link to="/parking" className="breadcrumb-link">
          <ArrowLeftIcon size={14} className="breadcrumb-icon" />
          <span>{t('detail.allFacilities')}</span>
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
              label={availableSlotsCount > 0 ? `${availableSlotsCount} ${t('detail.baysOpen')}` : t('detail.facilityFull')}
            />
            <span className="facility-rating-badge">
              {t('detail.ratingReviews')}: {parking.rating} / 5.0 ({parking.reviewsCount})
            </span>
          </div>

          <h1 className="facility-overview-title">{parking.name}</h1>
          <p className="facility-overview-address">
            <MapPinIcon size={15} className="overview-icon" />
            <span>{parking.address}, {parking.city}</span>
          </p>
          <p className="facility-overview-desc">{parking.description}</p>

          <div className="facility-amenities-row">
            {parking.features.map((feat, idx) => (
              <span key={idx} className="amenity-pill">
                {feat.toLowerCase().includes('ev') && <BoltIcon size={13} className="amenity-icon" />}
                <span>{feat}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="facility-overview-stats">
          <div className="stat-metric-cell">
            <span className="metric-tag">{t('detail.hourlyRate')}</span>
            <span className="metric-figure">${parking.pricePerHour.toFixed(2)}/{t('common.hr')}</span>
          </div>
          <div className="stat-metric-cell">
            <span className="metric-tag">{t('detail.operatingHours')}</span>
            <span className="metric-figure">
              <ClockIcon size={13} className="stat-icon" />
              {parking.operatingHours}
            </span>
          </div>
          <div className="stat-metric-cell">
            <span className="metric-tag">{t('detail.distance')}</span>
            <span className="metric-figure">{parking.distance}</span>
          </div>
          <div className="stat-metric-cell">
            <span className="metric-tag">{t('detail.totalCapacity')}</span>
            <span className="metric-figure">{parking.totalSlots} {t('detail.totalBays')}</span>
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
                <h2 className="floorplan-heading">{t('detail.interactiveLayoutHeading')}</h2>
                <p className="floorplan-subheading">{t('detail.interactiveLayoutSubheading')}</p>
              </div>

              {/* Level Filter Controls */}
              <div className="level-pills">
                <button
                  type="button"
                  className={`level-btn ${selectedLevel === 'All' ? 'active' : ''}`}
                  onClick={() => setSelectedLevel('All')}
                >
                  {t('detail.allFloors')}
                </button>
                <button
                  type="button"
                  className={`level-btn ${selectedLevel === 'L1' ? 'active' : ''}`}
                  onClick={() => setSelectedLevel('L1')}
                >
                  L1
                </button>
                <button
                  type="button"
                  className={`level-btn ${selectedLevel === 'L2' ? 'active' : ''}`}
                  onClick={() => setSelectedLevel('L2')}
                >
                  L2
                </button>
              </div>
            </div>

            {/* Visual Legend */}
            <div className="floorplan-legend">
              <div className="legend-item">
                <span className="legend-swatch swatch-available"></span>
                <span>{t('detail.legendAvailable')} ({availableSlotsCount})</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-chosen"></span>
                <span>{t('detail.legendSelection')}</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-occupied"></span>
                <span>{t('detail.legendOccupied')} ({occupiedSlotsCount})</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-reserved"></span>
                <span>{t('detail.legendReserved')} ({reservedSlotsCount})</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-disabled"></span>
                <span>{t('detail.legendMaintenance')}</span>
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
                      {slot.type === 'ev' && (
                        <span className="bay-type-badge" title="EV Charging Bay">
                          <BoltIcon size={12} />
                        </span>
                      )}
                      {slot.type === 'handicapped' && (
                        <span className="bay-type-badge text-accessible" title="Accessible Bay">
                          ACC
                        </span>
                      )}
                    </div>
                    <span className="bay-number">{slot.slotNumber}</span>
                    <span className="bay-state-label">
                      {isSelected ? t('detail.legendSelection').toUpperCase() : t(`status.${slot.status}`).toUpperCase()}
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
            <h3 className="checkout-title">{t('detail.summaryHeading')}</h3>

            {reservationNotice && (
              <div className="checkout-alert" role="status">
                <CheckCircle2Icon size={16} className="checkout-alert-icon" />
                <span>{reservationNotice}</span>
              </div>
            )}

            <form onSubmit={handleReserveSubmit} className="checkout-form">
              {/* Selected Slot Information */}
              <div className="checkout-bay-box">
                <span className="checkout-field-label">{t('detail.selectedBayLabel')}</span>
                {selectedSlot ? (
                  <div className="chosen-bay-details">
                    <div className="chosen-bay-id">
                      <CarIcon size={18} className="chosen-bay-icon" />
                      <span>{selectedSlot.slotNumber}</span>
                    </div>
                    <div className="chosen-bay-specs">
                      <span>{t('detail.floor')}: <strong>{selectedSlot.level}</strong></span>
                      <span>{t('detail.type')}: <strong style={{ textTransform: 'uppercase' }}>{selectedSlot.type}</strong></span>
                    </div>
                    <div className="chosen-bay-rate">${selectedSlot.pricePerHour.toFixed(2)}/{t('common.hr')}</div>
                  </div>
                ) : (
                  <div className="empty-slot-prompt">
                    {t('detail.emptySlotPrompt')}
                  </div>
                )}
              </div>

              {/* License Plate */}
              <div className="form-group">
                <label htmlFor="vehiclePlate" className="checkout-field-label">
                  {t('detail.licensePlateLabel')}
                </label>
                <input
                  id="vehiclePlate"
                  type="text"
                  className="checkout-input"
                  placeholder={t('detail.licensePlatePlaceholder')}
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  required
                />
              </div>

              {/* Duration Selector */}
              <div className="form-group">
                <label className="checkout-field-label">{t('detail.estimatedDurationLabel')}</label>
                <div className="duration-button-group">
                  {[1, 2, 3, 4, 8].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      className={`btn-duration ${durationHours === hrs ? 'active' : ''}`}
                      onClick={() => setDurationHours(hrs)}
                    >
                      {hrs} {hrs > 1 ? t('common.hrs') : t('common.hr')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="checkout-pricing-breakdown">
                <div className="pricing-line">
                  <span>{t('detail.baseRate')} ({durationHours}h × ${currentRate.toFixed(2)})</span>
                  <span>${estimatedTotal.toFixed(2)}</span>
                </div>
                <div className="pricing-line">
                  <span>{t('detail.sensorFee')}</span>
                  <span className="text-free">{t('detail.feeFree')}</span>
                </div>
                <div className="pricing-line total-line">
                  <span>{t('detail.estimatedTotal')}</span>
                  <span className="total-amount">${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              {reservationError && (
                <div className="reservation-error-banner" role="alert" style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  marginBottom: '14px',
                  lineHeight: '1.4'
                }}>
                  {reservationError}
                </div>
              )}

              {/* Action Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                disabled={!selectedSlot || isSubmitting}
              >
                <span>
                  {isSubmitting
                    ? t('detail.reservingBay')
                    : selectedSlot
                    ? `${t('detail.reserveBayAction')} ($${estimatedTotal.toFixed(2)})`
                    : t('detail.selectBayToContinue')}
                </span>
                {!isSubmitting && selectedSlot && <ArrowRightIcon size={16} />}
              </Button>

              <p className="checkout-disclaimer">
                {t('detail.checkoutDisclaimer')}
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParkingDetail;

