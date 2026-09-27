import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useTranslation } from '../i18n';
import { registerUser, getFriendlyAuthErrorMessage } from '../firebase/authService';
import { createUserProfile } from '../firebase/userService';
import { useAuth } from '../context/AuthContext';
import { ParkingIcon, AlertCircleIcon, EyeIcon, EyeOffIcon, ArrowRightIcon } from '../components/Icons';
import './AuthForm.css';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUserProfile } = useAuth();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      setError(t('auth.fillAllFieldsError'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.passwordLengthError'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatchError'));
      return;
    }

    if (!agreeTerms) {
      setError(t('auth.termsRequiredError'));
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create Firebase Authentication user
      const userCredential = await registerUser(trimmedEmail, password);
      const uid = userCredential.user.uid;

      // 2. Create Firestore user profile document with default role 'user'
      await createUserProfile(uid, {
        fullName: trimmedName,
        email: trimmedEmail,
        role: 'user',
      });

      // 3. Refresh profile state in context
      await refreshUserProfile();

      // 4. Redirect to user dashboard
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      console.error('Registration error:', firebaseError);
      setError(getFriendlyAuthErrorMessage(firebaseError?.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-brand-link" aria-label="SmartPark">
            <div className="auth-brand-badge">
              <ParkingIcon size={20} />
            </div>
            <span className="auth-brand-text">
              Smart<span className="brand-accent">Park</span>
            </span>
          </Link>
          <h1 className="auth-title">{t('auth.createAccountTitle')}</h1>
          <p className="auth-subtitle">{t('auth.createAccountSub')}</p>
        </div>

        {error && (
          <div className="auth-alert alert-error" role="alert">
            <AlertCircleIcon size={16} className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              {t('auth.fullNameLabel')}
            </label>
            <input
              id="fullName"
              type="text"
              className="form-input"
              placeholder={t('auth.fullNamePlaceholder')}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t('auth.emailLabel')}
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {t('auth.passwordLabel')}
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder={t('auth.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              {t('auth.confirmPasswordLabel')}
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              placeholder={t('auth.confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={isLoading}
              />
              <span>{t('auth.agreeTerms')}</span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={isLoading}
          >
            <span>{isLoading ? t('auth.creatingAccountBtn') : t('auth.createAccountBtn')}</span>
            {!isLoading && <ArrowRightIcon size={16} />}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            {t('auth.hasAccountPrompt')}{' '}
            <Link to="/login" className="auth-switch-link">
              {t('auth.signInLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

