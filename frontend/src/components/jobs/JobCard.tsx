'use client';

import React from 'react';
import { Job } from '@/types';
import {
  Briefcase, MapPin, DollarSign, Bookmark, BookmarkCheck,
  Award, Sparkles, ArrowRight, ShieldCheck, Clock
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  isSelected?: boolean;
  onSelect: (job: Job) => void;
  onToggleSave?: (jobId: number) => void;
  onQuickApply?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSelected = false,
  onSelect,
  onToggleSave,
  onQuickApply,
}) => {
  const formatSalary = (min: number, max: number, currency: string) => {
    if (!min && !max) return 'Competitive Salary';
    const minK = min ? `${(min / 1000).toFixed(0)}k` : '';
    const maxK = max ? `${(max / 1000).toFixed(0)}k` : '';
    if (minK && maxK) return `$${minK} - $${maxK} ${currency}`;
    return `$${maxK || minK} ${currency}`;
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-muted text-muted-foreground';
    if (score >= 90) return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    if (score >= 75) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
  };

  return (
    <div
      onClick={() => onSelect(job)}
      className={`group relative p-5 rounded-xl border transition-all cursor-pointer bg-card hover:shadow-md ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20 shadow-md'
          : 'border-border hover:border-primary/40'
      }`}
    >
      {/* Featured Pill */}
      {job.is_featured && (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-secondary text-secondary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs border border-amber-300/40 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> FEATURED
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-muted border border-border/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            {job.company_logo ? (
              <img src={job.company_logo} alt={job.company} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Briefcase className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {job.company}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 inline" />
            </div>
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {job.title}
            </h3>
          </div>
        </div>

        {/* Bookmark Button */}
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job.id);
            }}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors cursor-pointer"
            aria-label="Bookmark Job"
          >
            {job.is_saved ? (
              <BookmarkCheck className="w-4 h-4 text-primary fill-primary" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Badges & Meta */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-foreground font-medium">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          {job.location} ({job.workplace_type})
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-foreground font-medium">
          <DollarSign className="w-3 h-3 text-emerald-600" />
          {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium">
          {job.experience_level}
        </span>
      </div>

      {/* Tech Stack Pills */}
      {job.tech_stack && job.tech_stack.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {job.tech_stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[11px] px-2 py-0.5 rounded-md bg-accent/60 text-foreground border border-border/50 font-mono"
            >
              {tech}
            </span>
          ))}
          {job.tech_stack.length > 4 && (
            <span className="text-[10px] text-muted-foreground">+{job.tech_stack.length - 4} more</span>
          )}
        </div>
      )}

      {/* Bottom Features: AI Fit + Referral Badge */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {/* AI Match Badge */}
          {job.ai_match_score ? (
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getScoreColor(job.ai_match_score)}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{job.ai_match_score}% AI Match</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Match Available
            </div>
          )}

          {/* Referral Available Tag */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <Award className="w-3.5 h-3.5" />
            <span>Referrals Active</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-primary text-xs font-semibold group-hover:translate-x-0.5 transition-transform">
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
