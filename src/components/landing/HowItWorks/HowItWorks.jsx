import React from 'react';
import { Card } from '../../common/Card/Card';
import { Badge } from '../../common/Badge/Badge';
import { GitBranch, Cpu, Network, Compass } from 'lucide-react';
import './HowItWorks.css';

export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Connect Repository',
      description: 'Enter any public GitHub URL or username. No tokens or authentication required for public repositories.',
      icon: <GitBranch size={22} />
    },
    {
      number: '02',
      title: 'Analyze Codebase',
      description: 'AST engines deterministically parse file imports, exports, functions, routes, database schemas, and components.',
      icon: <Cpu size={22} />
    },
    {
      number: '03',
      title: 'Understand Architecture',
      description: 'Reconstruct high-level component topologies, service relationships, and full-stack communication pipelines.',
      icon: <Network size={22} />
    },
    {
      number: '04',
      title: 'Explore Project Flow',
      description: 'Interact with visual diagrams, trace function call trees, inspect REST endpoints, and review code side-by-side.',
      icon: <Compass size={22} />
    }
  ];

  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="how-container">
        
        <div className="how-header">
          <Badge variant="teal">Developer Workflow</Badge>
          <h2 className="how-title">How It Works</h2>
          <p className="how-subtitle">
            From raw repository to interactive architecture in four transparent stages.
          </p>
        </div>

        <div className="how-grid">
          {steps.map((step) => (
            <Card key={step.number} variant="default" hoverable className="how-step-card">
              <div className="step-card-header">
                <span className="step-card-number">{step.number}</span>
                <div className="step-card-icon">{step.icon}</div>
              </div>
              <h3 className="step-card-title">{step.title}</h3>
              <p className="step-card-desc">{step.description}</p>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
