import React from "react";
import "./AuthLoadingScreen.css";

export const AuthLoadingScreen: React.FC = () => {
  return (
    <div className="auth-loading-screen" role="status" aria-live="polite">
      <div className="auth-loading-content">
        <div className="auth-loading-brand">
          <span className="auth-loading-icon">🅿️</span>
          <span className="auth-loading-name">
            Smart<span className="brand-accent">Park</span>
          </span>
        </div>
        <div className="auth-spinner"></div>
        <p className="auth-loading-text">Connecting to SmartPark Secure Gateway...</p>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
