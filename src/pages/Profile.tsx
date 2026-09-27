import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import './Profile.css';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();

  const userDisplayName =
    userProfile?.fullName || user?.displayName || user?.email?.split('@')[0] || 'SmartPark Driver';
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveNotice('Profile changes saved successfully.');
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
          <div className="profile-avatar-symbol">
            {getInitials(activeFullName || 'SP')}
          </div>
          <div className="profile-titles">
            <div className="profile-name-tier">
              <h1 className="profile-title">{activeFullName}</h1>
              <span className={`profile-role-tag ${userProfile?.role === 'admin' ? 'role-admin' : ''}`}>
                {userProfile?.role === 'admin' ? 'System Administrator' : 'Standard Member'}
              </span>
            </div>
            <p className="profile-email-text">{activeEmail}</p>
            <div className="profile-meta-tags">
              <span>UID: <code>{user?.uid ? `${user.uid.slice(0, 10)}...` : 'Connected'}</code></span>
              <span className="profile-dot">•</span>
              <span>Account Status: <strong>Active</strong></span>
              <span className="profile-dot">•</span>
              <span>Zone: <strong>Downtown Metro</strong></span>
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
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </div>

      {saveNotice && (
        <div className="profile-notification" role="status">
          <span className="notification-icon">✓</span>
          <span>{saveNotice}</span>
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="profile-settings-layout">
        {/* Left Column: Personal Information & Vehicles */}
        <div className="profile-main-col">
          <Card padding="lg" className="profile-card">
            <div className="profile-section-heading">
              <div>
                <h2 className="section-title">Personal Information</h2>
                <p className="section-desc">Account identity and contact information linked to reservations.</p>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="profile-form-grid">
                <div className="form-group">
                  <label htmlFor="p-name" className="form-label">Full Name</label>
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
                  <label htmlFor="p-email" className="form-label">Email Address (Read-only)</label>
                  <input
                    id="p-email"
                    type="email"
                    className="form-input form-input-disabled"
                    value={activeEmail}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="p-phone" className="form-label">Phone Number</label>
                  <input
                    id="p-phone"
                    type="tel"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="p-plate" className="form-label">Primary Vehicle Plate</label>
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
                    Save Changes
                  </Button>
                  <Button type="button" variant="secondary" size="md" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="profile-data-list">
                <div className="profile-data-row">
                  <span className="data-key">Full Name</span>
                  <span className="data-val">{activeFullName}</span>
                </div>
                <div className="profile-data-row">
                  <span className="data-key">Email Address</span>
                  <span className="data-val">{activeEmail}</span>
                </div>
                <div className="profile-data-row">
                  <span className="data-key">Phone Number</span>
                  <span className="data-val">{phone}</span>
                </div>
                <div className="profile-data-row">
                  <span className="data-key">Primary License Plate</span>
                  <span className="data-val">
                    <span className="plate-badge-clean">{vehicleNumber}</span>
                  </span>
                </div>
                <div className="profile-data-row">
                  <span className="data-key">Gate Recognition</span>
                  <span className="data-val pass-enabled">
                    <span className="status-dot-active"></span>
                    ALPR Fast Entry Active
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Registered Vehicles */}
          <Card padding="lg" className="profile-card">
            <div className="profile-section-heading flex-between">
              <div>
                <h2 className="section-title">Registered Vehicles</h2>
                <p className="section-desc">Vehicles authorized for automatic barrier recognition and reservation lookup.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => alert('Vehicle registration dialog (Demo Mode)')}>
                Add Vehicle
              </Button>
            </div>

            <div className="vehicle-fleet-list">
              <div className="vehicle-fleet-card primary-vehicle-card">
                <div className="vehicle-details">
                  <div className="vehicle-topline">
                    <span className="vehicle-model">Tesla Model 3 (Sedan)</span>
                    <span className="primary-pill">Primary</span>
                  </div>
                  <span className="vehicle-subplate">{vehicleNumber}</span>
                </div>
                <div className="vehicle-fleet-meta">
                  <span className="ev-support-tag">EV Capable</span>
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
                  <span className="vehicle-type-tag">Combustion</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Preferences & Saved Methods */}
        <div className="profile-side-col">
          <Card padding="lg" className="profile-card">
            <div className="profile-section-heading">
              <div>
                <h2 className="section-title">Preferences</h2>
                <p className="section-desc">Automated alerts and stay extension rules.</p>
              </div>
            </div>

            <div className="profile-switches-list">
              <label className="pref-item-row">
                <div className="pref-text">
                  <span className="pref-name">Expiry Notification</span>
                  <span className="pref-help">SMS alert 15 minutes before booking expires.</span>
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
                  <span className="pref-name">Digital VAT Invoices</span>
                  <span className="pref-help">Automated PDF email receipt after session completion.</span>
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
                  <span className="pref-name">Auto Overstay Protection</span>
                  <span className="pref-help">Gracefully extend 1 hour if departure is delayed.</span>
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

          <Card padding="lg" className="profile-card">
            <div className="profile-section-heading">
              <div>
                <h2 className="section-title">Payment Methods</h2>
                <p className="section-desc">Card on file for seamless automatic barrier exits.</p>
              </div>
            </div>

            <div className="card-on-file">
              <div className="card-visual-chip">
                <div className="chip-brand">VISA</div>
                <div className="chip-dots">•••• 4242</div>
              </div>
              <div className="card-file-details">
                <div className="card-file-name">Visa Corporate</div>
                <div className="card-file-exp">Expires 12/28 • Primary Account</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
