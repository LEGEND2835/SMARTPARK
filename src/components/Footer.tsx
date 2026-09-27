import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import { ParkingIcon, ShieldCheckIcon } from './Icons';
import './Footer.css';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="smartpark-footer">
      <div className="smartpark-container footer-inner">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <div className="footer-brand-badge">
                <ParkingIcon size={16} />
              </div>
              <span className="footer-brand-text">
                Smart<span className="brand-accent">Park</span>
              </span>
            </div>
            <p className="footer-tagline">
              {t('footer.tagline')}
            </p>
            <div className="footer-system-status">
              <span className="status-dot-pulse"></span>
              <span>{t('footer.allConnected')}</span>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-nav-col">
              <h4 className="footer-heading">{t('footer.platformHeading')}</h4>
              <ul className="footer-links-list">
                <li><Link to="/">{t('footer.exploreLink')}</Link></li>
                <li><Link to="/parking">{t('footer.findParkingLink')}</Link></li>
                <li><Link to="/bookings">{t('footer.reservationsLink')}</Link></li>
                <li><Link to="/dashboard">{t('footer.dashboardLink')}</Link></li>
                <li><Link to="/profile">{t('footer.profileLink')}</Link></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4 className="footer-heading">{t('footer.operationsHeading')}</h4>
              <ul className="footer-links-list">
                <li><Link to="/admin">{t('footer.adminOverviewLink')}</Link></li>
                <li><Link to="/admin/parking">{t('footer.facilityInventoryLink')}</Link></li>
                <li><Link to="/admin/reservations">{t('footer.liveReservationsLink')}</Link></li>
                <li><Link to="/login">{t('footer.operatorSignInLink')}</Link></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4 className="footer-heading">{t('footer.infraHeading')}</h4>
              <ul className="footer-features-list">
                <li>{t('footer.featEvCharging')}</li>
                <li>{t('footer.featDigitalPermits')}</li>
                <li>{t('footer.featMonitoredAccess')}</li>
                <li>{t('footer.featOccupancySync')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p className="footer-copy">
            © {new Date().getFullYear()} SmartPark. {t('footer.copyrightText')}
          </p>
          <div className="footer-meta-tags">
            <span className="secure-badge">
              <ShieldCheckIcon size={14} />
              <span>{t('footer.securityBadge')}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

