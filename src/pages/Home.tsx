import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockParkingLocations } from '../data/mockData';
import { useTranslation } from '../i18n';
import ParkingCard from '../components/ParkingCard';
import Button from '../components/Button';
import {
  SearchIcon,
  MapPinIcon,
  BoltIcon,
  BuildingIcon,
  ClockIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  TicketIcon,
  CarIcon,
} from '../components/Icons';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ev' | 'covered' | '24_7'>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedFilter !== 'all') params.set('filter', selectedFilter);
    navigate(`/parking?${params.toString()}`);
  };

  const featuredLocations = mockParkingLocations.slice(0, 3);

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="smartpark-container hero-container">
          <div className="hero-header-badge">
            <span className="hero-badge-pulse" aria-hidden="true" />
            <span>{t('home.badge')}</span>
          </div>

          <h1 id="hero-title" className="hero-title">
            {t('home.heroTitleLine1')} <br className="hero-br" />
            <span className="hero-accent-text">{t('home.heroTitleAccent')}</span>
          </h1>

          <p className="hero-subtitle">
            {t('home.heroSubtitle')}
          </p>

          <div className="hero-cta-row">
            <Button
              to="/parking"
              variant="primary"
              size="lg"
              icon={<SearchIcon size={18} />}
            >
              {t('home.findParkingCta')}
            </Button>
            <Button
              to="/bookings"
              variant="secondary"
              size="lg"
              icon={<TicketIcon size={18} />}
            >
              {t('home.viewReservationsCta')}
            </Button>
          </div>

          {/* Key Metrics Strip */}
          <div className="hero-metrics-strip" role="region" aria-label="Key Product Statistics">
            <div className="metric-strip-item">
              <span className="strip-value">5</span>
              <span className="strip-label">{t('home.metricGarages')}</span>
            </div>
            <div className="metric-strip-divider" aria-hidden="true" />
            <div className="metric-strip-item">
              <span className="strip-value">615+</span>
              <span className="strip-label">{t('home.metricBays')}</span>
            </div>
            <div className="metric-strip-divider" aria-hidden="true" />
            <div className="metric-strip-item">
              <span className="strip-value">100%</span>
              <span className="strip-label">{t('home.metricSpot')}</span>
            </div>
            <div className="metric-strip-divider" aria-hidden="true" />
            <div className="metric-strip-item">
              <span className="strip-value">&lt; 30s</span>
              <span className="strip-label">{t('home.metricIssuance')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search & Discovery Section */}
      <section className="search-section" aria-label="Parking Search">
        <div className="smartpark-container">
          <div className="search-panel">
            <form className="search-form" onSubmit={handleSearchSubmit} role="search">
              <div className="search-input-field">
                <SearchIcon size={18} className="search-field-icon" aria-hidden="true" />
                <input
                  type="text"
                  className="search-input"
                  placeholder={t('home.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={t('home.searchPlaceholder')}
                />
              </div>

              <div className="search-filter-pills" role="group" aria-label="Parking filters">
                <button
                  type="button"
                  className={`filter-pill ${selectedFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedFilter('all')}
                  aria-pressed={selectedFilter === 'all'}
                >
                  {t('home.allFacilities')}
                </button>
                <button
                  type="button"
                  className={`filter-pill ${selectedFilter === 'ev' ? 'active' : ''}`}
                  onClick={() => setSelectedFilter('ev')}
                  aria-pressed={selectedFilter === 'ev'}
                >
                  <BoltIcon size={14} className="filter-icon" aria-hidden="true" />
                  <span>{t('home.evCharging')}</span>
                </button>
                <button
                  type="button"
                  className={`filter-pill ${selectedFilter === 'covered' ? 'active' : ''}`}
                  onClick={() => setSelectedFilter('covered')}
                  aria-pressed={selectedFilter === 'covered'}
                >
                  <BuildingIcon size={14} className="filter-icon" aria-hidden="true" />
                  <span>{t('home.covered')}</span>
                </button>
                <button
                  type="button"
                  className={`filter-pill ${selectedFilter === '24_7' ? 'active' : ''}`}
                  onClick={() => setSelectedFilter('24_7')}
                  aria-pressed={selectedFilter === '24_7'}
                >
                  <ClockIcon size={14} className="filter-icon" aria-hidden="true" />
                  <span>{t('home.open247')}</span>
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={<ArrowRightIcon size={16} />}
                iconPosition="right"
              >
                {t('home.searchBtn')}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. Featured Facilities Section */}
      <section className="featured-section" aria-labelledby="featured-heading">
        <div className="smartpark-container">
          <div className="section-title-row">
            <div>
              <h2 id="featured-heading" className="section-heading">{t('home.featuredHeading')}</h2>
              <p className="section-subheading">
                {t('home.featuredSubheading')}
              </p>
            </div>
            <Button
              to="/parking"
              variant="outline"
              size="sm"
              icon={<ArrowRightIcon size={15} />}
              iconPosition="right"
            >
              {t('home.viewAllGarages')}
            </Button>
          </div>

          <div className="parking-cards-grid">
            {featuredLocations.map((parking) => (
              <ParkingCard key={parking.id} parking={parking} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. How SmartPark Works Section */}
      <section className="workflow-section" aria-labelledby="workflow-heading">
        <div className="smartpark-container">
          <div className="workflow-header">
            <div className="workflow-badge">{t('home.workflowBadge')}</div>
            <h2 id="workflow-heading" className="section-heading">{t('home.workflowHeading')}</h2>
            <p className="section-subheading">{t('home.workflowSubheading')}</p>
          </div>

          <div className="workflow-grid">
            <div className="workflow-step-card">
              <div className="step-card-top">
                <span className="step-idx">01</span>
                <div className="step-icon-wrap" aria-hidden="true">
                  <MapPinIcon size={20} />
                </div>
              </div>
              <h3 className="step-name">{t('home.step1Title')}</h3>
              <p className="step-text">
                {t('home.step1Desc')}
              </p>
            </div>

            <div className="workflow-step-card">
              <div className="step-card-top">
                <span className="step-idx">02</span>
                <div className="step-icon-wrap" aria-hidden="true">
                  <CarIcon size={20} />
                </div>
              </div>
              <h3 className="step-name">{t('home.step2Title')}</h3>
              <p className="step-text">
                {t('home.step2Desc')}
              </p>
            </div>

            <div className="workflow-step-card">
              <div className="step-card-top">
                <span className="step-idx">03</span>
                <div className="step-icon-wrap" aria-hidden="true">
                  <TicketIcon size={20} />
                </div>
              </div>
              <h3 className="step-name">{t('home.step3Title')}</h3>
              <p className="step-text">
                {t('home.step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust & Infrastructure Section */}
      <section className="infrastructure-section" aria-labelledby="infra-heading">
        <div className="smartpark-container">
          <div className="section-title-row section-title-center">
            <div>
              <h2 id="infra-heading" className="section-heading">{t('home.infraHeading')}</h2>
              <p className="section-subheading">
                {t('home.infraSubheading')}
              </p>
            </div>
          </div>

          <div className="infra-grid">
            <div className="infra-card">
              <div className="infra-icon-badge" aria-hidden="true">
                <BoltIcon size={22} />
              </div>
              <h3 className="infra-title">{t('home.infraEvTitle')}</h3>
              <p className="infra-desc">
                {t('home.infraEvDesc')}
              </p>
            </div>

            <div className="infra-card">
              <div className="infra-icon-badge" aria-hidden="true">
                <ShieldCheckIcon size={22} />
              </div>
              <h3 className="infra-title">{t('home.infraGuaranteedTitle')}</h3>
              <p className="infra-desc">
                {t('home.infraGuaranteedDesc')}
              </p>
            </div>

            <div className="infra-card">
              <div className="infra-icon-badge" aria-hidden="true">
                <ClockIcon size={22} />
              </div>
              <h3 className="infra-title">{t('home.infraExtensionTitle')}</h3>
              <p className="infra-desc">
                {t('home.infraExtensionDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Final Call To Action */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="smartpark-container">
          <div className="cta-card">
            <div className="cta-content">
              <h2 id="cta-heading" className="cta-heading">{t('home.ctaHeading')}</h2>
              <p className="cta-text">
                {t('home.ctaDesc')}
              </p>
            </div>
            <div className="cta-actions">
              <Button
                to="/register"
                variant="primary"
                size="lg"
                icon={<ArrowRightIcon size={16} />}
                iconPosition="right"
              >
                {t('home.createAccountBtn')}
              </Button>
              <Button to="/parking" variant="secondary" size="lg">
                {t('home.browseGaragesBtn')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

