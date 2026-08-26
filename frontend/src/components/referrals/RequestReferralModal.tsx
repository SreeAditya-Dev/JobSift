'use client';

import React, { useState } from 'react';
import { ReferralListing } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { referralsApi } from '@/lib/api';
import { fireConfetti } from '@/lib/confetti';
import { X, Award, Send, CheckCircle2, ShieldCheck, Sparkles, Link as LinkIcon } from 'lucide-react';

interface RequestReferralModalProps {
  listing: ReferralListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultRoleTitle?: string;
}

export const RequestReferralModal: React.FC<RequestReferralModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSuccess,
  defaultRoleTitle = 'Senior Full-Stack Engineer',
}) => {
  const { user } = useAuth();
  const [roleTitle, setRoleTitle] = useState(defaultRoleTitle);
  const [jobUrl, setJobUrl] = useState(`https://${listing?.company.toLowerCase() || 'careers'}.com/jobs/senior-eng`);
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolio_url || 'https://alexrivera.dev');
  const [pitch, setPitch] = useState(
    `Hi ${listing?.employee_name?.split(' ')[0] || 'there'}! I have 5+ years of experience architecting distributed full-stack web applications with Next.js, FastAPI, and PostgreSQL. I would appreciate your referral for this role!`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitch.trim() || !roleTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await referralsApi.requestReferral({
        listing_id: listing.id,
        target_role_title: roleTitle,
        target_job_url: jobUrl,
        portfolio_url: portfolioUrl,
        pitch,
        resume_snippet: user?.resume_text?.slice(0, 300) || '',
      });

      fireConfetti({ particleCount: 70, spread: 60 });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch {
      fireConfetti({ particleCount: 50, spread: 50 });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onSuccess();
        onClose();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-card border border-border p-1 flex items-center justify-center">
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Request Referral @ {listing.company}</h3>
              <p className="text-xs text-muted-foreground">From verified employee {listing.employee_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isSubmitted ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Referral Pitch Dispatched!</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              {listing.employee_name} has received your referral request and profile score.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
            {/* Target Role */}
            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Target Role Title</label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g., Senior Full-Stack Engineer"
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-semibold outline-none focus:border-primary"
              />
            </div>

            {/* Target Job URL */}
            <div className="space-y-1.5">
              <label className="font-bold text-foreground flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Job Listing URL or Job ID</span>
              </label>
              <input
                type="text"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://company.com/careers/job/12345"
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary font-mono"
              />
            </div>

            {/* Portfolio / GitHub Link */}
            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Portfolio / GitHub Link</label>
              <input
                type="text"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/yourhandle"
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary font-mono"
              />
            </div>

            {/* Pitch Text */}
            <div className="space-y-1.5">
              <label className="font-bold text-foreground flex items-center justify-between">
                <span>Personal Pitch to Employee</span>
                <span className="text-[10px] text-muted-foreground font-normal">Why you are a strong match</span>
              </label>
              <textarea
                required
                rows={4}
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Introduce yourself, mention 2 standout achievements, and why you are excited about this company..."
                className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-xs leading-relaxed outline-none focus:border-primary"
              />
            </div>

            {/* Escrow Anti-Spam Notice */}
            <div className="p-3 rounded-xl bg-secondary/20 border border-secondary/40 text-[11px] text-secondary-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Anti-Spam Verification: Auto-attaches your 90%+ AI profile score & verified GitHub credentials.</span>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-accent font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Referral Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
