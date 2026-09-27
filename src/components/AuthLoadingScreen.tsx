import React from "react";
import { ParkingIcon } from "./Icons";
import "./AuthLoadingScreen.css";

export const AuthLoadingScreen: React.FC = () => {
  return (
    <div className="auth-loading-screen" role="status" aria-live="polite">
      <div className="auth-loading-content">
        <div className="auth-loading-brand">
          <div className="auth-loading-badge">
            <ParkingIcon size={18} />
          </div>
          <span className="auth-loading-name">
            Smart<span className="brand-accent">Park</span>
          </span>
        </div>
        <div className="auth-spinner"></div>
        <p className="auth-loading-text">Synchronizing SmartPark secure session...</p>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
