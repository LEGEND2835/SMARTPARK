import React, { useState } from 'react';
import { mockParkingLocations, type ParkingLocation } from '../../data/mockData';
import { useTranslation } from '../../i18n';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import Card from '../../components/Card';
import {
  BuildingIcon,
  MapPinIcon,
  CheckCircle2Icon,
  XIcon,
  CheckIcon,
  LayersIcon
} from '../../components/Icons';
import './AdminPages.css';

export const AdminParking: React.FC = () => {
  const { t } = useTranslation();
  const [locations, setLocations] = useState<ParkingLocation[]>(mockParkingLocations);
  const [notice, setNotice] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFacilityName, setNewFacilityName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newTotalSlots, setNewTotalSlots] = useState(100);
  const [newPrice, setNewPrice] = useState(4.0);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`${t('common.confirm') || 'Confirm'}: ${name}?`)) {
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
      setNotice(`${t('admin.colFacility')}: "${name}" ${t('status.unavailable').toLowerCase()}.`);
      setTimeout(() => setNotice(null), 3500);
    }
  };

  const handleAddFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacilityName.trim() || !newAddress.trim()) return;

    const newLoc: ParkingLocation = {
      id: `pk-${Date.now()}`,
      name: newFacilityName,
      address: newAddress,
      city: 'Metro City',
      distance: '0.8 km away',
      operatingHours: 'Open 24/7',
      pricePerHour: newPrice,
      totalSlots: newTotalSlots,
      availableSlots: newTotalSlots,
      rating: 5.0,
      reviewsCount: 1,
      features: ['Automated Barrier', 'CCTV 24/7', 'EV Bays'],
      description: 'Newly added municipal parking facility.',
      slots: [],
    };

    setLocations([newLoc, ...locations]);
    setShowAddModal(false);
    setNewFacilityName('');
    setNewAddress('');
    setNotice(`${t('admin.addNewFacility')}: "${newLoc.name}" (${t('status.available')})`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-header-titles">
          <div className="admin-pill-tag">
            <BuildingIcon size={13} />
            <span>{t('admin.manageFacilities')}</span>
          </div>
          <h1 className="admin-page-title">{t('admin.facilityInventoryTitle')}</h1>
          <p className="admin-page-sub">
            {t('admin.facilityInventorySub')}
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          icon={<BuildingIcon size={14} />}
          onClick={() => setShowAddModal(true)}
        >
          {t('admin.addNewFacility')}
        </Button>
      </div>

      {notice && (
        <div className="admin-alert-banner" role="status">
          <CheckCircle2Icon size={16} />
          <span>{notice}</span>
        </div>
      )}

      {/* Add Facility Modal / Card */}
      {showAddModal && (
        <Card className="admin-form-modal-card" padding="lg" elevation="md">
          <div className="modal-header-row">
            <div>
              <h3 className="modal-title">{t('admin.addNewFacility')}</h3>
              <p className="modal-sub">{t('admin.facilityInventorySub')}</p>
            </div>
            <button
              type="button"
              className="close-btn"
              onClick={() => setShowAddModal(false)}
              aria-label={t('common.close')}
            >
              <XIcon size={16} />
            </button>
          </div>

          <form onSubmit={handleAddFacility} className="admin-modal-form">
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="f-name" className="form-label">{t('admin.colFacility')}</label>
                <input
                  id="f-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Airport South Terminal Deck"
                  value={newFacilityName}
                  onChange={(e) => setNewFacilityName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="f-addr" className="form-label">{t('detail.facilityLocation')}</label>
                <input
                  id="f-addr"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 500 Aviation Way, Metro City"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="f-slots" className="form-label">{t('parking.capacity')}</label>
                <input
                  id="f-slots"
                  type="number"
                  className="form-input"
                  value={newTotalSlots}
                  onChange={(e) => setNewTotalSlots(Number(e.target.value))}
                  min={10}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="f-price" className="form-label">{t('detail.hourlyRate')} ($)</label>
                <input
                  id="f-price"
                  type="number"
                  step="0.25"
                  className="form-input"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  min={1}
                  required
                />
              </div>
            </div>

            <div className="modal-btn-row">
              <Button type="submit" variant="primary" size="md" icon={<CheckIcon size={14} />}>
                {t('common.save')}
              </Button>
              <Button type="button" variant="secondary" size="md" onClick={() => setShowAddModal(false)}>
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Facilities Table */}
      <Card className="admin-card" padding="none" elevation="sm">
        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.colFacility')}</th>
                <th>{t('parking.capacity')}</th>
                <th>{t('status.available')}</th>
                <th>{t('detail.hourlyRate')}</th>
                <th>{t('parking.hours')}</th>
                <th>{t('admin.colStatus')}</th>
                <th>{t('admin.operationsHubTag')}</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => {
                const isAvail = loc.availableSlots > 0;
                return (
                  <tr key={loc.id}>
                    <td>
                      <div className="fac-table-col">
                        <strong className="fac-title-strong">{loc.name}</strong>
                        <span className="fac-addr-muted">
                          <MapPinIcon size={12} /> {loc.address}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="capacity-pill">
                        <LayersIcon size={11} /> {loc.totalSlots} {t('common.bays')}
                      </span>
                    </td>
                    <td>
                      <StatusBadge
                        status={isAvail ? 'available' : 'occupied'}
                        label={`${loc.availableSlots} ${t('common.free')}`}
                        size="sm"
                      />
                    </td>
                    <td>
                      <strong>${loc.pricePerHour.toFixed(2)}/{t('common.hr')}</strong>
                    </td>
                    <td>{loc.operatingHours}</td>
                    <td>
                      <span className="hw-status-pill">
                        <CheckCircle2Icon size={12} /> {t('status.active')}
                      </span>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button
                          type="button"
                          className="table-btn-edit"
                          onClick={() => alert(`Edit facility settings for ${loc.name} (Demo Mode)`)}
                        >
                          {t('common.edit')}
                        </button>
                        <button
                          type="button"
                          className="table-btn-del"
                          onClick={() => handleDelete(loc.id, loc.name)}
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminParking;

