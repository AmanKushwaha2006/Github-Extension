import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, GitFork, ExternalLink } from 'lucide-react';
import './Footer.css';

const currentYear = new Date().getFullYear();

export const Footer = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTarget = searchParams.get('target') || sessionStorage.getItem('last_active_repo') || 'expressjs/express';

  const getSubpageLink = (path) => `${path}?target=${encodeURIComponent(activeTarget)}`;

  return (
    <footer className="app-footer">
      <div className="footer-container">
        
        {/* Brand Column */}
        <div className="footer-brand">
          <Link to="/" className="footer-brand__logo" style={{ textDecoration: 'none' }}>
            <div className="logo-icon-sm">
              <Code2 size={16} />
            </div>
            <span className="footer-title">Codebase<span className="accent-text">IQ</span> Intelligence</span>
          </Link>
          <p className="footer-description">
            A developer platform and Chrome extension designed to automatically analyze and visually represent software architecture, full-stack code flows, dependency ecosystems, and PR impact.
          </p>
        </div>

        {/* Links Grid */}
        <div className="footer-links-grid">
          <div className="footer-col">
            <span className="footer-col__title">Core Capabilities</span>
            <Link to={getSubpageLink('/dashboard')}>Architecture Topology</Link>
            <Link to={getSubpageLink('/flow')}>Interactive Code Flow</Link>
            <Link to={getSubpageLink('/dependencies')}>Dependency Graph</Link>
            <Link to={getSubpageLink('/impact')}>PR Blast Radius</Link>
            <Link to={getSubpageLink('/chat')}>AI Copilot</Link>
          </div>

          <div className="footer-col">
            <span className="footer-col__title">Explore & Tools</span>
            <Link to="/repository">Analyze Any Repository</Link>
            <Link to="/#how-it-works">How It Works</Link>
            <Link to="/#preview">Interactive Preview</Link>
            <Link to={getSubpageLink('/popup')} target="_blank">
              <span>Extension Popup</span>
              <ExternalLink size={12} style={{ display: 'inline', marginLeft: '4px' }} />
            </Link>
            <a 
              href="https://github.com/AmanKushwaha2006/Github-Extension" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <span>GitHub Repo</span>
              <GitFork size={12} style={{ display: 'inline', marginLeft: '4px' }} />
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-bottom__inner">
          <p>&copy; {currentYear} CodebaseIQ &bull; Developed by Aman Kushwaha. Built for developer productivity.</p>
          <div className="footer-status">
            <span className="status-dot"></span>
            <span>Platform Ready &bull; AST Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
