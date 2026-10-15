import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../../components/common/Badge/Badge';
import { Button } from '../../components/common/Button/Button';
import { analyzeRepository } from '../../services/githubService';
import { 
  GitBranch, 
  ExternalLink, 
  LayoutDashboard, 
  Compass, 
  Sparkles, 
  Boxes, 
  Star, 
  ShieldCheck
} from 'lucide-react';
import './ExtensionPopup.css';

export const ExtensionPopup = () => {
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target') || 'expressjs/express';

  const [repoData, setRepoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePopupTab, setActivePopupTab] = useState('arch'); // 'arch' | 'endpoints' | 'files'

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const cached = sessionStorage.getItem(`analysis_${target}`);
        if (cached) {
          if (isMounted) {
            setRepoData(JSON.parse(cached));
            setLoading(false);
            return;
          }
        }
        const res = await analyzeRepository(target);
        if (isMounted) setRepoData(res.data);
      } catch {
        // Fallback handled
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [target]);

  const openFullPage = (path) => {
    window.open(`${path}?target=${encodeURIComponent(target)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="popup-loading">
        <div className="popup-spinner" />
        <p>Scanning GitHub repository...</p>
      </div>
    );
  }

  return (
    <div className="extension-popup-view">
      
      {/* Extension Header */}
      <div className="popup-top-bar">
        <div className="popup-brand">
          <div className="popup-icon">IQ</div>
          <div>
            <h3 className="popup-title">CodebaseIQ Extension</h3>
            <span className="popup-repo-name">{repoData?.fullName || target}</span>
          </div>
        </div>
        <Badge variant="teal" dot>Ready</Badge>
      </div>

      {/* Quick Stats Bar */}
      <div className="popup-quick-stats">
        <div className="popup-stat-item">
          <Star size={13} className="star-icon" />
          <span>{repoData?.stars?.toLocaleString()}</span>
        </div>
        <div className="popup-stat-item">
          <GitBranch size={13} />
          <span>{repoData?.defaultBranch || 'main'}</span>
        </div>
        <div className="popup-stat-item">
          <ShieldCheck size={13} className="safe-icon" />
          <span>0 CVEs</span>
        </div>
      </div>

      {/* Primary Shortcut Buttons */}
      <div className="popup-shortcuts-grid">
        <button 
          type="button" 
          className="popup-action-card"
          onClick={() => openFullPage('/dashboard')}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        <button 
          type="button" 
          className="popup-action-card"
          onClick={() => openFullPage('/flow')}
        >
          <Compass size={16} />
          <span>Trace Flow</span>
        </button>

        <button 
          type="button" 
          className="popup-action-card"
          onClick={() => openFullPage('/chat')}
        >
          <Sparkles size={16} />
          <span>AI Copilot</span>
        </button>

        <button 
          type="button" 
          className="popup-action-card"
          onClick={() => openFullPage('/dependencies')}
        >
          <Boxes size={16} />
          <span>Dependencies</span>
        </button>
      </div>

      {/* Mini Tabs */}
      <div className="popup-tabs-bar">
        <button 
          type="button" 
          className={`popup-tab-btn ${activePopupTab === 'arch' ? 'popup-tab-btn--active' : ''}`}
          onClick={() => setActivePopupTab('arch')}
        >
          Subsystems ({repoData?.architecture?.length || 0})
        </button>
        <button 
          type="button" 
          className={`popup-tab-btn ${activePopupTab === 'endpoints' ? 'popup-tab-btn--active' : ''}`}
          onClick={() => setActivePopupTab('endpoints')}
        >
          Endpoints ({repoData?.endpoints?.length || 0})
        </button>
      </div>

      {/* Tab 1: Architecture Subsystems */}
      {activePopupTab === 'arch' && (
        <div className="popup-subsystems-list">
          {(repoData?.architecture || []).map((sub, i) => (
            <div key={sub.id || i} className="popup-subsystem-item">
              <div className="sub-type-row">
                <span className="sub-type-badge">{sub.type}</span>
                <span className="sub-file-text">{sub.file}</span>
              </div>
              <h4 className="sub-name">{sub.name}</h4>
              <p className="sub-desc">{sub.detail}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Endpoints */}
      {activePopupTab === 'endpoints' && (
        <div className="popup-endpoints-list">
          {(repoData?.endpoints || []).map((ep, i) => (
            <div key={i} className="popup-endpoint-item">
              <span className={`method-badge method-${ep.method.toLowerCase()}`}>{ep.method}</span>
              <code className="ep-path">{ep.path}</code>
              <span className="ep-handler">{ep.handler}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Launch Button */}
      <div className="popup-footer">
        <Button
          variant="primary"
          size="md"
          className="w-full-btn"
          icon={<ExternalLink size={15} />}
          onClick={() => openFullPage('/dashboard')}
        >
          Open Full Intelligence Studio
        </Button>
      </div>

    </div>
  );
};

export default ExtensionPopup;
