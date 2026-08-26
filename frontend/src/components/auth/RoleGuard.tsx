'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ShieldCheck, Lock, ArrowRight, UserCheck, Briefcase, Award } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  onOpenAuth?: (role?: UserRole) => void;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallbackTitle,
  fallbackDescription,
  onOpenAuth,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground font-medium">Verifying credentials and role permissions...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-2xl bg-card border border-border shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center ring-8 ring-primary/5">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-foreground">
            {fallbackTitle || 'Authentication Required'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {fallbackDescription || 'Please sign in or create an account to access this section.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onOpenAuth && onOpenAuth(allowedRoles[0])}
            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Sign In / Create Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Role not authorized
  if (!allowedRoles.includes(user.role)) {
    const isRecruiterRequired = allowedRoles.includes('recruiter');
    const isEmployeeRequired = allowedRoles.includes('employee');

    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-2xl bg-card border border-border shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center ring-8 ring-amber-500/5">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-foreground">
            {isRecruiterRequired
              ? 'Recruiter Portal Access Required'
              : isEmployeeRequired
              ? 'Employee / Referrer Verification Required'
              : 'Restricted Access'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {isRecruiterRequired
              ? `You are currently signed in as a ${user.role.toUpperCase()}. This command center is exclusively available for verified hiring managers and talent partners.`
              : isEmployeeRequired
              ? `You are currently signed in as a ${user.role.toUpperCase()}. This area is dedicated to verified company employees managing internal referrals.`
              : 'Your current account does not have permission to view this section.'}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs text-left flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user.full_name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-foreground">{user.full_name}</p>
              <p className="text-[11px] text-muted-foreground">Current Role: <span className="uppercase font-semibold text-primary">{user.role}</span></p>
            </div>
          </div>
          {onOpenAuth && (
            <button
              onClick={() => onOpenAuth(allowedRoles[0])}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 cursor-pointer"
            >
              Switch Role
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
