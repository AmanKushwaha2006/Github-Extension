import React, { useState } from 'react';
import { Card } from '../../common/Card/Card';
import { Badge } from '../../common/Badge/Badge';
import { 
  LogIn, 
  Globe, 
  Server, 
  Database, 
  LayoutDashboard,
  CheckCircle2,
  FileCode2
} from 'lucide-react';
import './ArchitectureFlow.css';

export const ArchitectureFlow = () => {
  const [activeStep, setActiveStep] = useState('login');

  const steps = [
    {
      id: 'login',
      name: 'Login',
      category: 'Client View',
      file: 'src/components/auth/LoginView.jsx',
      detail: 'Form dispatching onSubmit auth credentials with client validation',
      codeSnippet: `const onSubmit = async (data) => {\n  await api.post('/auth/login', data);\n};`,
      icon: <LogIn size={18} />
    },
    {
      id: 'api',
      name: 'API',
      category: 'HTTP Route',
      file: 'src/routes/auth.routes.js',
      detail: 'REST endpoint POST /auth/login with rate-limiting & validation guard',
      codeSnippet: `router.post('/login', validateAuth, authController.login);`,
      icon: <Globe size={18} />
    },
    {
      id: 'backend',
      name: 'Backend',
      category: 'Controller & Service',
      file: 'src/controllers/auth.controller.js',
      detail: 'Password hashing verification with bcrypt and JWT token generation',
      codeSnippet: `const isValid = await bcrypt.compare(pass, user.hash);\nconst token = jwt.sign({ id: user.id }, SECRET);`,
      icon: <Server size={18} />
    },
    {
      id: 'database',
      name: 'Database',
      category: 'Model / ORM',
      file: 'src/models/user.schema.js',
      detail: 'Database query execution finding indexed user records and roles',
      codeSnippet: `const user = await db.users.findUnique({\n  where: { email }\n});`,
      icon: <Database size={18} />
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      category: 'Authorized UI',
      file: 'src/pages/Dashboard/Dashboard.jsx',
      detail: 'Protected route receiving session payload and loading project state',
      codeSnippet: `const { user, projects } = useSessionDashboard();\nreturn <ProjectGrid projects={projects} />;`,
      icon: <LayoutDashboard size={18} />
    }
  ];

  const currentStep = steps.find(s => s.id === activeStep) || steps[0];

  return (
    <section className="architecture-flow-section" id="preview">
      <div className="flow-container">
        
        <div className="flow-header">
          <Badge variant="teal">Interactive Flow Architecture</Badge>
          <h2 className="flow-title">Visual End-to-End Code Trace</h2>
          <p className="flow-subtitle">
            Click any node below to trace how data travels through the full application stack.
          </p>
        </div>

        <Card variant="glass" className="flow-interactive-card">
          {/* Top Window Bar */}
          <div className="flow-window-bar">
            <div className="window-indicators">
              <span className="window-dot dot-close" />
              <span className="window-dot dot-minimize" />
              <span className="window-dot dot-expand" />
            </div>
            <div className="window-title">
              <FileCode2 size={14} />
              <span>Full-Stack Pipeline: User Journey Flow</span>
            </div>
            <div className="window-badge">
              <Badge variant="success" dot>AST Verified</Badge>
            </div>
          </div>

          {/* Stepper Node Visualizer */}
          <div className="flow-nodes-wrapper">
            {steps.map((step, index) => {
              const isActive = activeStep === step.id;
              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    className={`flow-node-item ${isActive ? 'flow-node-item--active' : ''}`}
                    onClick={() => setActiveStep(step.id)}
                  >
                    <div className="node-category">{step.category}</div>
                    <div className="node-icon-circle">{step.icon}</div>
                    <div className="node-name">{step.name}</div>
                    <div className="node-filename">{step.file.split('/').pop()}</div>
                  </button>

                  {/* Connecting Arrow between nodes */}
                  {index < steps.length - 1 && (
                    <div className="flow-arrow-separator">
                      <div className="arrow-pulse-line">
                        <span className="arrow-pulse-dot" />
                      </div>
                      <span className="arrow-label">➔</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Detailed Inspector Drawer for Active Node */}
          <div className="flow-inspector-panel">
            <div className="inspector-meta-row">
              <div className="inspector-info">
                <span className="inspector-tag">{currentStep.category}</span>
                <h3 className="inspector-name">{currentStep.name} Implementation</h3>
                <p className="inspector-desc">{currentStep.detail}</p>
              </div>
              <div className="inspector-status">
                <div className="verified-chip">
                  <CheckCircle2 size={15} />
                  <span>Deterministic AST Link</span>
                </div>
              </div>
            </div>

            {/* Code Preview */}
            <div className="inspector-code-box">
              <div className="code-box-top">
                <span className="code-filepath">{currentStep.file}</span>
                <span className="code-lang">JavaScript</span>
              </div>
              <pre className="code-content">
                <code>{currentStep.codeSnippet}</code>
              </pre>
            </div>
          </div>

        </Card>

      </div>
    </section>
  );
};

export default ArchitectureFlow;
