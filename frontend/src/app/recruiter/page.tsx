'use client';

import React from 'react';
import { RecruiterDashboard } from '@/components/recruiter/RecruiterDashboard';
import { Briefcase, Sparkles } from 'lucide-react';

export default function RecruiterPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" /> Employer & Talent Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Recruiter Command Center
          </h1>
        </div>
      </div>

      <RecruiterDashboard />
    </div>
  );
}
