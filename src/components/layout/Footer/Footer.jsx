import React from 'react';
import { Code2 } from 'lucide-react';
import './Footer.css';

const currentYear = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-brand__logo">
            <div className="logo-icon-sm">
              <Code2 size={16} />
            </div>
            <span className="footer-title">GitHub Codebase <span className="accent-text">Intelligence</span></span>
          </div>
          <p className="footer-description">
            A developer platform designed to automatically analyze and visually represent software architecture, full-stack data flow, and code connectivity.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <span className="footer-col__title">Core Capabilities</span>
            <a href="#features">Architecture Topology</a>
            <a href="#features">Feature Explorer</a>
            <a href="#features">Code Flow</a>
            <a href="#features">API Mapping</a>
          </div>

          <div className="footer-col">
            <span className="footer-col__title">Navigation</span>
            <a href="#how-it-works">How It Works</a>
            <a href="#preview">Interactive Preview</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom__inner">
          <p>&copy; {currentYear} GitHub Codebase Intelligence. Built for developer productivity.</p>
          <div className="footer-status">
            <span className="status-dot"></span>
            <span>Platform Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
