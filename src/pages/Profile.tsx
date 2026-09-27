import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../firebase/userService';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../i18n';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  CarIcon,
  BoltIcon,
  LogOutIcon,
  CheckCircle2Icon,
  SunIcon,
  MoonIcon
} from '../components/Icons';
import './Profile.css';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const userDisplayName =
    userProfile?.fullName || user?.displayName || user?.email?.split('@')[0] || t('profile.standardDriver');
  const userDisplayEmail = userProfile?.email || user?.email || '';

  const [customName, setCustomName] = useState<string | null>(null);
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [vehicleNumber, setVehicleNumber] = useState('KA-05-MN-2024');
  const [isEditing, setIsEditing] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [autoExtend, setAutoExtend] = useState(false);

  const activeFullName = customName !== null ? customName : userDisplayName;
  const activeEmail = userDisplayEmail;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    if (user?.uid && customName) {
      try {
        await updateUserProfile(user.uid, { fullName: customName });
      } catch (err) {
        console.warn('Could not update Firestore profile:', err);
      }
    }
    setSaveNotice(t('profile.savedNotice'));
    setTimeout(() => setSaveNotice(null), 3000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'SP';
  };

  return (
    <div className="profile-page smartpark-container">
      {/* Profile Header */}
      <div className="profile-header-panel">
        <div className="profile-identity">
          <div className="profile-avatar-symbol" aria-hidden="true">
            {getInitials(activeFullName || 'SP')}
          </div>
          <div className="profile-titles">
            <div className="profile-name-tier">
              <h1 className="profile-title">{activeFullName}</h1>
              <span className={`profile-role-tag ${userProfile?.role === 'admin' ? 'role-admin' : ''}`}>
                {userProfile?.role === 'admin' ? t('profile.systemAdmin') : t('profile.standardDriver')}
              </span>
            </div>
            <p className="profile-email-text">{activeEmail}</p>
            <div className="profile-meta-tags">
              <span>UID: <code>{user?.uid ? `${user.uid.slice(0, 10)}...` : 'Connected'}</code></span>
              <span className="profile-dot" aria-hidden="true">•</span>
              <span>{t('profile.accountStatus')}: <strong className="text-status-active">{t('profile.statusActive')}</strong></span>
              <span className="profile-dot" aria-hidden="true">•</span>
              <span>{t('profile.zone')}: <strong>Downtown Metro</strong></span>
            </div>
          </div>
        </div>

        <div className="profile-actions-bar">
          <Button
            type="button"
            variant={isEditing ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => {
              if (!isEditing && customName === null) {
                setCustomName(activeFullName);
              }
              setIsEditing(!isEditing);
            }}
          >
            {isEditing ? t('profile.cancelEdit') : t('profile.editProfile')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={<LogOutIcon size={14} />}
            onClick={handleLogout}
          >
            {t('profile.logOut')}
          </Button>
        </div>
      </div>

      {saveNotice && (
        <div className="profile-notification" role="status">
          <CheckCircle2Icon size={18} />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="profile-settings-layout">
        {/* Left Column: Personal Information & Vehicles */}
        <div className="profile-main-col">
          <Card padding="lg" className="profile-card" elevation="sm">
            <div className="profile-section-heading">
              <div>
                <h2 className="section-title">{t('profile.personalInfoHeading')}</h2>
                <p className="section-desc">{t('profile.personalInfoDesc')}</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="profile-form-grid">
                <div className="form-group">
                  <label htmlFor="p-name" className="form-label">{t('profile.fullNameLabel')}</label>
                  <input
                    id="p-name"
                    type="text"
                    className="form-input"
                    value={activeFullName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="p-email" className="form-label">{t('profile.emailLabel')} (Read-only)</label>
                  <input
                    id="p-email"
                    type="email"
                    className="form-input form-input-disabled"
                    value={activeEmail}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="p-phone" className="form-label">{t('profile.phoneLabel')}</label>
                  <input
                    id="p-phone"
                    type="tel"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="p-plate" className="form-label">{t('profile.primaryPlateLabel')}</label>
                  <input
                    id="p-plate"
                    type="text"
                    className="form-input"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                  />
                </div>

                <div className="form-actions-inline">
                  <Button type="submit" variant="primary" size="md">
                    {t('profile.saveChanges')}
                  </Button>
                  <Button type="button" variant="secondary" size="md" onClick={() => setIsEditing(false)}>
                    {t('profile.cancelEdit')}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="profile-data-list">
                <div className="profile-data-row">
                  <span className="data-key">{t('profile.fullNameLabel')}</span>
                  <span className="data-val">{activeFullName}</span>
                </div>
                <div className="profile-data-row">
                  <span className="data-key">{t('profile.emailLabel')}</span>
                  <span className="data-val">{activeEmail}</span>
                </div>
                <div className="profile-data-row">
                  <span className="data-key">{t('profile.phoneLabel')}</span>
                  <span className="data-val">{phone}</span>
                </div>
                <div className="profile-data-row">
                  <span className="data-key">{t('profile.primaryPlateLabel')}</span>
                  <span className="data-val">
                    <span className="plate-badge-clean">{vehicleNumber}</span>
                  </span>
                </div>
                <div className="profile-data-row">
                  <span className="data-key">{t('profile.gateRecognitionLabel')}</span>
                  <span className="data-val pass-enabled">
                    <span className="status-dot-active" aria-hidden="true"></span>
                    {t('profile.alprActive')}
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Registered Vehicles */}
          <Card padding="lg" className="profile-card" elevation="sm">
            <div className="profile-section-heading flex-between">
              <div>
                <h2 className="section-title">{t('profile.vehiclesHeading')}</h2>
                <p className="section-desc">{t('profile.vehiclesDesc')}</p>
              </div>
              <Button type="button" variant="outline" size="sm" icon={<CarIcon size={14} />} onClick={() => alert('Vehicle registration dialog (Demo Mode)')}>
                {t('profile.addVehicleBtn')}
              </Button>
            </div>

            <div className="vehicle-fleet-list">
              <div className="vehicle-fleet-card primary-vehicle-card">
                <div className="vehicle-details">
                  <div className="vehicle-topline">
                    <span className="vehicle-model">Tesla Model 3 (Sedan)</span>
                    <span className="primary-pill">{t('profile.primaryPill')}</span>
                  </div>
                  <span className="vehicle-subplate">{vehicleNumber}</span>
                </div>
                <div className="vehicle-fleet-meta">
                  <span className="ev-support-tag">
                    <BoltIcon size={12} /> {t('profile.evCapableTag')}
                  </span>
                </div>
              </div>

              <div className="vehicle-fleet-card">
                <div className="vehicle-details">
                  <div className="vehicle-topline">
                    <span className="vehicle-model">Honda CR-V (SUV)</span>
                  </div>
                  <span className="vehicle-subplate">DL-01-AB-9876</span>
                </div>
                <div className="vehicle-fleet-meta">
                  <span className="vehicle-type-tag">
                    <CarIcon size={12} /> {t('profile.standardIceTag')}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Preferences, Theme & Security */}
        <div className="profile-side-col">
          {/* Interface & Theme Preferences */}
          <Card padding="lg" className="profile-card" elevation="sm">
            <div className="profile-section-heading">
              <div>
                <h2 className="section-title">{t('profile.appearanceHeading')}</h2>
                <p className="section-desc">{t('profile.appearanceDesc')}</p>
              </div>
            </div>

            <div className="theme-selection-block">
              <div className="theme-toggle-row">
                <div className="theme-toggle-info">
                  <span className="pref-name">{t('profile.visualTheme')}</span>
                  <span className="pref-help">{t('profile.activeTheme')}: <strong>{theme === 'dark' ? t('profile.darkThemeName') : t('profile.lightThemeName')}</strong></span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  icon={theme === 'dark' ? <SunIcon size={14} /> : <MoonIcon size={14} />}
                >
                  {theme === 'dark' ? t('profile.lightThemeName') : t('profile.darkThemeName')}
                </Button>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="profile-card" elevation="sm">
            <div className="profile-section-heading">
              <div>
                <h2 className="section-title">{t('profile.preferencesHeading')}</h2>
                <p className="section-desc">{t('profile.preferencesDesc')}</p>
              </div>
            </div>

            <div className="profile-switches-list">
              <label className="pref-item-row">
                <div className="pref-text">
                  <span className="pref-name">{t('profile.expiryNotification')}</span>
                  <span className="pref-help">{t('profile.expiryNotificationHelp')}</span>
                </div>
                <input
                  type="checkbox"
                  className="clean-toggle"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                />
              </label>

              <label className="pref-item-row">
                <div className="pref-text">
                  <span className="pref-name">{t('profile.vatInvoices')}</span>
                  <span className="pref-help">{t('profile.vatInvoicesHelp')}</span>
                </div>
                <input
                  type="checkbox"
                  className="clean-toggle"
                  checked={emailReceipts}
                  onChange={(e) => setEmailReceipts(e.target.checked)}
                />
              </label>

              <label className="pref-item-row">
                <div className="pref-text">
                  <span className="pref-name">{t('profile.overstayProtection')}</span>
                  <span className="pref-help">{t('profile.overstayProtectionHelp')}</span>
                </div>
                <input
                  type="checkbox"
                  className="clean-toggle"
                  checked={autoExtend}
                  onChange={(e) => setAutoExtend(e.target.checked)}
                />
              </label>
            </div>
          </Card>

          <Card padding="lg" className="profile-card" elevation="sm">
            <div className="profile-section-heading">
              <div>
                <h2 className="section-title">{t('profile.paymentMethodsHeading')}</h2>
                <p className="section-desc">{t('profile.paymentMethodsDesc')}</p>
              </div>
            </div>

            <div className="card-on-file">
              <div className="card-visual-chip">
                <div className="chip-brand">VISA</div>
                <div className="chip-dots">•••• 4242</div>
              </div>
              <div className="card-file-details">
                <div className="card-file-name">Visa Corporate</div>
                <div className="card-file-exp">{t('profile.expiresPrefix')} 12/28 • {t('profile.primaryMethod')}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

