import React, { useState } from 'react';
import { mockParkingLocations, type ParkingLocation } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import Card from '../../components/Card';
import './AdminPages.css';

export const AdminParking: React.FC = () => {
  const [locations, setLocations] = useState<ParkingLocation[]>(mockParkingLocations);
  const [notice, setNotice] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFacilityName, setNewFacilityName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newTotalSlots, setNewTotalSlots] = useState(100);
  const [newPrice, setNewPrice] = useState(4.0);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the active city network (UI Demonstration)?`)) {
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
      setNotice(`Facility "${name}" removed from local list.`);
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
    setNotice(`New facility "${newLoc.name}" added to the network (Mock Mode)!`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-badge-sub">FACILITIES DIRECTORY</span>
          <h1 className="admin-page-title">Facility Management</h1>
          <p className="admin-page-sub">
            Add connected garages, configure bay allocations, update hourly tariffs, and inspect IoT telemetry.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
        >
          Add New Facility
        </Button>
      </div>

      {notice && (
        <div className="admin-alert-banner" role="status">
          <span>✓</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Add Facility Modal / Card */}
      {showAddModal && (
        <Card className="admin-form-modal-card" padding="lg">
          <div className="modal-header-row">
            <div>
              <h3 className="modal-title">Register Connected Facility</h3>
              <p className="modal-sub">Add a connected city garage to the SmartPark network.</p>
            </div>
            <button type="button" className="close-btn" onClick={() => setShowAddModal(false)}>
              ✕
            </button>
          </div>

          <form onSubmit={handleAddFacility} className="admin-modal-form">
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="f-name" className="form-label">Facility Name</label>
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
                <label htmlFor="f-addr" className="form-label">Street Address</label>
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
                <label htmlFor="f-slots" className="form-label">Total Slot Capacity</label>
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
                <label htmlFor="f-price" className="form-label">Hourly Rate ($)</label>
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
              <Button type="submit" variant="primary" size="md">
                Publish Facility
              </Button>
              <Button type="button" variant="secondary" size="md" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Facilities Table */}
      <Card className="admin-card" padding="none">
        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Facility Name & Location</th>
                <th>Capacity</th>
                <th>Availability</th>
                <th>Rate ($/hr)</th>
                <th>Operating Hours</th>
                <th>Telemetry</th>
                <th>Actions</th>
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
                        <span className="fac-addr-muted">{loc.address}</span>
                      </div>
                    </td>
                    <td>
                      <span className="capacity-pill">{loc.totalSlots} Bays</span>
                    </td>
                    <td>
                      <StatusBadge
                        status={isAvail ? 'available' : 'occupied'}
                        label={`${loc.availableSlots} Free`}
                        size="sm"
                      />
                    </td>
                    <td>
                      <strong>${loc.pricePerHour.toFixed(2)}/hr</strong>
                    </td>
                    <td>{loc.operatingHours}</td>
                    <td>
                      <span className="hw-status-pill">Active Gateway</span>
                    </td>
                    <td>
                      <div className="action-btn-group">
                        <button
                          type="button"
                          className="table-btn-edit"
                          onClick={() => alert(`Edit facility settings for ${loc.name} (Demo Mode)`)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="table-btn-del"
                          onClick={() => handleDelete(loc.id, loc.name)}
                        >
                          Delete
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
