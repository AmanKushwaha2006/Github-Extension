import React from 'react';
import { Card } from '../../common/Card/Card';
import { Badge } from '../../common/Badge/Badge';
import { 
  Network, 
  Layers, 
  GitMerge, 
  Globe2, 
  Boxes, 
  Sparkles 
} from 'lucide-react';
import './Features.css';

export const Features = () => {
  const featuresList = [
    {
      id: 'architecture',
      title: 'Architecture Visualization',
      description: 'Automatically constructs interactive component hierarchies and service topologies on a zoomable, pannable graph canvas.',
      icon: <Network size={24} />,
      tag: 'Interactive Graph'
    },
    {
      id: 'feature-explorer',
      title: 'Feature Explorer',
      description: 'Reverse-engineers what an unfamiliar codebase does, grouping implementation files and modules by actual business features.',
      icon: <Layers size={24} />,
      tag: 'Feature Flow'
    },
    {
      id: 'code-flow',
      title: 'Code Flow',
      description: 'Traces execution paths, function invocations, state updates, and props across complex frontend and backend boundaries.',
      icon: <GitMerge size={24} />,
      tag: 'Trace Engine'
    },
    {
      id: 'api-mapping',
      title: 'API Mapping',
      description: 'Discovers and maps all HTTP endpoints, routes, methods (GET, POST, PUT, DELETE), parameters, and handler functions.',
      icon: <Globe2 size={24} />,
      tag: 'Route Discovery'
    },
    {
      id: 'dependency-graph',
      title: 'Dependency Graph',
      description: 'Visualizes internal module relationships and third-party package dependencies to identify architectural circularities or bloat.',
      icon: <Boxes size={24} />,
      tag: 'Module Graph'
    },
    {
      id: 'ai-explanation',
      title: 'AI Code Explanation',
      description: 'Provides contextual, natural-language walkthroughs of complex routines, state machines, and data schemas.',
      icon: <Sparkles size={24} />,
      tag: 'Smart Context'
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        
        <div className="features-header">
          <Badge variant="teal">Capabilities</Badge>
          <h2 className="features-title">Core Intelligence Features</h2>
          <p className="features-subtitle">
            Essential visual tools designed for developers navigating unfamiliar codebases.
          </p>
        </div>

        <div className="features-grid">
          {featuresList.map((item) => (
            <Card key={item.id} variant="default" hoverable className="feature-card">
              <div className="feature-card-top">
                <div className="feature-icon-wrapper">
                  {item.icon}
                </div>
                <span className="feature-tag">{item.tag}</span>
              </div>
              <h3 className="feature-card-title">{item.title}</h3>
              <p className="feature-card-desc">{item.description}</p>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
