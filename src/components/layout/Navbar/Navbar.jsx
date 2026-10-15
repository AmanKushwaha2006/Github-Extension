import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../common/Button/Button';
import { 
  Code2, 
  GitFork, 
  ArrowRight, 
  Compass, 
  Sparkles, 
  LayoutDashboard, 
  Boxes, 
  GitPullRequest,
  Menu,
  X,
  ExternalLink,
  GitBranch
} from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Retrieve active target from search params or session storage
  const searchParams = new URLSearchParams(location.search);
  const activeTarget = searchParams.get('target') || sessionStorage.getItem('last_active_repo') || 'expressjs/express';

  const handleAnalyzeClick = () => {
    setMobileMenuOpen(false);
    navigate('/repository');
  };

  const isActive = (path) => location.pathname === path;

  // Build target-aware links for subpages
  const getSubpageLink = (path) => `${path}?target=${encodeURIComponent(activeTarget)}`;

  return (
    <header className="app-navbar" id="navbar">
      <div className="nav-container">
        
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="nav-brand__icon">
            <Code2 size={20} />
          </div>
          <div className="nav-brand__text">
            <span className="brand-title">Codebase<span className="accent-text">IQ</span></span>
            <span className="brand-subtitle">GitHub Intelligence</span>
          </div>
        </Link>

        {/* Active Repo Quick Chip */}
        <button 
          type="button" 
          className="nav-active-repo-chip"
          onClick={() => navigate('/repository')}
          title={`Active codebase: ${activeTarget}. Click to change.`}
        >
          <GitBranch size={13} className="repo-chip-icon" />
          <span className="repo-chip-name">{activeTarget}</span>
          <span className="repo-chip-badge">Change</span>
        </button>

        {/* Desktop Navigation Menu */}
        <nav className="nav-menu" aria-label="Main Navigation">
          <Link 
            to="/" 
            className={`nav-menu__link ${isActive('/') ? 'nav-menu__link--active' : ''}`}
          >
            Overview
          </Link>
          <Link 
            to={getSubpageLink('/dashboard')} 
            className={`nav-menu__link ${isActive('/dashboard') ? 'nav-menu__link--active' : ''}`}
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </Link>
          <Link 
            to={getSubpageLink('/flow')} 
            className={`nav-menu__link ${isActive('/flow') ? 'nav-menu__link--active' : ''}`}
          >
            <Compass size={14} />
            <span>Code Flow</span>
          </Link>
          <Link 
            to={getSubpageLink('/dependencies')} 
            className={`nav-menu__link ${isActive('/dependencies') ? 'nav-menu__link--active' : ''}`}
          >
            <Boxes size={14} />
            <span>Dependencies</span>
          </Link>
          <Link 
            to={getSubpageLink('/impact')} 
            className={`nav-menu__link ${isActive('/impact') ? 'nav-menu__link--active' : ''}`}
          >
            <GitPullRequest size={14} />
            <span>PR Impact</span>
          </Link>
          <Link 
            to={getSubpageLink('/chat')} 
            className={`nav-menu__link ${isActive('/chat') ? 'nav-menu__link--active' : ''}`}
          >
            <Sparkles size={14} />
            <span>AI Copilot</span>
          </Link>
          <a 
            href="https://github.com/AmanKushwaha2006/Github-Extension" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="nav-menu__link nav-menu__link--external"
          >
            <GitFork size={15} />
            <span>GitHub</span>
          </a>
        </nav>

        {/* Actions & Mobile Toggle */}
        <div className="nav-actions">
          <Button 
            variant="primary" 
            size="md" 
            onClick={handleAnalyzeClick}
            icon={<ArrowRight size={16} />}
            className="desktop-analyze-btn"
          >
            Analyze Repository
          </Button>

          {/* Mobile Menu Toggle Button */}
          <button 
            type="button" 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-menu-inner">
            <Link 
              to="/" 
              className={`mobile-menu-item ${isActive('/') ? 'mobile-menu-item--active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Code2 size={16} />
              <span>Overview</span>
            </Link>
            <Link 
              to={getSubpageLink('/dashboard')} 
              className={`mobile-menu-item ${isActive('/dashboard') ? 'mobile-menu-item--active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to={getSubpageLink('/flow')} 
              className={`mobile-menu-item ${isActive('/flow') ? 'mobile-menu-item--active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Compass size={16} />
              <span>Code Flow</span>
            </Link>
            <Link 
              to={getSubpageLink('/dependencies')} 
              className={`mobile-menu-item ${isActive('/dependencies') ? 'mobile-menu-item--active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Boxes size={16} />
              <span>Dependencies</span>
            </Link>
            <Link 
              to={getSubpageLink('/impact')} 
              className={`mobile-menu-item ${isActive('/impact') ? 'mobile-menu-item--active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <GitPullRequest size={16} />
              <span>PR Impact</span>
            </Link>
            <Link 
              to={getSubpageLink('/chat')} 
              className={`mobile-menu-item ${isActive('/chat') ? 'mobile-menu-item--active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles size={16} />
              <span>AI Copilot</span>
            </Link>
            <Link 
              to={getSubpageLink('/popup')} 
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ExternalLink size={16} />
              <span>Chrome Extension View</span>
            </Link>
            <a 
              href="https://github.com/AmanKushwaha2006/Github-Extension" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              <GitFork size={16} />
              <span>GitHub Repository</span>
            </a>

            <div className="mobile-menu-footer">
              <Button 
                variant="primary" 
                size="md" 
                onClick={handleAnalyzeClick}
                icon={<ArrowRight size={16} />}
                className="w-full"
              >
                Analyze New Repository
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
