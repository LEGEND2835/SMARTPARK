import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockParkingLocations, type ParkingLocation } from '../data/mockData';
import ParkingCard from '../components/ParkingCard';
import './Parking.css';

export const Parking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [featureFilter, setFeatureFilter] = useState<string>(initialFilter);
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'availability' | 'rating'>('distance');

  const filteredParking = mockParkingLocations
    .filter((parking: ParkingLocation) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesText =
        !query ||
        parking.name.toLowerCase().includes(query) ||
        parking.address.toLowerCase().includes(query) ||
        parking.city.toLowerCase().includes(query);

      if (!matchesText) return false;

      if (featureFilter === 'ev') return parking.features.some((f) => f.toLowerCase().includes('ev'));
      if (featureFilter === 'covered') return parking.features.some((f) => f.toLowerCase().includes('covered'));
      if (featureFilter === '24_7') return parking.operatingHours.includes('24/7');
      if (featureFilter === 'available') return parking.availableSlots > 0;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.pricePerHour - b.pricePerHour;
      if (sortBy === 'availability') return b.availableSlots - a.availableSlots;
      if (sortBy === 'rating') return b.rating - a.rating;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

  return (
    <div className="parking-page smartpark-container">
      {/* Header */}
      <div className="parking-page-header">
        <h1 className="parking-page-title">Find Parking</h1>
        <p className="parking-page-desc">
          Browse municipal facilities, check real-time bay availability, and reserve guaranteed parking.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="parking-filter-toolbar">
        <div className="toolbar-search">
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="Search by facility name, street, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search parking lots"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="toolbar-controls">
          {/* Feature Filter Buttons */}
          <div className="filter-pills-row">
            <button
              type="button"
              className={`pill-btn ${featureFilter === 'all' ? 'active' : ''}`}
              onClick={() => setFeatureFilter('all')}
            >
              All Hubs ({mockParkingLocations.length})
            </button>
            <button
              type="button"
              className={`pill-btn ${featureFilter === 'available' ? 'active' : ''}`}
              onClick={() => setFeatureFilter('available')}
            >
              Available Only
            </button>
            <button
              type="button"
              className={`pill-btn ${featureFilter === 'ev' ? 'active' : ''}`}
              onClick={() => setFeatureFilter('ev')}
            >
              EV Charging
            </button>
            <button
              type="button"
              className={`pill-btn ${featureFilter === 'covered' ? 'active' : ''}`}
              onClick={() => setFeatureFilter('covered')}
            >
              Covered
            </button>
            <button
              type="button"
              className={`pill-btn ${featureFilter === '24_7' ? 'active' : ''}`}
              onClick={() => setFeatureFilter('24_7')}
            >
              24/7 Access
            </button>
          </div>

          {/* Sort Selector */}
          <div className="sort-dropdown-wrapper">
            <label htmlFor="sortBy" className="sort-label">
              Sort:
            </label>
            <select
              id="sortBy"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'distance' | 'price' | 'availability' | 'rating')}
            >
              <option value="distance">Nearest Distance</option>
              <option value="price">Lowest Rate ($/hr)</option>
              <option value="availability">Most Available Bays</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Status */}
      <div className="results-summary-row">
        <span>
          Showing <strong>{filteredParking.length}</strong> facilities
        </span>
      </div>

      {/* Grid of Parking Locations */}
      {filteredParking.length > 0 ? (
        <div className="parking-results-grid">
          {filteredParking.map((parking) => (
            <ParkingCard key={parking.id} parking={parking} />
          ))}
        </div>
      ) : (
        <div className="no-results-box">
          <h3>No Facilities Found</h3>
          <p>No parking facilities match your search criteria. Try modifying your filters or query.</p>
          <button
            type="button"
            className="btn-reset-filters"
            onClick={() => {
              setSearchQuery('');
              setFeatureFilter('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Parking;
