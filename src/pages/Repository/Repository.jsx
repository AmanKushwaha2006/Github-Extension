import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card/Card';
import { Button } from '../../components/common/Button/Button';
import { Badge } from '../../components/common/Badge/Badge';
import { parseRepoInput } from '../../services/githubService';
import { 
  GitBranch, 
  Search, 
  ArrowRight, 
  Sliders, 
  CheckCircle2, 
  ArrowLeft,
  Star
} from 'lucide-react';
import './Repository.css';

export const Repository = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTarget = searchParams.get('target') || '';

  const [inputVal, setInputVal] = useState(initialTarget);
  const [errorMsg, setErrorMsg] = useState(null);
  const [scanDepth, setScanDepth] = useState('deep'); // 'fast' | 'deep' | 'full'

  const featuredRepos = [
    {
      name: 'expressjs/express',
      desc: 'Fast, unopinionated, minimalist web framework for node.',
      stars: '64.2k',
      lang: 'JavaScript',
      langColor: '#F7DF1E',
      type: 'Backend REST API'
    },
    {
      name: 'facebook/react',
      desc: 'The library for web and native user interfaces with Fiber reconciliation.',
      stars: '231k',
      lang: 'JavaScript',
      langColor: '#61DAFB',
      type: 'UI Component Architecture'
    },
    {
      name: 'tailwindlabs/tailwindcss',
      desc: 'A utility-first CSS framework for rapid UI development & JIT compiler.',
      stars: '86.5k',
      lang: 'TypeScript',
      langColor: '#3178C6',
      type: 'CSS Compiler Engine'
    },
    {
      name: 'vercel/next.js',
      desc: 'The React Framework for the Web with App Router & React Server Components.',
      stars: '131k',
      lang: 'TypeScript',
      langColor: '#3178C6',
      type: 'Full-Stack Framework'
    }
  ];

  const handleStartAnalysis = (target) => {
    const raw = target || inputVal;
    const parsed = parseRepoInput(raw);
    if (!parsed) {
      setErrorMsg('Please enter a valid repository format, e.g. "facebook/react" or a GitHub URL.');
      return;
    }
    setErrorMsg(null);
    navigate(`/analysis?target=${encodeURIComponent(parsed.fullName)}&depth=${scanDepth}`);
  };

  return (
    <div className="repository-page">
      <div className="repo-container">
        
        {/* Navigation Breadcrumb */}
        <div className="repo-breadcrumb">
          <Link to="/" className="breadcrumb-link">
            <ArrowLeft size={16} />
            <span>Back to Overview</span>
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Repository Selection</span>
        </div>

        {/* Header Section */}
        <div className="repo-header">
          <Badge variant="teal" dot>
            Step 1 of 3: Repository Input
          </Badge>
          <h1 className="repo-title">Select a GitHub Repository</h1>
          <p className="repo-subtitle">
            Provide any public GitHub repository to construct an interactive AST architecture map, code flow diagrams, and API routes.
          </p>
        </div>

        {/* Input Bar Form */}
        <Card variant="glass" className="repo-search-card">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleStartAnalysis();
            }}
            className="repo-form"
          >
            <div className="repo-input-row">
              <span className="repo-search-icon">
                <Search size={20} />
              </span>
              <input
                type="text"
                className="repo-input-field"
                placeholder="Paste GitHub URL or 'owner/repo' (e.g. facebook/react)"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                spellCheck={false}
                autoFocus
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={<ArrowRight size={16} />}
              >
                Analyze Codebase
              </Button>
            </div>
            {errorMsg && <div className="repo-error-message">{errorMsg}</div>}
          </form>

          {/* Depth / Strategy Options */}
          <div className="analysis-depth-row">
            <span className="depth-label">
              <Sliders size={14} />
              <span>Analysis Depth:</span>
            </span>
            <div className="depth-pills">
              <button 
                type="button" 
                className={`depth-pill ${scanDepth === 'fast' ? 'depth-pill--active' : ''}`}
                onClick={() => setScanDepth('fast')}
              >
                Quick Structure
              </button>
              <button 
                type="button" 
                className={`depth-pill ${scanDepth === 'deep' ? 'depth-pill--active' : ''}`}
                onClick={() => setScanDepth('deep')}
              >
                Deep AST Topology (Recommended)
              </button>
              <button 
                type="button" 
                className={`depth-pill ${scanDepth === 'full' ? 'depth-pill--active' : ''}`}
                onClick={() => setScanDepth('full')}
              >
                Full Stack & Endpoints
              </button>
            </div>
          </div>
        </Card>

        {/* Featured / Popular Repositories Grid */}
        <div className="featured-section">
          <div className="featured-header">
            <h2 className="featured-title">Or choose a benchmark repository</h2>
            <p className="featured-desc">Pre-indexed reference architectures ready for immediate visual exploration.</p>
          </div>

          <div className="featured-grid">
            {featuredRepos.map((repo) => (
              <Card 
                key={repo.name} 
                variant="default" 
                hoverable 
                className="featured-repo-card"
                onClick={() => handleStartAnalysis(repo.name)}
              >
                <div className="featured-card-top">
                  <div className="repo-icon-wrap">
                    <GitBranch size={20} />
                  </div>
                  <span className="repo-type-tag">{repo.type}</span>
                </div>

                <h3 className="featured-repo-name">{repo.name}</h3>
                <p className="featured-repo-desc">{repo.desc}</p>

                <div className="featured-card-bottom">
                  <div className="repo-meta-item">
                    <span className="lang-dot" style={{ backgroundColor: repo.langColor }} />
                    <span className="lang-text">{repo.lang}</span>
                  </div>
                  <div className="repo-meta-item">
                    <Star size={14} className="star-icon" />
                    <span>{repo.stars}</span>
                  </div>
                  <span className="analyze-action">
                    <span>Inspect</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="repo-guarantees">
          <div className="guarantee-item">
            <CheckCircle2 size={16} className="guarantee-icon" />
            <span>No GitHub tokens or authentication required for public repositories</span>
          </div>
          <div className="guarantee-item">
            <CheckCircle2 size={16} className="guarantee-icon" />
            <span>Deterministic AST analysis mapping client, server, and data layers</span>
          </div>
          <div className="guarantee-item">
            <CheckCircle2 size={16} className="guarantee-icon" />
            <span>Interactive graph topology rendered locally in real-time</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Repository;
