'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Application, ApplicationStatus } from '@/types';
import { applicationsApi } from '@/lib/api';
import {
  MapPin, Calendar, ArrowRight, ArrowLeft, Sparkles, GripVertical,
} from 'lucide-react';
import {
  Kanban,
  KanbanBoard as KanbanBoardGrid,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from '@/components/reui/kanban';
import { Frame, FrameHeader, FramePanel, FrameTitle } from '@/components/reui/frame';
import { Badge } from '@/components/reui/badge';

interface KanbanBoardProps {
  applications: Application[];
  onRefresh: () => void;
}

const COLUMNS: { id: ApplicationStatus; title: string; dot: string }[] = [
  { id: 'bookmarked', title: 'Bookmarked', dot: 'bg-stone-400' },
  { id: 'applied', title: 'Applied', dot: 'bg-blue-500' },
  { id: 'screening', title: 'Recruiter Screen', dot: 'bg-purple-500' },
  { id: 'interview', title: 'Tech / Onsite', dot: 'bg-amber-500' },
  { id: 'offer', title: 'Offer Extended', dot: 'bg-emerald-500' },
  { id: 'rejected', title: 'Archived', dot: 'bg-rose-500' },
];

const ADVANCE_SEQUENCE: ApplicationStatus[] = ['bookmarked', 'applied', 'screening', 'interview', 'offer'];

const getNextStatus = (current: ApplicationStatus): ApplicationStatus | null => {
  const idx = ADVANCE_SEQUENCE.indexOf(current);
  return idx >= 0 && idx < ADVANCE_SEQUENCE.length - 1 ? ADVANCE_SEQUENCE[idx + 1] : null;
};

const getPrevStatus = (current: ApplicationStatus): ApplicationStatus | null => {
  const idx = ADVANCE_SEQUENCE.indexOf(current);
  return idx > 0 ? ADVANCE_SEQUENCE[idx - 1] : null;
};

// Stable across renders (module scope) — an inline arrow here would give
// Kanban's internal useCallback/useMemo chain a new dependency every render.
const getAppId = (app: Application) => String(app.id);

const buildColumns = (applications: Application[]): Record<ApplicationStatus, Application[]> => {
  const grouped = Object.fromEntries(COLUMNS.map((c) => [c.id, [] as Application[]])) as Record<ApplicationStatus, Application[]>;
  for (const app of applications) {
    (grouped[app.status] ??= []).push(app);
  }
  return grouped;
};

interface ApplicationCardProps {
  app: Application;
  isHandleless?: boolean;
  editingNotesId: number | null;
  notesText: string;
  onStartEditNotes: (app: Application) => void;
  onNotesChange: (value: string) => void;
  onSaveNotes: (appId: number) => void;
  onCancelNotes: () => void;
  onAdvance: (appId: number, status: ApplicationStatus) => void;
  onMockPrep: (app: Application) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  app, isHandleless, editingNotesId, notesText, onStartEditNotes,
  onNotesChange, onSaveNotes, onCancelNotes, onAdvance, onMockPrep,
}) => {
  const nextSt = getNextStatus(app.status);
  const prevSt = getPrevStatus(app.status);
  const isEditing = editingNotesId === app.id;

  const content = (
    <Frame variant="ghost" spacing="sm" className="p-0">
      <FramePanel className="p-3.5 space-y-3">
        {/* Company & Role */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
              {app.job?.company || 'Company'}
            </span>
            <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-1">
              {app.job?.title || 'Software Role'}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {app.match_score ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                {app.match_score}% Fit
              </span>
            ) : null}
            {!isHandleless && (
              <KanbanItemHandle className="p-1 -mr-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent">
                <GripVertical className="w-3.5 h-3.5" />
              </KanbanItemHandle>
            )}
          </div>
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
        {isEditing ? (
          <div className="space-y-1.5 pt-1" onPointerDown={(e) => e.stopPropagation()}>
            <textarea
              rows={2}
              value={notesText}
              onChange={(e) => onNotesChange(e.target.value)}
              className="w-full p-2 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
            />
            <div className="flex justify-end gap-1 text-[10px]">
              <button onClick={onCancelNotes} className="px-2 py-0.5 text-muted-foreground cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => onSaveNotes(app.id)}
                className="px-2.5 py-0.5 bg-primary text-primary-foreground font-bold rounded cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onStartEditNotes(app)}
            className="p-2 rounded-lg bg-muted/40 hover:bg-muted text-[11px] text-muted-foreground cursor-pointer transition-colors"
            title="Click to edit notes"
          >
            <span className="font-medium text-foreground">Notes: </span>
            <span>{app.candidate_notes || 'Click to add notes, interviewer names, or next steps...'}</span>
          </div>
        )}

        {/* AI Mock Interview Quick Launcher + Stage Transition Controls */}
        <div className="pt-2 border-t border-border flex items-center justify-between gap-1 text-xs" onPointerDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => onMockPrep(app)}
            className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Mock Prep</span>
          </button>

          <div className="flex items-center gap-1">
            {prevSt && (
              <button
                onClick={() => onAdvance(app.id, prevSt)}
                className="p-1 rounded bg-muted hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
                title={`Move back to ${prevSt}`}
              >
                <ArrowLeft className="w-3 h-3" />
              </button>
            )}
            {nextSt && (
              <button
                onClick={() => onAdvance(app.id, nextSt)}
                className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold flex items-center gap-0.5 hover:opacity-90 cursor-pointer"
                title={`Advance to ${nextSt}`}
              >
                <span>Advance</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </FramePanel>
    </Frame>
  );

  if (isHandleless) return content;

  return (
    <KanbanItem value={String(app.id)} className="cursor-grab">
      {content}
    </KanbanItem>
  );
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ applications, onRefresh }) => {
  const router = useRouter();
  const [columns, setColumns] = useState<Record<ApplicationStatus, Application[]>>(() => buildColumns(applications));
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    setColumns(buildColumns(applications));
  }, [applications]);

  // Kept fresh without ever changing identity, so callbacks handed to
  // <Kanban> below can stay permanently stable (see handleValueChange /
  // handleValueCommit) instead of being recreated - and re-triggering
  // Kanban's internal useCallback chain - on every render.
  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  const moveApplicationStatus = async (appId: number, nextStatus: ApplicationStatus) => {
    try {
      await applicationsApi.updateStatus(appId, { status: nextStatus });
      onRefreshRef.current();
    } catch {
      onRefreshRef.current();
    }
  };

  const handleValueChange = useCallback((next: Record<string, Application[]>) => {
    setColumns(next as Record<ApplicationStatus, Application[]>);
  }, []);

  const handleValueCommit = useCallback((_next: Record<string, Application[]>, meta: { kind: string; event: { active: { id: string | number } }; activeContainer: string; overContainer: string }) => {
    if (meta.kind === 'item' && meta.activeContainer !== meta.overContainer) {
      moveApplicationStatus(Number(meta.event.active.id), meta.overContainer as ApplicationStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveNotes = async (appId: number) => {
    try {
      await applicationsApi.updateStatus(appId, { status: 'applied', candidate_notes: notesText });
      setEditingNotesId(null);
      onRefresh();
    } catch {
      setEditingNotesId(null);
    }
  };

  const findApp = (id: string | number): Application | undefined => {
    const target = String(id);
    for (const col of Object.values(columns)) {
      const found = col.find((a) => String(a.id) === target);
      if (found) return found;
    }
    return undefined;
  };

  return (
    <Kanban
      value={columns}
      onValueChange={handleValueChange}
      getItemValue={getAppId}
      onValueCommit={handleValueCommit}
    >
      <div className="w-full overflow-x-auto pb-6">
        <KanbanBoardGrid className="flex gap-4 min-w-[1400px] grid-cols-none">
          {COLUMNS.map((col) => {
            const colApps = columns[col.id] || [];

            return (
              <KanbanColumn key={col.id} value={col.id} className="w-56 shrink-0">
                <Frame spacing="sm" className="h-full max-h-[78vh]">
                  <FrameHeader className="flex flex-row items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${col.dot}`} />
                    <FrameTitle className="text-xs uppercase tracking-wide font-bold truncate">
                      {col.title}
                    </FrameTitle>
                    <Badge variant="outline" size="sm" className="ml-auto shrink-0">
                      {colApps.length}
                    </Badge>
                  </FrameHeader>

                  <KanbanColumnContent value={col.id} className="p-0.5 overflow-y-auto flex-1">
                    {colApps.length === 0 ? (
                      <div className="p-6 rounded-xl border border-dashed border-border/80 text-center text-xs text-muted-foreground/60">
                        No applications in this stage
                      </div>
                    ) : (
                      colApps.map((app) => (
                        <ApplicationCard
                          key={app.id}
                          app={app}
                          editingNotesId={editingNotesId}
                          notesText={notesText}
                          onStartEditNotes={(a) => { setEditingNotesId(a.id); setNotesText(a.candidate_notes || ''); }}
                          onNotesChange={setNotesText}
                          onSaveNotes={saveNotes}
                          onCancelNotes={() => setEditingNotesId(null)}
                          onAdvance={moveApplicationStatus}
                          onMockPrep={(a) => router.push(
                            `/ai-copilot?tab=interview&jobTitle=${encodeURIComponent(a.job?.title || '')}&company=${encodeURIComponent(a.job?.company || '')}`
                          )}
                        />
                      ))
                    )}
                  </KanbanColumnContent>
                </Frame>
              </KanbanColumn>
            );
          })}
        </KanbanBoardGrid>
      </div>

      <KanbanOverlay>
        {({ value }) => {
          const app = findApp(value);
          if (!app) return null;
          return (
            <div className="w-56 shadow-2xl rounded-xl rotate-1">
              <ApplicationCard
                app={app}
                isHandleless
                editingNotesId={null}
                notesText=""
                onStartEditNotes={() => {}}
                onNotesChange={() => {}}
                onSaveNotes={() => {}}
                onCancelNotes={() => {}}
                onAdvance={() => {}}
                onMockPrep={() => {}}
              />
            </div>
          );
        }}
      </KanbanOverlay>
    </Kanban>
  );
};
