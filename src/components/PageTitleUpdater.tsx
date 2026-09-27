import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n';

export const PageTitleUpdater = () => {
  const location = useLocation();
  const { t, language } = useTranslation();

  useEffect(() => {
    const pathname = location.pathname;
    let pageLabel = '';

    if (pathname === '/') {
      document.title = 'SmartPark';
      return;
    } else if (pathname.startsWith('/parking/')) {
      pageLabel = t('nav.findParking');
    } else if (pathname === '/parking') {
      pageLabel = t('nav.findParking');
    } else if (pathname.startsWith('/booking/')) {
      pageLabel = t('confirmation.permitTitle');
    } else if (pathname === '/bookings') {
      pageLabel = t('nav.reservations');
    } else if (pathname === '/dashboard') {
      pageLabel = t('nav.dashboard');
    } else if (pathname === '/profile') {
      pageLabel = t('nav.profile');
    } else if (pathname === '/login') {
      pageLabel = t('nav.signIn');
    } else if (pathname === '/register') {
      pageLabel = t('nav.getStarted');
    } else if (pathname.startsWith('/admin')) {
      pageLabel = t('nav.adminPortal');
    }

    if (pageLabel) {
      document.title = `SmartPark | ${pageLabel}`;
    } else {
      document.title = 'SmartPark';
    }
  }, [location.pathname, language, t]);

  return null;
};

export default PageTitleUpdater;
