import React from 'react';
import { Navbar } from '../components/layout/Navbar/Navbar';
import { Footer } from '../components/layout/Footer/Footer';
import './PublicLayout.css';

export const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      {/* Background ambient lighting */}
      <div className="ambient-glow glow-1" aria-hidden="true" />
      <div className="ambient-glow glow-2" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      {/* Global Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="public-layout__main">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
