'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { applicationsApi } from '@/lib/api';
import { Application } from '@/types';
import { KanbanBoard } from '@/components/tracker/KanbanBoard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useAuth } from '@/context/AuthContext';
import {
  Columns3, Plus, Sparkles, TrendingUp, CheckCircle2,
  Briefcase, ArrowRight, Bot
} from 'lucide-react';

export default function TrackerPage() {
  const router = useRouter();
  const { openAuthModal } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPipeline = async () => {
    setIsLoading(true);
    try {
      const data = await applicationsApi.getMyPipeline();
      if (data && data.length > 0) setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const totalApps = applications.length;
  const activeInterviews = applications.filter((a) => a.status === 'screening' || a.status === 'interview').length;
  const offersReceived = applications.filter((a) => a.status === 'offer').length;

  return (
    <RoleGuard
      allowedRoles={['candidate', 'employee']}
      fallbackTitle="Application Kanban Pipeline"
      fallbackDescription="Track your active job applications, interview stages, offer letters, and follow-ups in an interactive drag-and-drop board."
      onOpenAuth={(role) => openAuthModal('login', role || 'candidate')}
    >
      <div className="space-y-8 animate-in fade-in duration-150">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
              <Columns3 className="w-3.5 h-3.5" /> Pipeline Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              Application Kanban Tracker
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/jobs')}
              className="px-4 py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add from Job Board</span>
            </button>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
            <div className="text-xs text-muted-foreground font-semibold">Total Tracked</div>
            <div className="text-2xl font-black text-foreground">{totalApps}</div>
            <div className="text-[10px] text-muted-foreground">Applications in flight</div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
            <div className="text-xs text-primary font-semibold">Active Interviews</div>
            <div className="text-2xl font-black text-primary">{activeInterviews}</div>
            <div className="text-[10px] text-primary">Phone screens & on-sites</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 shadow-xs">
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">Offers Extended 🎉</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{offersReceived}</div>
            <div className="text-[10px] text-emerald-600">Ready for negotiation</div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
            <div className="text-xs text-secondary-foreground font-semibold">AI Interview Prep</div>
            <div className="text-2xl font-black text-foreground">Ready</div>
            <button
              onClick={() => router.push('/ai-copilot?tab=interview')}
              className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Bot className="w-3 h-3" /> Practice Live →
            </button>
          </div>
        </div>

        {/* Interactive Kanban Board */}
        <KanbanBoard applications={applications} onRefresh={fetchPipeline} />
      </div>
    </RoleGuard>
  );
}
