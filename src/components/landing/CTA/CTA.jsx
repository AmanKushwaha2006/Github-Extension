import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../common/Button/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import './CTA.css';

export const CTA = () => {
  const navigate = useNavigate();

  const handleCtaClick = () => {
    // Navigate to /repository route or scroll to top search
    navigate('/repository');
  };

  return (
    <section className="landing-cta-section">
      <div className="landing-cta-box">
        <div className="cta-sparkle-icon">
          <Sparkles size={28} />
        </div>
        <h2 className="cta-headline">Ready to understand your next codebase?</h2>
        <p className="cta-subtext">
          Start exploring architecture graphs, tracing code execution, and inspecting APIs in seconds.
        </p>
        <Button 
          variant="primary" 
          size="lg" 
          icon={<ArrowRight size={18} />}
          onClick={handleCtaClick}
        >
          Analyze Repository
        </Button>
      </div>
    </section>
  );
};

export default CTA;
