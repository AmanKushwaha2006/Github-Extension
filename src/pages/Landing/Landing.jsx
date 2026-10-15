import React from 'react';
import { Hero } from '../../components/landing/Hero/Hero';
import { ArchitectureFlow } from '../../components/landing/ArchitectureFlow/ArchitectureFlow';
import { HowItWorks } from '../../components/landing/HowItWorks/HowItWorks';
import { Features } from '../../components/landing/Features/Features';
import { CTA } from '../../components/landing/CTA/CTA';

export const Landing = () => {
  return (
    <div className="landing-page">
      <Hero />
      <ArchitectureFlow />
      <HowItWorks />
      <Features />
      <CTA />
    </div>
  );
};

export default Landing;
