'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, UserCheck, Briefcase, Users } from 'lucide-react';

export const PersonaBanner: React.FC = () => {
  const { user, switchPersona, isLoading } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-[#644a40] via-[#503a31] to-[#3a2923] text-white text-xs py-1.5 px-4 shadow-sm relative z-40 border-b border-[#7d5d51]/40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-secondary flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 inline" /> Evaluator Fast-Switch:
          </span>
          <span className="text-stone-200 hidden sm:inline">
            Active persona: <strong className="text-white font-medium">{user.full_name}</strong> ({user.role.toUpperCase()}{user.company ? ` @ ${user.company}` : ''})
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-stone-300 hidden md:inline text-[11px]">Switch persona:</span>
          
          <button
            onClick={() => switchPersona('candidate')}
            disabled={isLoading || user.role === 'candidate'}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
              user.role === 'candidate'
                ? 'bg-secondary text-secondary-foreground shadow-xs font-semibold'
                : 'bg-white/10 hover:bg-white/20 text-stone-200'
            }`}
          >
            <UserCheck className="w-3 h-3" /> Candidate (Alex)
          </button>

          <button
            onClick={() => switchPersona('recruiter')}
            disabled={isLoading || user.role === 'recruiter'}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
              user.role === 'recruiter'
                ? 'bg-secondary text-secondary-foreground shadow-xs font-semibold'
                : 'bg-white/10 hover:bg-white/20 text-stone-200'
            }`}
          >
            <Briefcase className="w-3 h-3" /> Recruiter (Sarah @ Stripe)
          </button>

          <button
            onClick={() => switchPersona('employee')}
            disabled={isLoading || user.role === 'employee'}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
              user.role === 'employee'
                ? 'bg-secondary text-secondary-foreground shadow-xs font-semibold'
                : 'bg-white/10 hover:bg-white/20 text-stone-200'
            }`}
          >
            <Users className="w-3 h-3" /> Referrer (David @ Google)
          </button>
        </div>
      </div>
    </div>
  );
};
