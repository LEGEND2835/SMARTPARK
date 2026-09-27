import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockParkingLocations, type ParkingLocation } from '../data/mockData';
import { useTranslation } from '../i18n';
import ParkingCard from '../components/ParkingCard';
import EmptyState from '../components/EmptyState';
import {
  SearchIcon,
  XIcon,
  BoltIcon,
  BuildingIcon,
  ClockIcon,
  SlidersIcon,
  CheckCircle2Icon,
  LayersIcon,
} from '../components/Icons';
import './Parking.css';

export const Parking: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const searchQuery = searchParams.get('search') || '';
  const featureFilter = searchParams.get('filter') || 'all';
  const sortBy = (searchParams.get('sort') as 'distance' | 'price' | 'availability' | 'rating') || 'distance';

  const updateParams = (newSearch: string, newFilter: string, newSort: string) => {
    const params = new URLSearchParams();
    if (newSearch.trim()) params.set('search', newSearch.trim());
    if (newFilter !== 'all') params.set('filter', newFilter);
    if (newSort !== 'distance') params.set('sort', newSort);
    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (val: string) => {
    updateParams(val, featureFilter, sortBy);
  };

  const handleFilterChange = (filter: string) => {
    updateParams(searchQuery, filter, sortBy);
  };

  const handleSortChange = (sort: 'distance' | 'price' | 'availability' | 'rating') => {
    updateParams(searchQuery, featureFilter, sort);
  };

  const handleResetFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const filteredParking = useMemo(() => {
    return mockParkingLocations
      .filter((parking: ParkingLocation) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesText =
          !query ||
          parking.name.toLowerCase().includes(query) ||
          parking.address.toLowerCase().includes(query) ||
          parking.city.toLowerCase().includes(query);

        if (!matchesText) return false;

        if (featureFilter === 'ev') {
          return parking.features.some(
            (f) => f.toLowerCase().includes('ev') || f.toLowerCase().includes('charging')
          );
        }
        if (featureFilter === 'covered') {
          return parking.features.some((f) => f.toLowerCase().includes('covered'));
        }
        if (featureFilter === '24_7') {
          return parking.operatingHours.includes('24/7') || parking.features.some((f) => f.includes('24/7'));
        }
        if (featureFilter === 'available') {
          return parking.availableSlots > 0;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return a.pricePerHour - b.pricePerHour;
        if (sortBy === 'availability') return b.availableSlots - a.availableSlots;
        if (sortBy === 'rating') return b.rating - a.rating;
        return parseFloat(a.distance) - parseFloat(b.distance);
      });
  }, [searchQuery, featureFilter, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== '' || featureFilter !== 'all' || sortBy !== 'distance';

  return (
    <div className="parking-page smartpark-container">
      {/* 1. Page Header */}
      <header className="parking-page-header">
        <div className="parking-header-tag">
          <LayersIcon size={14} aria-hidden="true" />
          <span>{t('parking.headerTag')}</span>
        </div>
        <h1 className="parking-page-title">{t('parking.pageTitle')}</h1>
        <p className="parking-page-desc">
          {t('parking.pageDesc')}
        </p>
      </header>

      {/* 2. Search + Filter Toolbar */}
      <section className="parking-filter-toolbar" aria-label="Search and filter parking facilities">
        {/* Search Input */}
        <div className="toolbar-search">
          <SearchIcon size={18} className="toolbar-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="toolbar-search-input"
            placeholder={t('parking.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label={t('parking.searchPlaceholder')}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => handleSearchChange('')}
              aria-label={t('parking.clearSearch')}
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Filters & Sort Row */}
        <div className="toolbar-controls">
          {/* Feature Filter Pills */}
          <div className="filter-pills-row" role="group" aria-label="Feature filters">
            <button
              type="button"
              className={`pill-btn ${featureFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
              aria-pressed={featureFilter === 'all'}
            >
              {t('parking.allHubs')} ({mockParkingLocations.length})
            </button>
            <button
              type="button"
              className={`pill-btn ${featureFilter === 'available' ? 'active' : ''}`}
              onClick={() => handleFilterChange('available')}
              aria-pressed={featureFilter === 'available'}
            >
              <CheckCircle2Icon size={14} className="pill-icon" aria-hidden="true" />
              <span>{t('parking.availableOnly')}</span>
            </button>
            <button
              type="button"
              className={`pill-btn ${featureFilter === 'ev' ? 'active' : ''}`}
              onClick={() => handleFilterChange('ev')}
              aria-pressed={featureFilter === 'ev'}
            >
              <BoltIcon size={14} className="pill-icon" aria-hidden="true" />
              <span>{t('parking.evCharging')}</span>
            </button>
            <button
              type="button"
              className={`pill-btn ${featureFilter === 'covered' ? 'active' : ''}`}
              onClick={() => handleFilterChange('covered')}
              aria-pressed={featureFilter === 'covered'}
            >
              <BuildingIcon size={14} className="pill-icon" aria-hidden="true" />
              <span>{t('parking.covered')}</span>
            </button>
            <button
              type="button"
              className={`pill-btn ${featureFilter === '24_7' ? 'active' : ''}`}
              onClick={() => handleFilterChange('24_7')}
              aria-pressed={featureFilter === '24_7'}
            >
              <ClockIcon size={14} className="pill-icon" aria-hidden="true" />
              <span>{t('parking.open247')}</span>
            </button>
          </div>

          {/* Sort Selector */}
          <div className="sort-dropdown-wrapper">
            <SlidersIcon size={14} className="sort-icon" aria-hidden="true" />
            <label htmlFor="sortBy" className="sort-label">
              {t('parking.sortLabel')}:
            </label>
            <select
              id="sortBy"
              className="sort-select"
              value={sortBy}
              onChange={(e) =>
                handleSortChange(e.target.value as 'distance' | 'price' | 'availability' | 'rating')
              }
              aria-label={t('parking.sortLabel')}
            >
              <option value="distance">{t('parking.sortNearest')}</option>
              <option value="price">{t('parking.sortPriceLow')}</option>
              <option value="availability">{t('parking.sortAvailableBays')}</option>
              <option value="rating">{t('parking.sortHighestRated')}</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. Results Summary & Active Filter Indicator */}
      <div className="results-summary-row" role="status" aria-live="polite">
        <span className="results-count-text">
          {t('parking.showingResults')}: <strong>{filteredParking.length}</strong> {filteredParking.length === 1 ? t('parking.facilitySingle') : t('parking.facilityPlural')}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            className="clear-all-link"
            onClick={handleResetFilters}
            aria-label={t('parking.resetFilters')}
          >
            {t('parking.resetFilters')}
          </button>
        )}
      </div>

      {/* 4. Facility Results Grid or Empty State */}
      {filteredParking.length > 0 ? (
        <main className="parking-results-grid" aria-label="Parking Facilities List">
          {filteredParking.map((parking) => (
            <ParkingCard key={parking.id} parking={parking} />
          ))}
        </main>
      ) : (
        <EmptyState
          icon={<BuildingIcon size={32} />}
          title={t('parking.emptyTitle')}
          description={t('parking.emptyDesc')}
          action={{
            label: t('parking.clearAllFilters'),
            onClick: handleResetFilters,
            variant: 'primary',
          }}
        />
      )}
    </div>
  );
};

export default Parking;

