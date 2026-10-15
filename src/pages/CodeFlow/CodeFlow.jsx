import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card/Card';
import { Badge } from '../../components/common/Badge/Badge';
import { Button } from '../../components/common/Button/Button';
import { getRepoFlows } from '../../services/githubService';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Copy, 
  FileCode2, 
  Activity, 
  Layers,
  Sparkles
} from 'lucide-react';
import './CodeFlow.css';

export const CodeFlow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target') || 'expressjs/express';

  const flows = useMemo(() => getRepoFlows(target), [target]);
  const [activeFlowId, setActiveFlowId] = useState(() => flows[0]?.id || 'auth-flow');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentFlow = flows.find(f => f.id === activeFlowId) || flows[0];
  const steps = currentFlow?.steps || [];
  const currentStep = steps[currentStepIndex] || steps[0];

  // Auto-play timer
  useEffect(() => {
    let timer;
    if (isPlaying && steps.length > 0) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="codeflow-page">
      <div className="codeflow-container">
        
        {/* Navigation Bar */}
        <div className="codeflow-nav">
          <Link to={`/dashboard?target=${encodeURIComponent(target)}`} className="back-link">
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </Link>

          <div className="codeflow-nav-actions">
            <Button
              variant="outline"
              size="sm"
              icon={<Sparkles size={14} />}
              onClick={() => navigate(`/chat?target=${encodeURIComponent(target)}`)}
            >
              Ask AI About This Flow
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="codeflow-header">
          <Badge variant="teal" dot>
            Interactive Execution Flow & Sequence Tracer
          </Badge>
          <h1 className="codeflow-title">
            Tracing <span className="gradient-text">{target}</span> Code Paths
          </h1>
          <p className="codeflow-subtitle">
            Step through end-to-end execution paths across frontend boundaries, middleware routing layers, controller logic, and persistence pipelines.
          </p>
        </div>

        {/* Flow Selector Pills */}
        <div className="flows-selector-bar">
          <span className="flows-label">
            <Layers size={15} />
            <span>Select Feature Flow:</span>
          </span>
          <div className="flows-pill-group">
            {flows.map(f => (
              <button
                key={f.id}
                type="button"
                className={`flow-tab-pill ${activeFlowId === f.id ? 'flow-tab-pill--active' : ''}`}
                onClick={() => {
                  setActiveFlowId(f.id);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
              >
                <span>{f.name}</span>
                <span className="pill-duration">{f.duration}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Flow Stage Canvas */}
        {currentFlow && (
          <Card variant="glass" className="flow-canvas-card">
            
            {/* Top Toolbar */}
            <div className="flow-canvas-toolbar">
              <div className="flow-info-col">
                <span className="flow-badge-category">{currentFlow.category}</span>
                <h3 className="flow-active-name">{currentFlow.name}</h3>
                <p className="flow-active-desc">{currentFlow.description}</p>
              </div>

              {/* Playback Controls */}
              <div className="playback-controls">
                <button 
                  type="button" 
                  className="ctrl-btn" 
                  onClick={handleReset} 
                  title="Reset to Step 1"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  type="button" 
                  className="ctrl-btn" 
                  onClick={handlePrev} 
                  disabled={currentStepIndex === 0}
                  title="Previous Step"
                >
                  <ChevronLeft size={18} />
                </button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  icon={isPlaying ? <Pause size={15} /> : <Play size={15} />}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? 'Pause' : 'Play Flow'}
                </Button>
                <button 
                  type="button" 
                  className="ctrl-btn" 
                  onClick={handleNext} 
                  disabled={currentStepIndex === steps.length - 1}
                  title="Next Step"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Stepper Timeline Visualizer */}
            <div className="timeline-nodes-track">
              {steps.map((step, idx) => {
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <React.Fragment key={step.id}>
                    <button
                      type="button"
                      className={`timeline-node ${isCurrent ? 'timeline-node--current' : ''} ${isPassed ? 'timeline-node--passed' : ''}`}
                      onClick={() => {
                        setCurrentStepIndex(idx);
                        setIsPlaying(false);
                      }}
                    >
                      <div className="node-step-badge">Step {idx + 1}</div>
                      <div className="node-actor-name">{step.actor}</div>
                      <div className="node-step-title">{step.name}</div>
                      <div className="node-type-chip">{step.type}</div>
                    </button>

                    {idx < steps.length - 1 && (
                      <div className={`timeline-connector ${isPassed ? 'timeline-connector--active' : ''}`}>
                        <div className="connector-pulse-bar" />
                        <span className="connector-arrow-head">➔</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Active Step Deep Inspector */}
            {currentStep && (
              <div className="step-deep-inspector">
                
                <div className="step-meta-panel">
                  <div className="step-heading-wrap">
                    <span className="step-index-tag">Step {currentStepIndex + 1} of {steps.length}</span>
                    <h4 className="step-detail-title">{currentStep.name}</h4>
                    <p className="step-detail-desc">{currentStep.detail}</p>
                  </div>

                  {/* Wire Payload Inspector */}
                  <div className="payload-box">
                    <div className="payload-header">
                      <Activity size={14} className="payload-icon" />
                      <span>Transmitted Wire Payload & Context</span>
                    </div>
                    <pre className="payload-content">
                      <code>{JSON.stringify(currentStep.payload, null, 2)}</code>
                    </pre>
                  </div>
                </div>

                {/* Code Window Panel */}
                <div className="step-code-panel">
                  <div className="code-window-bar">
                    <div className="file-info-col">
                      <FileCode2 size={15} className="code-file-icon" />
                      <span className="file-name-text">{currentStep.file}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      icon={<Copy size={13} />}
                      onClick={() => handleCopyCode(currentStep.code)}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <pre className="code-viewer-content">
                    <code>{currentStep.code}</code>
                  </pre>
                </div>

              </div>
            )}

          </Card>
        )}

      </div>
    </div>
  );
};

export default CodeFlow;
