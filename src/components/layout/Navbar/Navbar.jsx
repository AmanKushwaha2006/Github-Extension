import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../common/Button/Button';
import { Code2, GitFork, ArrowRight, Compass, Sparkles, LayoutDashboard, Boxes, GitPullRequest } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAnalyzeClick = () => {
    navigate('/repository');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="app-navbar" id="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <div className="nav-brand__icon">
            <Code2 size={20} />
          </div>
          <div className="nav-brand__text">
            <span className="brand-title">Codebase<span className="accent-text">IQ</span></span>
            <span className="brand-subtitle">GitHub Intelligence</span>
          </div>
        </Link>

        <nav className="nav-menu" aria-label="Main Navigation">
          <Link 
            to="/" 
            className={`nav-menu__link ${isActive('/') ? 'nav-menu__link--active' : ''}`}
          >
            Overview
          </Link>
          <Link 
            to="/dashboard" 
            className={`nav-menu__link ${isActive('/dashboard') ? 'nav-menu__link--active' : ''}`}
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/flow" 
            className={`nav-menu__link ${isActive('/flow') ? 'nav-menu__link--active' : ''}`}
          >
            <Compass size={14} />
            <span>Code Flow</span>
          </Link>
          <Link 
            to="/dependencies" 
            className={`nav-menu__link ${isActive('/dependencies') ? 'nav-menu__link--active' : ''}`}
          >
            <Boxes size={14} />
            <span>Dependencies</span>
          </Link>
          <Link 
            to="/impact" 
            className={`nav-menu__link ${isActive('/impact') ? 'nav-menu__link--active' : ''}`}
          >
            <GitPullRequest size={14} />
            <span>PR Impact</span>
          </Link>
          <Link 
            to="/chat" 
            className={`nav-menu__link ${isActive('/chat') ? 'nav-menu__link--active' : ''}`}
          >
            <Sparkles size={14} />
            <span>AI Copilot</span>
          </Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="nav-menu__link nav-menu__link--external"
          >
            <GitFork size={15} />
            <span>GitHub</span>
          </a>
        </nav>

        <div className="nav-actions">
          <Button 
            variant="primary" 
            size="md" 
            onClick={handleAnalyzeClick}
            icon={<ArrowRight size={16} />}
          >
            Analyze Repository
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
