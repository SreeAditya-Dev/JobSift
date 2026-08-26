'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Application, ApplicationStatus } from '@/types';
import { applicationsApi } from '@/lib/api';
import {
  Columns3, Briefcase, MapPin, DollarSign, Calendar,
  CheckCircle2, ArrowRight, ArrowLeft, Bot, MoreVertical,
  Plus, Sparkles, MessageSquare, AlertCircle
} from 'lucide-react';

interface KanbanBoardProps {
  applications: Application[];
  onRefresh: () => void;
}

const COLUMNS: { id: ApplicationStatus; title: string; color: string }[] = [
  { id: 'bookmarked', title: 'Bookmarked', color: 'border-stone-400/40 bg-stone-500/5 text-stone-600 dark:text-stone-300' },
  { id: 'applied', title: 'Applied', color: 'border-blue-500/40 bg-blue-500/5 text-blue-600 dark:text-blue-400' },
  { id: 'screening', title: 'Recruiter Screen', color: 'border-purple-500/40 bg-purple-500/5 text-purple-600 dark:text-purple-400' },
  { id: 'interview', title: 'Tech / Onsite', color: 'border-amber-500/40 bg-amber-500/5 text-amber-600 dark:text-amber-400' },
  { id: 'offer', title: 'Offer Extended 🎉', color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' },
  { id: 'rejected', title: 'Archived', color: 'border-rose-500/40 bg-rose-500/5 text-rose-600 dark:text-rose-400' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ applications, onRefresh }) => {
  const router = useRouter();
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [notesText, setNotesText] = useState('');

  const moveApplicationStatus = async (appId: number, nextStatus: ApplicationStatus) => {
    try {
      await applicationsApi.updateStatus(appId, { status: nextStatus });
      onRefresh();
    } catch {
      onRefresh();
    }
  };

  const saveNotes = async (appId: number) => {
    try {
      await applicationsApi.updateStatus(appId, { status: 'applied', candidate_notes: notesText });
      setEditingNotesId(null);
      onRefresh();
    } catch {
      setEditingNotesId(null);
    }
  };

  const getNextStatus = (current: ApplicationStatus): ApplicationStatus | null => {
    const sequence: ApplicationStatus[] = ['bookmarked', 'applied', 'screening', 'interview', 'offer'];
    const idx = sequence.indexOf(current);
    if (idx >= 0 && idx < sequence.length - 1) return sequence[idx + 1];
    return null;
  };

  const getPrevStatus = (current: ApplicationStatus): ApplicationStatus | null => {
    const sequence: ApplicationStatus[] = ['bookmarked', 'applied', 'screening', 'interview', 'offer'];
    const idx = sequence.indexOf(current);
    if (idx > 0) return sequence[idx - 1];
    return null;
  };

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="flex gap-4 min-w-[1200px]">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);

          return (
            <div
              key={col.id}
              className="w-80 shrink-0 rounded-2xl bg-card border border-border flex flex-col max-h-[78vh]"
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-border flex items-center justify-between bg-muted/20 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color.split(' ')[0].replace('border-', 'bg-')}`} />
                  <span className="font-bold text-xs text-foreground uppercase tracking-wide">
                    {col.title}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-muted text-foreground">
                  {colApps.length}
                </span>
              </div>

              {/* Column Cards Container */}
              <div className="p-3 space-y-3 overflow-y-auto flex-1">
                {colApps.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-border/80 text-center text-xs text-muted-foreground/60">
                    No applications in this stage
                  </div>
                ) : (
                  colApps.map((app) => {
                    const nextSt = getNextStatus(app.status);
                    const prevSt = getPrevStatus(app.status);

                    return (
                      <div
                        key={app.id}
                        className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all space-y-3"
                      >
                        {/* Company & Role */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
                              {app.job?.company || 'Company'}
                            </span>
                            <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-1">
                              {app.job?.title || 'Software Role'}
                            </h4>
                          </div>

                          {app.match_score && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                              {app.match_score}% Fit
                            </span>
                          )}
                        </div>

                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                          {app.job?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {app.job.location}
                            </span>
                          )}
                          {app.salary_offered ? (
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                              Offer: ${(app.salary_offered / 1000).toFixed(0)}k/yr
                            </span>
                          ) : null}
                        </div>

                        {/* Interview Date Badge */}
                        {app.interview_date && (
                          <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[11px] font-semibold flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Round Scheduled:</span>
                            </span>
                            <span>{new Date(app.interview_date).toLocaleDateString()}</span>
                          </div>
                        )}

                        {/* Candidate Notes */}
                        {editingNotesId === app.id ? (
                          <div className="space-y-1.5 pt-1">
                            <textarea
                              rows={2}
                              value={notesText}
                              onChange={(e) => setNotesText(e.target.value)}
                              className="w-full p-2 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
                            />
                            <div className="flex justify-end gap-1 text-[10px]">
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="px-2 py-0.5 text-muted-foreground cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => saveNotes(app.id)}
                                className="px-2.5 py-0.5 bg-primary text-primary-foreground font-bold rounded cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingNotesId(app.id);
                              setNotesText(app.candidate_notes || '');
                            }}
                            className="p-2 rounded-lg bg-muted/40 hover:bg-muted text-[11px] text-muted-foreground cursor-pointer transition-colors"
                            title="Click to edit notes"
                          >
                            <span className="font-medium text-foreground">Notes: </span>
                            <span>{app.candidate_notes || 'Click to add notes, interviewer names, or next steps...'}</span>
                          </div>
                        )}

                        {/* AI Mock Interview Quick Launcher for this Application */}
                        <div className="pt-2 border-t border-border flex items-center justify-between gap-1 text-xs">
                          <button
                            onClick={() =>
                              router.push(
                                `/ai-copilot?tab=interview&jobTitle=${encodeURIComponent(
                                  app.job?.title || ''
                                )}&company=${encodeURIComponent(app.job?.company || '')}`
                              )
                            }
                            className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Bot className="w-3 h-3" />
                            <span>AI Mock Prep</span>
                          </button>

                          {/* Stage Transition Controls */}
                          <div className="flex items-center gap-1">
                            {prevSt && (
                              <button
                                onClick={() => moveApplicationStatus(app.id, prevSt)}
                                className="p-1 rounded bg-muted hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
                                title={`Move back to ${prevSt}`}
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {nextSt && (
                              <button
                                onClick={() => moveApplicationStatus(app.id, nextSt)}
                                className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold flex items-center gap-0.5 hover:opacity-90 cursor-pointer"
                                title={`Advance to ${nextSt}`}
                              >
                                <span>Advance</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
