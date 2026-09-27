import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import { useTranslation } from '../i18n';
import { loginUser, getFriendlyAuthErrorMessage } from '../firebase/authService';
import { ParkingIcon, AlertCircleIcon, EyeIcon, EyeOffIcon, ArrowRightIcon } from '../components/Icons';
import './AuthForm.css';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const from = (location.state as LocationState)?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError(t('auth.fillAllFieldsError'));
      return;
    }

    setIsLoading(true);

    try {
      await loginUser(trimmedEmail, password);
      // Firebase auth state updates automatically via AuthContext
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      console.error('Login error:', firebaseError);
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
          <h1 className="auth-title">{t('auth.welcomeBackTitle')}</h1>
          <p className="auth-subtitle">{t('auth.welcomeBackSub')}</p>
        </div>

        {error && (
          <div className="auth-alert alert-error" role="alert">
            <AlertCircleIcon size={16} className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
            <div className="label-row">
              <label htmlFor="password" className="form-label">
                {t('auth.passwordLabel')}
              </label>
            </div>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder={t('auth.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={isLoading}
          >
            <span>{isLoading ? t('auth.signingInBtn') : t('auth.signInBtn')}</span>
            {!isLoading && <ArrowRightIcon size={16} />}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            {t('auth.noAccountPrompt')}{' '}
            <Link to="/register" className="auth-switch-link">
              {t('auth.createAccountLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

