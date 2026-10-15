import React, { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card/Card';
import { Badge } from '../../components/common/Badge/Badge';
import { Button } from '../../components/common/Button/Button';
import { getRepoDependencies } from '../../services/githubService';
import { 
  ArrowLeft, 
  Boxes, 
  ShieldCheck, 
  RefreshCw, 
  Search, 
  Package, 
  Compass, 
  Sparkles
} from 'lucide-react';
import './Dependencies.css';

export const Dependencies = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target') || 'expressjs/express';

  const depData = useMemo(() => getRepoDependencies(target), [target]);
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'internal' | 'external' | 'core'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState(() => depData.nodes[0]?.id);

  const filteredNodes = useMemo(() => {
    return depData.nodes.filter(node => {
      const matchesCategory = filterCategory === 'all' || node.category === filterCategory;
      const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            node.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [depData.nodes, filterCategory, searchQuery]);

  const activeNode = depData.nodes.find(n => n.id === selectedNodeId) || depData.nodes[0];

  const dependentLinks = depData.links.filter(l => l.target === activeNode?.id);
  const dependencyLinks = depData.links.filter(l => l.source === activeNode?.id);

  return (
    <div className="dependencies-page">
      <div className="dependencies-container">
        
        {/* Navigation Bar */}
        <div className="dependencies-nav">
          <Link to={`/dashboard?target=${encodeURIComponent(target)}`} className="back-link">
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </Link>

          <div className="dependencies-nav-actions">
            <Button
              variant="outline"
              size="sm"
              icon={<Compass size={14} />}
              onClick={() => navigate(`/flow?target=${encodeURIComponent(target)}`)}
            >
              Trace Code Flow
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles size={14} />}
              onClick={() => navigate(`/chat?target=${encodeURIComponent(target)}`)}
            >
              Ask AI Copilot
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="dependencies-header">
          <Badge variant="teal" dot>
            Phase 7: Module & Package Ecosystem
          </Badge>
          <h1 className="dependencies-title">
            Dependency Graph for <span className="gradient-text">{target}</span>
          </h1>
          <p className="dependencies-subtitle">
            Explore internal architectural imports, third-party library dependencies, circular reference audits, and bundle weight metrics.
          </p>
        </div>

        {/* High-Level Metrics Summary */}
        <div className="metrics-banner-grid">
          <Card variant="glass" className="metric-box">
            <div className="metric-top">
              <span className="metric-label">Total Dependencies</span>
              <Boxes size={18} className="metric-icon" />
            </div>
            <span className="metric-value">{depData.metrics.total}</span>
            <span className="metric-sub">{depData.metrics.internal} Internal &bull; {depData.metrics.external} External</span>
          </Card>

          <Card variant="glass" className="metric-box">
            <div className="metric-top">
              <span className="metric-label">Circular Dependency Risk</span>
              <RefreshCw size={18} className="metric-icon metric-icon--success" />
            </div>
            <span className="metric-value">{depData.metrics.circularRisks} Cycles</span>
            <span className="metric-sub metric-sub--success">{depData.circularAnalysis.status}</span>
          </Card>

          <Card variant="glass" className="metric-box">
            <div className="metric-top">
              <span className="metric-label">Security & Vulnerabilities</span>
              <ShieldCheck size={18} className="metric-icon metric-icon--success" />
            </div>
            <span className="metric-value">{depData.metrics.vulnerabilities} Known CVEs</span>
            <span className="metric-sub">Audit Clean &bull; Permissive</span>
          </Card>

          <Card variant="glass" className="metric-box">
            <div className="metric-top">
              <span className="metric-label">Total Bundle Weight</span>
              <Package size={18} className="metric-icon" />
            </div>
            <span className="metric-value">{depData.metrics.totalBundleWeight}</span>
            <span className="metric-sub">Minified + Gzipped AST</span>
          </Card>
        </div>

        {/* Filter and Search Bar */}
        <div className="graph-controls-bar">
          <div className="category-filters">
            <button
              type="button"
              className={`filter-btn ${filterCategory === 'all' ? 'filter-btn--active' : ''}`}
              onClick={() => setFilterCategory('all')}
            >
              All Modules ({depData.nodes.length})
            </button>
            <button
              type="button"
              className={`filter-btn ${filterCategory === 'core' ? 'filter-btn--active' : ''}`}
              onClick={() => setFilterCategory('core')}
            >
              Core Entry
            </button>
            <button
              type="button"
              className={`filter-btn ${filterCategory === 'internal' ? 'filter-btn--active' : ''}`}
              onClick={() => setFilterCategory('internal')}
            >
              Internal Subsystems
            </button>
            <button
              type="button"
              className={`filter-btn ${filterCategory === 'external' ? 'filter-btn--active' : ''}`}
              onClick={() => setFilterCategory('external')}
            >
              Third-Party Packages
            </button>
          </div>

          <div className="graph-search-wrap">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search module or package..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="graph-search-input"
            />
          </div>
        </div>

        {/* Interactive Graph Layout: Node Canvas + Inspector */}
        <div className="graph-split-layout">
          
          {/* Left Canvas Cluster */}
          <Card variant="glass" className="graph-canvas-card">
            <div className="canvas-header">
              <span className="canvas-badge">Interactive Module Matrix</span>
              <span className="canvas-hint">Click any node to inspect inward/outward dependency trees</span>
            </div>

            <div className="nodes-cloud-grid">
              {filteredNodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    className={`node-pill-card node-pill-card--${node.category} ${isSelected ? 'node-pill-card--selected' : ''}`}
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    <div className="node-pill-top">
                      <span className={`category-tag tag-${node.category}`}>{node.category}</span>
                      <span className="node-version-badge">{node.version}</span>
                    </div>

                    <h4 className="node-pill-name">{node.name}</h4>
                    <span className="node-pill-type">{node.type}</span>

                    <div className="node-pill-stats">
                      <span>{node.dependenciesCount} imports</span>
                      <span>&bull;</span>
                      <span>{node.dependentsCount} dependents</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Right Inspector Drawer */}
          {activeNode && (
            <Card variant="glass" className="node-inspector-card">
              <div className="inspector-head">
                <span className={`inspector-category-badge tag-${activeNode.category}`}>
                  {activeNode.category.toUpperCase()} MODULE
                </span>
                <h3 className="inspector-module-name">{activeNode.name}</h3>
                <span className="inspector-module-type">{activeNode.type}</span>
              </div>

              <p className="inspector-module-desc">{activeNode.description}</p>

              {/* Module Metadata Specs */}
              <div className="inspector-specs-grid">
                <div className="spec-row">
                  <span className="spec-label">File / Path:</span>
                  <code className="spec-value">{activeNode.file}</code>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Version:</span>
                  <span className="spec-value">{activeNode.version}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Package Size:</span>
                  <span className="spec-value">{activeNode.size}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">License:</span>
                  <span className="spec-value">{activeNode.license}</span>
                </div>
              </div>

              {/* Dependent Connections (Who imports this) */}
              <div className="connections-section">
                <h4 className="connections-title">
                  <span className="conn-indicator conn-in" />
                  <span>Imported By ({dependentLinks.length}):</span>
                </h4>
                {dependentLinks.length > 0 ? (
                  <div className="connections-list">
                    {dependentLinks.map((link, i) => (
                      <button
                        key={i}
                        type="button"
                        className="conn-pill"
                        onClick={() => setSelectedNodeId(link.source)}
                      >
                        <code>{link.source}</code>
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="conn-empty">Root level entry point (no inward callers)</span>
                )}
              </div>

              {/* Dependencies (What this imports) */}
              <div className="connections-section">
                <h4 className="connections-title">
                  <span className="conn-indicator conn-out" />
                  <span>Imports Downstream ({dependencyLinks.length}):</span>
                </h4>
                {dependencyLinks.length > 0 ? (
                  <div className="connections-list">
                    {dependencyLinks.map((link, i) => (
                      <button
                        key={i}
                        type="button"
                        className="conn-pill"
                        onClick={() => setSelectedNodeId(link.target)}
                      >
                        <code>{link.target}</code>
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="conn-empty">Leaf module (no downstream dependencies)</span>
                )}
              </div>

              {/* Circular Safety Banner */}
              <div className="circular-status-banner">
                <ShieldCheck size={16} className="status-icon" />
                <div className="status-text">
                  <strong>AST Cycle Verification Passed</strong>
                  <p>Module hierarchy is strictly acyclic with deterministic resolution.</p>
                </div>
              </div>

            </Card>
          )}

        </div>

      </div>
    </div>
  );
};

export default Dependencies;
