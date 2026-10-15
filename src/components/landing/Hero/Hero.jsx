import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../common/Button/Button';
import { Badge } from '../../common/Badge/Badge';
import { ArrowRight, Compass, Search, Sparkles } from 'lucide-react';
import './Hero.css';

export const Hero = () => {
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null);

  const sampleRepos = [
    { name: 'AmanKushwaha2006/Github-Extension', color: '#14B8A6' },
    { name: 'expressjs/express', color: '#22C55E' },
    { name: 'facebook/react', color: '#38BDF8' },
    { name: 'tailwindlabs/tailwindcss', color: '#38BDF8' },
    { name: 'vercel/next.js', color: '#FFFFFF' }
  ];

  const handleAnalyze = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) {
      setFeedback('Please enter a GitHub repository URL or username (e.g. facebook/react)');
      return;
    }
    // Navigate to /repository route with query param or state
    navigate(`/repository?target=${encodeURIComponent(trimmed)}`);
  };

  const handleSampleClick = (repoName) => {
    setInputVal(repoName);
    setFeedback(null);
  };

  return (
    <section className="landing-hero" id="hero">
      <div className="hero-container">
        
        {/* Top Feature Badge */}
        <div className="hero-badge-wrapper">
          <Badge variant="teal" dot>
            <span className="badge-icon"><Sparkles size={13} /></span>
            Next-Gen GitHub Codebase Intelligence
          </Badge>
        </div>

        {/* Main Headings */}
        <h1 className="hero-heading">
          Understand Any GitHub Codebase. <br />
          <span className="gradient-text">Visually.</span>
        </h1>

        <p className="hero-description">
          Analyze repositories, discover architecture, trace features, and understand how the code works without opening hundreds of files manually.
        </p>

        {/* Action Input Bar */}
        <div className="hero-input-box" id="analyzer">
          <form className="hero-input-form" onSubmit={handleAnalyze}>
            <div className="input-field-wrapper">
              <span className="input-search-icon">
                <Search size={18} />
              </span>
              <input 
                type="text" 
                className="repo-text-input" 
                placeholder="Paste GitHub repository (e.g. owner/repo or https://github.com/...)"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (feedback) setFeedback(null);
                }}
                spellCheck={false}
                autoComplete="off"
              />
              <Button 
                type="submit" 
                variant="primary" 
                size="md" 
                icon={<ArrowRight size={16} />}
              >
                Analyze Repository
              </Button>
            </div>
            {feedback && <div className="hero-input-feedback">{feedback}</div>}
          </form>

          {/* Quick Sample Repos */}
          <div className="hero-samples">
            <span className="samples-label">Popular repositories:</span>
            <div className="samples-list">
              {sampleRepos.map((repo) => (
                <button 
                  key={repo.name} 
                  type="button" 
                  className="sample-pill-btn"
                  onClick={() => handleSampleClick(repo.name)}
                >
                  <span className="sample-pill-dot" style={{ backgroundColor: repo.color }} />
                  <span>{repo.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Buttons */}
        <div className="hero-cta-buttons">
          <Button 
            variant="outline" 
            size="md" 
            icon={<Compass size={16} />}
            iconPosition="left"
            onClick={() => {
              const el = document.getElementById('how-it-works');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            See How It Works
          </Button>
        </div>

      </div>
    </section>
  );
};

export default Hero;
