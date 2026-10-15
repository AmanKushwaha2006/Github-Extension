import React, { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card/Card';
import { Badge } from '../../components/common/Badge/Badge';
import { Button } from '../../components/common/Button/Button';
import { getRepoImpactAnalysis } from '../../services/githubService';
import { 
  ArrowLeft, 
  GitPullRequest, 
  ShieldAlert, 
  FileCode2, 
  Sparkles, 
  Layers, 
  ArrowRight,
  GitBranch,
  Copy,
  Check
} from 'lucide-react';
import './ImpactAnalysis.css';

export const ImpactAnalysis = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target') || sessionStorage.getItem('last_active_repo') || 'expressjs/express';

  const prList = useMemo(() => getRepoImpactAnalysis(target), [target]);
  const [activePrId, setActivePrId] = useState(() => prList[0]?.id || 'pr-142');
  const [copiedFileIndex, setCopiedFileIndex] = useState(null);

  const activePr = prList.find(p => p.id === activePrId) || prList[0];

  const handleCopyDiff = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedFileIndex(index);
    setTimeout(() => setCopiedFileIndex(null), 2000);
  };

  return (
    <div className="impact-page">
      <div className="impact-container">
        
        {/* Navigation Bar */}
        <div className="impact-nav">
          <Link to={`/dashboard?target=${encodeURIComponent(target)}`} className="back-link">
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </Link>

          <div className="impact-nav-actions">
            <Button
              variant="outline"
              size="sm"
              icon={<Sparkles size={14} />}
              onClick={() => navigate(`/chat?target=${encodeURIComponent(target)}`)}
            >
              Ask AI About This PR
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="impact-header">
          <Badge variant="teal" dot>
            Phase 8: Pull Request & Architectural Impact Radar
          </Badge>
          <h1 className="impact-title">
            PR Blast Radius for <span className="gradient-text">{target}</span>
          </h1>
          <p className="impact-subtitle">
            Analyze pull requests and commits to predict subsystem regressions, evaluate blast radius, and detect breaking API changes before merging.
          </p>
        </div>

        {/* PR Selector Pills */}
        <div className="pr-selector-bar">
          <span className="pr-selector-label">
            <GitPullRequest size={15} />
            <span>Select Pull Request to Audit:</span>
          </span>
          <div className="pr-pills-wrap">
            {prList.map(pr => (
              <button
                key={pr.id}
                type="button"
                className={`pr-tab-pill ${activePrId === pr.id ? 'pr-tab-pill--active' : ''}`}
                onClick={() => setActivePrId(pr.id)}
              >
                <span className="pr-number">#{pr.number}</span>
                <span className="pr-pill-title">{pr.title}</span>
                <span className={`pr-risk-tag risk-${pr.riskLevel.toLowerCase()}`}>
                  {pr.riskLevel}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active PR Detail Card */}
        {activePr && (
          <div className="pr-audit-content">
            
            {/* PR Overview Card */}
            <Card variant="glass" className="pr-overview-card">
              <div className="pr-card-header">
                <div className="pr-identity">
                  <div className="pr-icon-wrap">
                    <GitPullRequest size={22} />
                  </div>
                  <div>
                    <div className="pr-meta-row">
                      <span className="pr-badge-number">PR #{activePr.number}</span>
                      <span className="pr-author-tag">by @{activePr.author}</span>
                      <span className="pr-branch-route">
                        <GitBranch size={13} />
                        <code>{activePr.branch}</code>
                        <ArrowRight size={12} />
                        <code>{activePr.targetBranch}</code>
                      </span>
                    </div>
                    <h2 className="pr-main-title">{activePr.title}</h2>
                  </div>
                </div>

                <div className="pr-risk-indicator">
                  <span className="risk-title">Calculated Blast Radius</span>
                  <span className={`risk-status-chip risk-${activePr.riskLevel.toLowerCase()}`}>
                    {activePr.riskLevel} Risk
                  </span>
                </div>
              </div>

              {/* Blast Radius Numbers Grid */}
              <div className="blast-radius-grid">
                <div className="blast-box">
                  <span className="blast-label">Files Modified</span>
                  <strong className="blast-number">{activePr.blastRadius.filesModified}</strong>
                  <span className="blast-sub">Source units</span>
                </div>
                <div className="blast-box">
                  <span className="blast-label">Subsystems Touched</span>
                  <strong className="blast-number">{activePr.blastRadius.subsystemsAffected}</strong>
                  <span className="blast-sub">Architecture layers</span>
                </div>
                <div className="blast-box">
                  <span className="blast-label">Dependent Files at Risk</span>
                  <strong className="blast-number">{activePr.blastRadius.dependentFilesRisk}</strong>
                  <span className="blast-sub">Downstream callers</span>
                </div>
                <div className="blast-box">
                  <span className="blast-label">Breaking API Changes</span>
                  <strong className={`blast-number ${activePr.blastRadius.breakingApiChanges > 0 ? 'text-danger' : 'text-success'}`}>
                    {activePr.blastRadius.breakingApiChanges}
                  </strong>
                  <span className="blast-sub">Public contracts</span>
                </div>
              </div>

              {/* AI Architectural Impact Summary */}
              <div className="ai-impact-banner">
                <div className="ai-banner-head">
                  <Sparkles size={16} className="sparkle-icon" />
                  <strong>AI Architectural Blast-Radius Assessment</strong>
                </div>
                <p className="ai-banner-text">{activePr.aiSummary}</p>
              </div>

              {/* Breaking Changes Warnings if any */}
              {activePr.breakingChanges.length > 0 && (
                <div className="breaking-alert-box">
                  <div className="breaking-alert-title">
                    <ShieldAlert size={18} />
                    <span>Breaking API Changes Detected ({activePr.breakingChanges.length})</span>
                  </div>
                  <div className="breaking-items-list">
                    {activePr.breakingChanges.map((b, i) => (
                      <div key={i} className="breaking-item">
                        <span className="breaking-type-badge">{b.type}</span>
                        <span className="breaking-desc">{b.description}</span>
                        <span className="breaking-sev">{b.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Split View: Subsystems Affected & Modified File Diffs */}
            <div className="pr-details-split">
              
              {/* Left: Subsystems Affected */}
              <Card variant="glass" className="subsystems-impact-card">
                <div className="card-top-heading">
                  <Layers size={16} />
                  <h3>Subsystems Affected ({activePr.affectedSubsystems.length})</h3>
                </div>

                <div className="subsystems-impact-list">
                  {activePr.affectedSubsystems.map((sub, i) => (
                    <div key={i} className="impacted-subsystem-box">
                      <div className="sub-header-row">
                        <h4 className="sub-name">{sub.name}</h4>
                        <span className={`sub-risk-tag risk-${sub.risk.toLowerCase()}`}>
                          {sub.risk} Risk
                        </span>
                      </div>
                      <p className="sub-desc">{sub.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Right: Modified Files & Diff Snippets */}
              <Card variant="glass" className="files-diff-card">
                <div className="card-top-heading">
                  <FileCode2 size={16} />
                  <h3>Modified Files & Architectural Annotations</h3>
                </div>

                <div className="diff-files-list">
                  {activePr.modifiedFiles.map((f, i) => (
                    <div key={i} className="diff-file-card">
                      <div className="diff-file-header">
                        <div className="file-id-col">
                          <span className="file-status-badge">{f.status}</span>
                          <span className="file-name">{f.file}</span>
                        </div>
                        <div className="diff-header-right">
                          <span className="subsystem-annotation-pill">{f.subsystem}</span>
                          <button
                            type="button"
                            className="copy-diff-btn"
                            title="Copy diff snippet"
                            onClick={() => handleCopyDiff(f.diffSnippet, i)}
                          >
                            {copiedFileIndex === i ? (
                              <>
                                <Check size={12} className="text-success" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="diff-code-wrapper">
                        <pre className="diff-code-block">
                          <code>{f.diffSnippet}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ImpactAnalysis;
