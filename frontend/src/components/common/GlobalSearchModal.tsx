'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Briefcase, MessageSquare, Award, Sparkles, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { jobsApi, communityApi, referralsApi } from '@/lib/api';
import { Job, CommunityPost, ReferralListing } from '@/types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<ReferralListing[]>([]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchResults = async () => {
      try {
        const [jobs, posts, referrals] = await Promise.all([
          jobsApi.getJobs(query ? { q: query } : {}),
          communityApi.getPosts(query ? { search: query } : {}),
          referralsApi.getListings()
        ]);
        
        setFilteredJobs(jobs ? jobs.slice(0, 3) : []);
        setFilteredPosts(posts ? posts.slice(0, 3) : []);
        
        // Filter referrals locally since backend doesn't support search param for referrals currently
        if (referrals) {
          const qLower = query.toLowerCase().trim();
          const filtered = qLower
            ? referrals.filter(
                (r: any) =>
                  r.company.toLowerCase().includes(qLower) ||
                  r.role_category.toLowerCase().includes(qLower)
              )
            : referrals;
          setFilteredReferrals(filtered.slice(0, 2));
        } else {
          setFilteredReferrals([]);
        }
      } catch (error) {
        console.error("Global search failed:", error);
      }
    };
    
    // simple debounce
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query, isOpen]);

  const navigateTo = (path: string) => {
    onClose();
    router.push(path);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/30">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search jobs, tech stacks, salary debates, insider debriefs, or referrals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex px-2 py-0.5 text-xs bg-accent text-accent-foreground rounded border border-border font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-5 text-sm">
          {/* Quick AI Action Cards */}
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-2">
              AI Copilot Accelerators
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => navigateTo('/ai-copilot?tab=resume')}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-border/80 hover:border-primary/50 hover:bg-accent/50 text-left transition-all group cursor-pointer"
              >
                <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-foreground text-xs">ATS Resume Scanner</div>
                  <div className="text-[10px] text-muted-foreground">Match score & keywords</div>
                </div>
              </button>

              <button
                onClick={() => navigateTo('/ai-copilot?tab=interview')}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-border/80 hover:border-primary/50 hover:bg-accent/50 text-left transition-all group cursor-pointer"
              >
                <div className="p-1.5 rounded-md bg-secondary/30 text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-foreground text-xs">AI Mock Interview</div>
                  <div className="text-[10px] text-muted-foreground">STAR rubric coaching</div>
                </div>
              </button>

              <button
                onClick={() => navigateTo('/ai-copilot?tab=salary')}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-border/80 hover:border-primary/50 hover:bg-accent/50 text-left transition-all group cursor-pointer"
              >
                <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-foreground text-xs">Salary Negotiator</div>
                  <div className="text-[10px] text-muted-foreground">Market counter scripts</div>
                </div>
              </button>
            </div>
          </div>

          {/* Job Results */}
          {filteredJobs.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-2 flex items-center justify-between">
                <span>Jobs & Roles</span>
                <span className="text-[10px]">{filteredJobs.length} matches</span>
              </div>
              <div className="space-y-1.5">
                {filteredJobs.map((j) => (
                  <div
                    key={j.id}
                    onClick={() => navigateTo(`/jobs?id=${j.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/60 cursor-pointer border border-transparent hover:border-border transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-muted text-primary">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{j.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {j.company} • {j.location} • ${(j.salary_max / 1000).toFixed(0)}k/yr
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {j.ai_match_score && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {j.ai_match_score}% Match
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Debriefs & Discussions */}
          {filteredPosts.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-2 flex items-center justify-between">
                <span>Insider Discussions & Debriefs</span>
                <span className="text-[10px]">{filteredPosts.length} threads</span>
              </div>
              <div className="space-y-1.5">
                {filteredPosts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigateTo(`/community?post=${p.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/60 cursor-pointer border border-transparent hover:border-border transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-secondary/30 text-secondary-foreground">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="max-w-md">
                        <div className="font-medium text-foreground truncate">{p.title}</div>
                        <div className="text-xs text-muted-foreground">
                          #{p.channel} • {p.upvotes} upvotes • by {p.author_name}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Referrals */}
          {filteredReferrals.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-2 flex items-center justify-between">
                <span>Verified Referrals</span>
                <span className="text-[10px]">{filteredReferrals.length} available</span>
              </div>
              <div className="space-y-1.5">
                {filteredReferrals.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => navigateTo(`/referrals?listing=${r.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/60 cursor-pointer border border-transparent hover:border-border transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-primary/10 text-primary">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {r.company} ({r.role_category})
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Offered by {r.employee_name} • {r.successful_referrals} successful referrals
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-accent rounded text-[10px] font-mono border border-border">↑↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> to select
            </span>
          </div>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
