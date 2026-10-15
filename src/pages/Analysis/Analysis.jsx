import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../../components/common/Card/Card';
import { Badge } from '../../components/common/Badge/Badge';
import { Button } from '../../components/common/Button/Button';
import { analyzeRepository } from '../../services/githubService';
import { 
  CheckCircle2, 
  Terminal, 
  ArrowRight, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import './Analysis.css';

export const Analysis = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target') || 'expressjs/express';
  const depth = searchParams.get('depth') || 'deep';

  const [progress, setProgress] = useState(12);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);

  const stages = [
    { title: 'Connecting to GitHub API', desc: 'Fetching repository manifest, stars, languages, and commit branch metadata' },
    { title: 'Scanning Tree & Files', desc: 'Recursively parsing file system structures, configurations, and packages' },
    { title: 'Deterministic AST Analysis', desc: 'Parsing module imports, exported symbols, route handlers, and database schemas' },
    { title: 'Synthesizing Architecture Map', desc: 'Generating interactive node graph, full-stack pipeline, and API registry' }
  ];

  useEffect(() => {
    let isMounted = true;

    function addLog(msg) {
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) => [...prev, `[${timestamp}] ${msg}`]);
    }

    async function runAnalysis() {
      try {
        addLog(`[INIT] Starting ${depth.toUpperCase()} analysis for repository: ${target}`);
        setProgress(20);
        setCurrentStepIndex(0);

        // Fetch analysis data from service
        const result = await analyzeRepository(target);

        if (!isMounted) return;

        addLog(`[MANIFEST] Repository found: ${result.data.fullName}`);
        addLog(`[META] Primary language: ${result.data.language} | Stars: ${result.data.stars.toLocaleString()}`);
        setProgress(45);
        setCurrentStepIndex(1);

        setTimeout(() => {
          if (!isMounted) return;
          addLog(`[AST] Parsed ${result.data.fileCount} source files into ${result.data.astNodesCount.toLocaleString()} AST nodes.`);
          addLog(`[MODULES] Discovered ${result.data.architecture.length} primary architectural subsystems.`);
          setProgress(75);
          setCurrentStepIndex(2);

          setTimeout(() => {
            if (!isMounted) return;
            addLog(`[ROUTES] Indexed ${result.data.endpoints.length} active application endpoints and handlers.`);
            addLog(`[SYNTHESIS] Visual graph topology compiled successfully.`);
            setProgress(100);
            setCurrentStepIndex(3);
            setAnalysisResult(result.data);
            setIsCompleted(true);

            // Cache result in sessionStorage for instant retrieval by dashboard
            try {
              sessionStorage.setItem(`analysis_${result.data.fullName}`, JSON.stringify(result.data));
              sessionStorage.setItem('last_active_repo', result.data.fullName);
            } catch {
              // Ignore storage quotas
            }
          }, 800);
        }, 800);

      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to complete codebase analysis.');
        addLog(`[ERROR] ${err.message}`);
      }
    }

    runAnalysis();

    return () => {
      isMounted = false;
    };
  }, [target, depth]);

  const handleOpenDashboard = () => {
    navigate(`/dashboard?target=${encodeURIComponent(target)}`);
  };

  return (
    <div className="analysis-page">
      <div className="analysis-container">
        
        {/* Top Header */}
        <div className="analysis-header">
          <Badge variant="teal" dot>
            Step 2 of 3: Deep AST Analysis Pipeline
          </Badge>
          <h1 className="analysis-title">
            Analyzing <span className="gradient-text">{target}</span>
          </h1>
          <p className="analysis-subtitle">
            Deterministically parsing file structures, dependency imports, API routes, and architectural layers.
          </p>
        </div>

        {/* Progress Bar Component */}
        <div className="progress-section">
          <div className="progress-bar-labels">
            <span className="progress-status-text">
              {isCompleted ? 'Analysis Complete' : stages[currentStepIndex]?.title}
            </span>
            <span className="progress-percent">{progress}%</span>
          </div>
          <div className="progress-track">
            <div 
              className={`progress-fill ${isCompleted ? 'progress-fill--completed' : ''}`} 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        {/* Stage Checkpoints */}
        <div className="stages-grid">
          {stages.map((stage, idx) => {
            const isDone = progress >= ((idx + 1) * 25);
            const isCurrent = currentStepIndex === idx && !isCompleted;

            return (
              <div 
                key={stage.title} 
                className={`stage-card ${isDone ? 'stage-card--done' : ''} ${isCurrent ? 'stage-card--current' : ''}`}
              >
                <div className="stage-icon-wrap">
                  {isDone ? (
                    <CheckCircle2 size={18} className="stage-icon-done" />
                  ) : (
                    <span className="stage-number">{idx + 1}</span>
                  )}
                </div>
                <div className="stage-content">
                  <h4 className="stage-title">{stage.title}</h4>
                  <p className="stage-desc">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Streaming Terminal Log Viewer */}
        <Card variant="glass" className="terminal-card">
          <div className="terminal-bar">
            <div className="terminal-controls">
              <span className="terminal-dot dot-red" />
              <span className="terminal-dot dot-yellow" />
              <span className="terminal-dot dot-green" />
            </div>
            <div className="terminal-title">
              <Terminal size={14} />
              <span>AST Engine Telemetry & Pipeline Output</span>
            </div>
            <div className="terminal-live-badge">
              <span className={`live-pulse-dot ${isCompleted ? 'pulse-green' : 'pulse-amber'}`} />
              <span>{isCompleted ? 'FINISHED' : 'PROCESSING'}</span>
            </div>
          </div>

          <div className="terminal-body">
            {logs.map((log, i) => (
              <div key={i} className="terminal-line">
                <span className="log-prefix">&gt;</span>
                <span className="log-text">{log}</span>
              </div>
            ))}
            {!isCompleted && !error && (
              <div className="terminal-cursor-line">
                <span className="log-prefix">&gt;</span>
                <span className="terminal-cursor" />
              </div>
            )}
          </div>
        </Card>

        {/* Error Card if analysis failed */}
        {error && (
          <div className="analysis-error-banner">
            <AlertCircle size={20} />
            <div className="error-text-content">
              <strong>Analysis Interrupted</strong>
              <p>{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Completion Action Bar */}
        {isCompleted && (
          <div className="completion-action-bar">
            <div className="completion-stats">
              <div className="stat-pill">
                <strong>{analysisResult?.fileCount || 120}</strong>
                <span>Files Mapped</span>
              </div>
              <div className="stat-pill">
                <strong>{analysisResult?.architecture?.length || 4}</strong>
                <span>Subsystems</span>
              </div>
              <div className="stat-pill">
                <strong>{analysisResult?.endpoints?.length || 6}</strong>
                <span>Endpoints</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
              onClick={handleOpenDashboard}
            >
              Explore Intelligence Dashboard
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Analysis;
