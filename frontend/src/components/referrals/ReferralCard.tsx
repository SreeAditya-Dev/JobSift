'use client';

import React from 'react';
import { ReferralListing } from '@/types';
import { Award, ShieldCheck, UserCheck, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ReferralCardProps {
  listing: ReferralListing;
  onRequest: (listing: ReferralListing) => void;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({ listing, onRequest }) => {
  return (
    <div className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      <div>
        {/* Header with Company & Employee */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-muted border border-border p-1 flex items-center justify-center shrink-0">
              {listing.company_logo ? (
                <img src={listing.company_logo} alt={listing.company} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Briefcase className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-foreground">{listing.company}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-xs text-primary font-medium">{listing.role_category}</span>
            </div>
          </div>

          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Active Listing
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {listing.description}
        </p>

        {/* Requirements snippet */}
        {listing.requirements_summary && (
          <div className="mt-3 p-2.5 rounded-xl bg-muted/40 border border-border text-[11px] text-foreground">
            <strong className="text-primary font-semibold">Requirements: </strong>
            <span className="text-muted-foreground">{listing.requirements_summary}</span>
          </div>
        )}
      </div>

      {/* Footer Meta & Request Trigger */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <img
            src={listing.employee_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={listing.employee_name || 'Employee'}
            className="w-7 h-7 rounded-full object-cover border border-border"
          />
          <div>
            <div className="text-xs font-bold text-foreground line-clamp-1">{listing.employee_name}</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              {listing.successful_referrals} referred
            </div>
          </div>
        </div>

        <button
          onClick={() => onRequest(listing)}
          className="px-3.5 py-1.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Request Referral</span>
        </button>
      </div>
    </div>
  );
};
