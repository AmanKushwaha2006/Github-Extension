import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { Landing } from '../pages/Landing/Landing';
import { Repository } from '../pages/Repository/Repository';
import { Analysis } from '../pages/Analysis/Analysis';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { CodeFlow } from '../pages/CodeFlow/CodeFlow';
import { CodeChat } from '../pages/CodeChat/CodeChat';
import { Dependencies } from '../pages/Dependencies/Dependencies';
import { ImpactAnalysis } from '../pages/ImpactAnalysis/ImpactAnalysis';
import { ExtensionPopup } from '../pages/ExtensionPopup/ExtensionPopup';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Extension Popup View (standalone without full layout) */}
      <Route path="/popup" element={<ExtensionPopup />} />

      {/* Main Suite with Public Layout */}
      <Route 
        path="*" 
        element={
          <PublicLayout>
            <Routes>
              {/* Landing Overview */}
              <Route path="/" element={<Landing />} />

              {/* Phase 2: Repository Input & Selection */}
              <Route path="/repository" element={<Repository />} />

              {/* Phase 3: Repository Analysis Pipeline */}
              <Route path="/analysis" element={<Analysis />} />

              {/* Phase 4: Codebase Intelligence Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Phase 5: Interactive Code Flow & Sequence Tracer */}
              <Route path="/flow" element={<CodeFlow />} />

              {/* Phase 6: AI Codebase Copilot & Assistant */}
              <Route path="/chat" element={<CodeChat />} />

              {/* Phase 7: Dependency Graph & Module Ecosystem */}
              <Route path="/dependencies" element={<Dependencies />} />

              {/* Phase 8: PR & Architectural Impact Analysis */}
              <Route path="/impact" element={<ImpactAnalysis />} />

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PublicLayout>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
