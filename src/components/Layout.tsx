import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

export const Layout: React.FC = () => {
  return (
    <div className="smartpark-layout">
      <Navbar />
      <main className="smartpark-main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
