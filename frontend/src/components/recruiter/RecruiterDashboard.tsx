'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { jobsApi, applicationsApi } from '@/lib/api';
import { Job, Application } from '@/types';
import { MOCK_JOBS } from '@/lib/mockData';
import confetti from 'canvas-confetti';
import {
  Briefcase, Plus, Users, Sparkles, CheckCircle2,
  AlertCircle, ArrowRight, DollarSign, MapPin, Search,
  Bot, Clock, ShieldCheck, Filter
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<number>(1);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [isGeneratingJD, setIsGeneratingJD] = useState(false);

  // New Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState(user?.company || 'Stripe');
  const [newLocation, setNewLocation] = useState('San Francisco, CA / Remote');
  const [newWorkplaceType, setNewWorkplaceType] = useState<'Remote' | 'Hybrid' | 'Onsite'>('Remote');
  const [newMinSalary, setNewMinSalary] = useState(170000);
  const [newMaxSalary, setNewMaxSalary] = useState(230000);
  const [newDescription, setNewDescription] = useState('');
  const [newTechStack, setNewTechStack] = useState('React, TypeScript, Next.js, Python, FastAPI, PostgreSQL');

  useEffect(() => {
    jobsApi.getJobs().then((data) => {
      if (data && data.length > 0) setJobs(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    applicationsApi.getJobApplicants(selectedJobId).then((data) => {
      setApplicants(data);
    }).catch(() => {
      // Fallback applicants for demo
      setApplicants([
        {
          id: 1,
          job_id: selectedJobId,
          user_id: 1,
          status: 'interview',
          match_score: 94,
          resume_text: 'Alex Rivera - Senior Full-Stack Engineer with 5+ years building Next.js and FastAPI systems. Reduced latency by 40%.',
          cover_letter: 'Excited to contribute to Stripe developer platform infrastructure.',
          applied_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: 1,
            email: 'alex.rivera@example.com',
            full_name: 'Alex Rivera',
            role: 'candidate',
            headline: 'Senior Full-Stack Engineer | React, Next.js, Python, System Design',
            karma_points: 240,
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            location: 'San Francisco, CA',
            created_at: new Date().toISOString(),
          }
        },
        {
          id: 2,
          job_id: selectedJobId,
          user_id: 5,
          status: 'screening',
          match_score: 87,
          resume_text: 'Jordan Lee - Frontend Platform Specialist with deep Next.js performance expertise.',
          applied_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: 5,
            email: 'jordan.lee@example.com',
            full_name: 'Jordan Lee',
            role: 'candidate',
            headline: 'Senior Frontend Engineer | Web Vitals, Design Systems',
            karma_points: 180,
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            location: 'Remote',
            created_at: new Date().toISOString(),
          }
        }
      ]);
    });
  }, [selectedJobId]);

  const handleGenerateJD = () => {
    if (!newTitle.trim()) return;
    setIsGeneratingJD(true);
    setTimeout(() => {
      setNewDescription(
        `We are looking for an exceptional ${newTitle} to join ${newCompany}. In this role, you will architect high-throughput applications, collaborate across distributed teams, and drive engineering standards.\n\nKey Requirements:\n- 4+ years building production applications with modern tech stacks.\n- Strong proficiency in distributed architecture and performance tuning.\n- Proven track record of high ownership and mentorship.`
      );
      setIsGeneratingJD(false);
    }, 600);
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const techArray = newTechStack.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      const created = await jobsApi.createJob({
        title: newTitle,
        company: newCompany,
        location: newLocation,
        workplace_type: newWorkplaceType,
        salary_min: newMinSalary,
        salary_max: newMaxSalary,
        description: newDescription,
        tech_stack: techArray,
        requirements: ['4+ years professional software development', 'Strong system design intuition', 'Collaborative mindset'],
        responsibilities: ['Architect scalable web features', 'Mentor team engineers', 'Participate in on-call rotation'],
        benefits: ['Top-tier competitive base + equity', 'Comprehensive health coverage', 'Home office budget'],
      });

      setJobs([created, ...jobs]);
      setSelectedJobId(created.id);
      setIsPostingJob(false);

      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {}
    } catch {
      setIsPostingJob(false);
    }
  };

  const updateCandidateStatus = async (appId: number, newStatus: string) => {
    try {
      await applicationsApi.updateStatus(appId, { status: newStatus });
      setApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus as any } : a))
      );
    } catch {}
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  return (
    <div className="space-y-8">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
          <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-primary" /> Active Job Postings
          </div>
          <div className="text-2xl font-black text-foreground">{jobs.length}</div>
          <div className="text-[10px] text-emerald-600">All positions active</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
          <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-600" /> Total Applicants
          </div>
          <div className="text-2xl font-black text-foreground">
            {jobs.reduce((acc, j) => acc + (j.applications_count || 0), 0) + 42}
          </div>
          <div className="text-[10px] text-emerald-600">+14% this week</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
          <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Match Pre-Screened
          </div>
          <div className="text-2xl font-black text-foreground">88%</div>
          <div className="text-[10px] text-primary">Avg candidate quality score</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
          <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary-foreground" /> Verified Referrals
          </div>
          <div className="text-2xl font-black text-foreground">18</div>
          <div className="text-[10px] text-secondary-foreground">From verified employees</div>
        </div>
      </div>

      {/* Main Section: Job Selector & Applicant Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Job Openings List */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Your Job Postings</h3>
            <button
              onClick={() => setIsPostingJob(true)}
              className="px-3 py-1.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Role</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {jobs.map((j) => (
              <div
                key={j.id}
                onClick={() => setSelectedJobId(j.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedJobId === j.id
                    ? 'border-primary bg-primary/5 shadow-xs'
                    : 'border-border hover:border-primary/40 bg-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary uppercase">{j.company}</span>
                  <span className="text-[10px] text-muted-foreground">{j.applications_count} applicants</span>
                </div>
                <h4 className="font-bold text-xs text-foreground mt-0.5">{j.title}</h4>
                <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-2">
                  <span>{j.location}</span>
                  <span>•</span>
                  <span>${(j.salary_max / 1000).toFixed(0)}k/yr</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI-Ranked Applicant Pipeline for Selected Job */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <span className="text-xs font-bold text-primary uppercase">Applicant Pipeline</span>
              <h2 className="text-lg font-black text-foreground">{selectedJob?.title}</h2>
              <p className="text-xs text-muted-foreground">{selectedJob?.company} • {selectedJob?.location}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Ranked by:</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Match Fit
              </span>
            </div>
          </div>

          {/* Applicants List */}
          <div className="space-y-4">
            {applicants.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No active applicants for this opening yet. Candidates who apply will automatically be scored against your tech stack.
              </div>
            ) : (
              applicants.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-xl border border-border bg-muted/20 hover:border-primary/40 space-y-3 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={app.user?.full_name || 'Candidate'}
                        className="w-11 h-11 rounded-full object-cover border border-border"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-foreground">{app.user?.full_name}</h4>
                          <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-primary/10 text-primary uppercase">
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{app.user?.headline}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        {app.match_score}%
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">AI Skill Fit</span>
                    </div>
                  </div>

                  {/* Resume highlight */}
                  {app.resume_text && (
                    <div className="p-3 rounded-lg bg-card border border-border/80 text-xs text-foreground leading-relaxed">
                      <strong className="text-primary">Resume Highlight: </strong>
                      <span>{app.resume_text}</span>
                    </div>
                  )}

                  {/* Cover letter snippet */}
                  {app.cover_letter && (
                    <p className="text-xs text-muted-foreground italic pl-2 border-l-2 border-primary/30">
                      "{app.cover_letter}"
                    </p>
                  )}

                  {/* Recruiter Action Buttons */}
                  <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-muted-foreground text-[11px]">
                      Applied {new Date(app.applied_at).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateCandidateStatus(app.id, 'screening')}
                        className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-accent text-foreground text-xs font-semibold cursor-pointer"
                      >
                        Screening Phone
                      </button>
                      <button
                        onClick={() => updateCandidateStatus(app.id, 'interview')}
                        className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold cursor-pointer"
                      >
                        Tech Interview
                      </button>
                      <button
                        onClick={() => updateCandidateStatus(app.id, 'offer')}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Extend Offer 🎉
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      {isPostingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Briefcase className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-base text-foreground">Post a New Opportunity</h3>
              </div>
              <button onClick={() => setIsPostingJob(false)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handlePostJob} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Role Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Senior Full-Stack Engineer"
                    className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Company Name</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g., Stripe, Figma"
                    className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Min Salary ($/yr)</label>
                  <input
                    type="number"
                    value={newMinSalary}
                    onChange={(e) => setNewMinSalary(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Max Salary ($/yr)</label>
                  <input
                    type="number"
                    value={newMaxSalary}
                    onChange={(e) => setNewMaxSalary(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Required Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={newTechStack}
                  onChange={(e) => setNewTechStack(e.target.value)}
                  placeholder="React, TypeScript, Python, FastAPI, PostgreSQL"
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground">Job Description & Responsibilities</label>
                  <button
                    type="button"
                    onClick={handleGenerateJD}
                    disabled={isGeneratingJD || !newTitle.trim()}
                    className="text-primary hover:underline text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>{isGeneratingJD ? 'Generating JD...' : 'Auto-Generate with AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the role mission, technical challenges, and deliverables..."
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-xs leading-relaxed outline-none focus:border-primary"
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostingJob(false)}
                  className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-accent font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold shadow-md cursor-pointer"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
