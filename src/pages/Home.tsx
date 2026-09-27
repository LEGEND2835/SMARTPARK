import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockParkingLocations } from '../data/mockData';
import ParkingCard from '../components/ParkingCard';
import Button from '../components/Button';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ev' | 'covered' | '24_7'>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/parking?search=${encodeURIComponent(searchQuery)}&filter=${selectedFilter}`);
  };

  const filteredLocations = mockParkingLocations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'ev') return loc.features.some((f) => f.toLowerCase().includes('ev'));
    if (selectedFilter === 'covered') return loc.features.some((f) => f.toLowerCase().includes('covered'));
    if (selectedFilter === '24_7') return loc.operatingHours.includes('24/7');
    return true;
  });

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="smartpark-container hero-container">
          <div className="hero-header-badge">
            <span className="hero-badge-dot"></span>
            <span>Connected Urban Parking Network</span>
          </div>

          <h1 className="hero-title">
            Find your spot before you arrive.
          </h1>

          <p className="hero-subtitle">
            Reserve guaranteed parking, track live availability, and access designated bays with touchless check-in across municipal garages.
          </p>

          <div className="hero-cta-row">
            <Button to="/parking" variant="primary" size="lg">
              Find Parking
            </Button>
            <Button to="/bookings" variant="secondary" size="lg">
              View Reservations
            </Button>
          </div>

          {/* Clean Metric Strip */}
          <div className="hero-metrics-strip">
            <div className="metric-strip-item">
              <span className="strip-value">5</span>
              <span className="strip-label">Connected Facilities</span>
            </div>
            <div className="metric-strip-divider"></div>
            <div className="metric-strip-item">
              <span className="strip-value">615+</span>
              <span className="strip-label">Monitored Bays</span>
            </div>
            <div className="metric-strip-divider"></div>
            <div className="metric-strip-item">
              <span className="strip-value">100%</span>
              <span className="strip-label">Live Sensor Sync</span>
            </div>
            <div className="metric-strip-divider"></div>
            <div className="metric-strip-item">
              <span className="strip-value">&lt; 30s</span>
              <span className="strip-label">Instant Pass Issuance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Discovery Bar */}
      <section className="search-section">
        <div className="smartpark-container">
          <div className="search-panel">
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <div className="search-input-field">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by neighborhood, street, or landmark (e.g. Downtown Core, Tech Boulevard)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search parking location"
                />
              </div>

              <div className="search-filter-pills">
                <button
                  type="button"
                  className={`filter-pill ${selectedFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedFilter('all')}
                >
                  All Garages
                </button>
                <button
                  type="button"
                  className={`filter-pill ${selectedFilter === 'ev' ? 'active' : ''}`}
                  onClick={() => setSelectedFilter('ev')}
                >
                  EV Charging
                </button>
                <button
                  type="button"
                  className={`filter-pill ${selectedFilter === 'covered' ? 'active' : ''}`}
                  onClick={() => setSelectedFilter('covered')}
                >
                  Covered Multi-Level
                </button>
                <button
                  type="button"
                  className={`filter-pill ${selectedFilter === '24_7' ? 'active' : ''}`}
                  onClick={() => setSelectedFilter('24_7')}
                >
                  24/7 Access
                </button>
              </div>

              <Button type="submit" variant="primary" size="md">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Facilities Section */}
      <section className="featured-section">
        <div className="smartpark-container">
          <div className="section-title-row">
            <div>
              <h2 className="section-heading">Featured Facilities</h2>
              <p className="section-subheading">
                Real-time slot telemetry and immediate bay reservations at top transit locations.
              </p>
            </div>
            <Button to="/parking" variant="outline" size="sm">
              View All Garages →
            </Button>
          </div>

          <div className="parking-cards-grid">
            {filteredLocations.slice(0, 3).map((parking) => (
              <ParkingCard key={parking.id} parking={parking} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="workflow-section">
        <div className="smartpark-container">
          <div className="workflow-header">
            <h2 className="section-heading">How SmartPark Works</h2>
            <p className="section-subheading">A streamlined, three-step reservation and transit process.</p>
          </div>

          <div className="workflow-grid">
            <div className="workflow-step-card">
              <span className="step-idx">01</span>
              <h3 className="step-name">Locate Facility</h3>
              <p className="step-text">
                Browse real-time facility availability, hourly pricing, and walking distance to your destination.
              </p>
            </div>

            <div className="workflow-step-card">
              <span className="step-idx">02</span>
              <h3 className="step-name">Select Exact Bay</h3>
              <p className="step-text">
                View the interactive floor layout and pick an open slot—including standard, EV fast-charge, or accessible bays.
              </p>
            </div>

            <div className="workflow-step-card">
              <span className="step-idx">03</span>
              <h3 className="step-name">Touchless Arrival</h3>
              <p className="step-text">
                Receive an immediate digital boarding pass with touchless QR or automated license plate entry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Call To Action */}
      <section className="cta-section">
        <div className="smartpark-container">
          <div className="cta-card">
            <div className="cta-content">
              <h2 className="cta-heading">Ready to reserve parking without the search?</h2>
              <p className="cta-text">
                Create a SmartPark account to manage vehicles, download parking receipts, and get instant access.
              </p>
            </div>
            <div className="cta-actions">
              <Button to="/register" variant="primary" size="md">
                Create Account
              </Button>
              <Button to="/parking" variant="secondary" size="md">
                Explore Garages
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
