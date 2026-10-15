import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card/Card';
import { Button } from '../../components/common/Button/Button';
import { Badge } from '../../components/common/Badge/Badge';
import { 
  analyzeRepository, 
  generateArchitectureMarkdown, 
  generateOpenAPISpec 
} from '../../services/githubService';
import { 
  GitBranch, 
  Star, 
  GitFork, 
  AlertCircle, 
  ExternalLink, 
  Network, 
  Globe2, 
  FileCode2, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  ArrowLeft, 
  Search, 
  Code2, 
  Compass, 
  Boxes,
  GitPullRequest,
  Download,
  FileText,
  X,
  Check
} from 'lucide-react';
import './Dashboard.css';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target') || 'expressjs/express';

  const [repoData, setRepoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('topology'); // 'topology' | 'api' | 'files' | 'insights'
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTab, setExportTab] = useState('markdown'); // 'markdown' | 'openapi'
  const [copiedExport, setCopiedExport] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      // Check sessionStorage first
      try {
        const cached = sessionStorage.getItem(`analysis_${target}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (isMounted) {
            setRepoData(parsed);
            if (parsed.architecture?.length) {
              setSelectedNodeId(parsed.architecture[0].id);
            }
            setLoading(false);
            return;
          }
        }
      } catch {
        // Continue to fresh fetch
      }

      try {
        const res = await analyzeRepository(target);
        if (isMounted) {
          setRepoData(res.data);
          if (res.data.architecture?.length) {
            setSelectedNodeId(res.data.architecture[0].id);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load codebase analysis.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [target]);

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  if (loading) {
    return (
      <div className="dashboard-loading-state">
        <div className="loading-spinner-wrap">
          <svg className="animate-spin" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.2"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg>
        </div>
        <h3>Compiling Codebase Intelligence...</h3>
        <p>Loading architectural topology and endpoint registry for {target}</p>
      </div>
    );
  }

  if (error || !repoData) {
    return (
      <div className="dashboard-error-state">
        <AlertCircle size={40} className="error-icon" />
        <h2>Analysis Unavailable</h2>
        <p>{error || 'Could not find analysis data for this repository.'}</p>
        <div className="error-actions">
          <Button variant="primary" onClick={() => navigate('/repository')}>
            Select Another Repository
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const activeNode = repoData.architecture?.find(n => n.id === selectedNodeId) || repoData.architecture?.[0];

  const filteredFiles = (repoData.files || repoData.insights?.keyFiles || []).filter(f => 
    f.toLowerCase().includes(fileSearchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        {/* Top Header Bar */}
        <div className="dashboard-top-nav">
          <Link to="/repository" className="nav-back-link">
            <ArrowLeft size={16} />
            <span>Select Another Repo</span>
          </Link>

          <div className="dashboard-actions">
            <Button 
              variant="outline" 
              size="sm"
              icon={<Compass size={14} />}
              onClick={() => navigate(`/flow?target=${encodeURIComponent(target)}`)}
            >
              Trace Flow
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              icon={<Boxes size={14} />}
              onClick={() => navigate(`/dependencies?target=${encodeURIComponent(target)}`)}
            >
              Dependencies
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              icon={<GitPullRequest size={14} />}
              onClick={() => navigate(`/impact?target=${encodeURIComponent(target)}`)}
            >
              PR Impact
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              icon={<Download size={14} />}
              onClick={() => setShowExportModal(true)}
            >
              Export Docs
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              icon={<Sparkles size={14} />}
              onClick={() => navigate(`/chat?target=${encodeURIComponent(target)}`)}
            >
              Ask Copilot
            </Button>
            <a 
              href={`https://github.com/${repoData.fullName}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-ext-link"
            >
              <span>GitHub</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Repository Hero Overview Card */}
        <Card variant="glass" className="repo-meta-card">
          <div className="repo-meta-main">
            <div className="repo-identity">
              <div className="repo-avatar">
                <GitBranch size={24} />
              </div>
              <div>
                <div className="repo-title-row">
                  <h1 className="repo-main-name">{repoData.fullName}</h1>
                  <Badge variant="teal" dot>Live Intelligence</Badge>
                </div>
                <p className="repo-main-desc">{repoData.description}</p>
              </div>
            </div>

            <div className="repo-badges-row">
              <div className="stat-badge">
                <Star size={15} className="star-icon" />
                <span>{repoData.stars?.toLocaleString()} stars</span>
              </div>
              <div className="stat-badge">
                <GitFork size={15} />
                <span>{repoData.forks?.toLocaleString()} forks</span>
              </div>
              <div className="stat-badge">
                <AlertCircle size={15} />
                <span>{repoData.openIssues?.toLocaleString()} issues</span>
              </div>
              <div className="stat-badge">
                <span className="dot-branch" />
                <span>branch: {repoData.defaultBranch || 'main'}</span>
              </div>
            </div>
          </div>

          {/* Languages Breakdown Bar */}
          <div className="repo-lang-bar-section">
            <div className="lang-bar-track">
              {Object.entries(repoData.languages || {}).map(([lang, pct], idx) => {
                const colors = ['#38BDF8', '#14B8A6', '#F59E0B', '#A855F7', '#EF4444'];
                return (
                  <div 
                    key={lang}
                    className="lang-bar-segment"
                    style={{ 
                      width: `${pct}%`,
                      backgroundColor: colors[idx % colors.length]
                    }}
                    title={`${lang}: ${pct}%`}
                  />
                );
              })}
            </div>
            <div className="lang-legend">
              {Object.entries(repoData.languages || {}).map(([lang, pct], idx) => {
                const colors = ['#38BDF8', '#14B8A6', '#F59E0B', '#A855F7', '#EF4444'];
                return (
                  <span key={lang} className="lang-legend-item">
                    <span className="legend-dot" style={{ backgroundColor: colors[idx % colors.length] }} />
                    <span className="legend-text">{lang} ({pct}%)</span>
                  </span>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Dashboard Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'topology' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('topology')}
          >
            <Network size={16} />
            <span>Architecture Topology</span>
          </button>
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'api' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            <Globe2 size={16} />
            <span>API & Route Registry ({repoData.endpoints?.length || 0})</span>
          </button>
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'insights' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            <Sparkles size={16} />
            <span>AI Architectural Insights</span>
          </button>
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'files' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            <FileCode2 size={16} />
            <span>Module & File Explorer</span>
          </button>
        </div>

        {/* TAB 1: ARCHITECTURE TOPOLOGY */}
        {activeTab === 'topology' && (
          <div className="tab-pane-topology">
            <Card variant="glass" className="topology-card">
              <div className="topology-header">
                <div>
                  <h3 className="section-title">End-to-End System Architecture</h3>
                  <p className="section-desc">Click any subsystem node to inspect its file location, AST responsibility, and code implementation.</p>
                </div>
                <div className="topology-legend">
                  <span className="verified-badge">
                    <CheckCircle2 size={14} />
                    <span>AST Verified Links</span>
                  </span>
                </div>
              </div>

              {/* Visual Flow Nodes */}
              <div className="topology-graph-flow">
                {repoData.architecture?.map((node, index) => {
                  const isSelected = selectedNodeId === node.id;
                  return (
                    <React.Fragment key={node.id}>
                      <button
                        type="button"
                        className={`graph-node ${isSelected ? 'graph-node--selected' : ''}`}
                        onClick={() => setSelectedNodeId(node.id)}
                      >
                        <span className="node-type-label">{node.type}</span>
                        <h4 className="node-title">{node.name}</h4>
                        <span className="node-path">{node.file?.split('/').pop()}</span>
                      </button>

                      {index < repoData.architecture.length - 1 && (
                        <div className="graph-connector">
                          <div className="connector-line">
                            <span className="connector-particle" />
                          </div>
                          <span className="connector-arrow">➔</span>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Subsystem Deep Inspector Drawer */}
              {activeNode && (
                <div className="subsystem-inspector">
                  <div className="inspector-top-row">
                    <div>
                      <span className="inspector-category">{activeNode.type} Subsystem</span>
                      <h4 className="inspector-title">{activeNode.name}</h4>
                      <p className="inspector-desc">{activeNode.detail}</p>
                    </div>
                    <div className="inspector-copy-btn">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Copy size={14} />}
                        onClick={() => handleCopyCode(activeNode.code || '')}
                      >
                        {copiedSnippet ? 'Copied!' : 'Copy Code'}
                      </Button>
                    </div>
                  </div>

                  <div className="code-viewer-box">
                    <div className="code-viewer-bar">
                      <span className="code-file-label">{activeNode.file}</span>
                      <span className="code-badge">JavaScript / AST</span>
                    </div>
                    <pre className="code-display">
                      <code>{activeNode.code}</code>
                    </pre>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 2: API & ROUTE REGISTRY */}
        {activeTab === 'api' && (
          <div className="tab-pane-api">
            <Card variant="glass" className="api-registry-card">
              <div className="api-header">
                <div>
                  <h3 className="section-title">Discovered Endpoints & Handlers</h3>
                  <p className="section-desc">Identified routes, HTTP methods, and dispatch controller functions.</p>
                </div>
              </div>

              <div className="endpoints-table-wrap">
                <table className="endpoints-table">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Path / Route</th>
                      <th>Handler Function</th>
                      <th>Source File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(repoData.endpoints || []).map((ep, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className={`method-badge method-${ep.method.toLowerCase()}`}>
                            {ep.method}
                          </span>
                        </td>
                        <td>
                          <code className="endpoint-path">{ep.path}</code>
                        </td>
                        <td>
                          <span className="endpoint-handler">{ep.handler}</span>
                        </td>
                        <td>
                          <span className="endpoint-file">{ep.file}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: AI ARCHITECTURAL INSIGHTS */}
        {activeTab === 'insights' && (
          <div className="tab-pane-insights">
            <div className="insights-grid">
              
              <Card variant="glass" className="insight-card-main">
                <div className="card-badge-row">
                  <Badge variant="teal">Executive Summary</Badge>
                </div>
                <h3 className="insight-heading">Architecture Synopsis</h3>
                <p className="insight-text">
                  {repoData.insights?.summary || 'Standard modular architecture separating view layers, routers, and data services.'}
                </p>

                <div className="patterns-section">
                  <h4 className="sub-heading">Detected Design Patterns</h4>
                  <div className="pattern-tags">
                    {(repoData.insights?.patterns || ['Modular Pipeline', 'Layered Architecture']).map(pattern => (
                      <span key={pattern} className="pattern-pill">
                        <CheckCircle2 size={13} />
                        <span>{pattern}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              <Card variant="glass" className="insight-card-strengths">
                <h3 className="insight-heading">Architectural Strengths</h3>
                <ul className="strengths-list">
                  {(repoData.insights?.strengths || ['High cohesion and decoupling', 'Clear responsibility separation']).map((str, i) => (
                    <li key={i} className="strength-item">
                      <span className="strength-bullet">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="insight-heading" style={{ marginTop: '24px' }}>Key Entry Points</h3>
                <div className="key-files-list">
                  {(repoData.insights?.keyFiles || ['src/index.js']).map((f, i) => (
                    <div key={i} className="key-file-row">
                      <Code2 size={14} className="code-icon" />
                      <span className="key-file-name">{f}</span>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          </div>
        )}

        {/* TAB 4: FILE & MODULE EXPLORER */}
        {activeTab === 'files' && (
          <div className="tab-pane-files">
            <Card variant="glass" className="files-card">
              <div className="files-header">
                <div>
                  <h3 className="section-title">Indexed Repository Files</h3>
                  <p className="section-desc">Total mapped files: {repoData.fileCount || 0}</p>
                </div>
                <div className="files-search-wrap">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Filter files by name..."
                    value={fileSearchQuery}
                    onChange={(e) => setFileSearchQuery(e.target.value)}
                    className="files-search-input"
                  />
                </div>
              </div>

              <div className="files-list">
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file, i) => (
                    <div key={i} className="file-item-row">
                      <FileCode2 size={15} className="file-icon" />
                      <span className="file-path-text">{file}</span>
                      <span className="file-type-pill">Source</span>
                    </div>
                  ))
                ) : (
                  <div className="files-empty">No files matched your filter query.</div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Architecture Export Studio Modal */}
        {showExportModal && (
          <div className="export-modal-backdrop" onClick={() => setShowExportModal(false)}>
            <div className="export-modal-card" onClick={e => e.stopPropagation()}>
              
              <div className="export-modal-header">
                <div className="export-title-wrap">
                  <Download size={20} className="export-icon" />
                  <div>
                    <h3 className="export-modal-title">Architecture Export Studio</h3>
                    <span className="export-modal-sub">Generate and download specification documents for {repoData.fullName}</span>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="modal-close-btn" 
                  onClick={() => setShowExportModal(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Export Mode Tabs */}
              <div className="export-tabs-row">
                <button
                  type="button"
                  className={`export-tab-pill ${exportTab === 'markdown' ? 'export-tab-pill--active' : ''}`}
                  onClick={() => setExportTab('markdown')}
                >
                  <FileText size={14} />
                  <span>ARCHITECTURE.md (with Mermaid)</span>
                </button>
                <button
                  type="button"
                  className={`export-tab-pill ${exportTab === 'openapi' ? 'export-tab-pill--active' : ''}`}
                  onClick={() => setExportTab('openapi')}
                >
                  <Globe2 size={14} />
                  <span>OpenAPI 3.0 Specification (JSON)</span>
                </button>
              </div>

              {/* Code Export Viewer */}
              <div className="export-code-panel">
                <div className="export-panel-top">
                  <span className="export-filename">
                    {exportTab === 'markdown' ? 'ARCHITECTURE.md' : 'openapi.json'}
                  </span>
                  <div className="export-action-btns">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={copiedExport ? <Check size={13} /> : <Copy size={13} />}
                      onClick={() => {
                        const content = exportTab === 'markdown' 
                          ? generateArchitectureMarkdown(repoData)
                          : JSON.stringify(generateOpenAPISpec(repoData), null, 2);
                        navigator.clipboard.writeText(content);
                        setCopiedExport(true);
                        setTimeout(() => setCopiedExport(false), 2000);
                      }}
                    >
                      {copiedExport ? 'Copied' : 'Copy'}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Download size={13} />}
                      onClick={() => {
                        const content = exportTab === 'markdown' 
                          ? generateArchitectureMarkdown(repoData)
                          : JSON.stringify(generateOpenAPISpec(repoData), null, 2);
                        const filename = exportTab === 'markdown' ? 'ARCHITECTURE.md' : 'openapi.json';
                        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download File
                    </Button>
                  </div>
                </div>

                <pre className="export-code-preview">
                  <code>
                    {exportTab === 'markdown' 
                      ? generateArchitectureMarkdown(repoData)
                      : JSON.stringify(generateOpenAPISpec(repoData), null, 2)}
                  </code>
                </pre>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
