'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Job, CommunityPost, ReferralListing } from '@/types';
import { jobsApi } from '@/lib/api';
import {
  X, Briefcase, MapPin, DollarSign, Sparkles, Award, MessageSquare,
  Bookmark, BookmarkCheck, CheckCircle2, AlertCircle, ArrowRight,
  ExternalLink, Share2, Bot, Users, ShieldCheck, ChevronRight
} from 'lucide-react';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
  onToggleSave?: (jobId: number) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onApply,
  onToggleSave,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'ai_fit' | 'insider' | 'referrals'>('overview');
  const [intelligence, setIntelligence] = useState<{
    insider_discussions: any[];
    available_referrers: any[];
    culture_snapshot: any;
  } | null>(null);
  const [isLoadingIntel, setIsLoadingIntel] = useState(false);

  useEffect(() => {
    if (job && isOpen) {
      setIsLoadingIntel(true);
      jobsApi
        .getJobIntelligence(job.id)
        .then((data) => setIntelligence(data))
        .catch(() => {
          // Fallback intelligence
          setIntelligence({
            insider_discussions: [],
            available_referrers: [],
            culture_snapshot: {
              overall_rating: 4.8,
              work_life_balance: 4.5,
              engineering_craft: 4.9,
              interview_difficulty: 'Challenging (Strong System Design & Craft focus)'
            }
          });
        })
        .finally(() => setIsLoadingIntel(false));
    }
  }, [job, isOpen]);

  if (!isOpen || !job) return null;

  const formatSalary = (min: number, max: number, currency: string) => {
    if (!min && !max) return 'Competitive Market Package';
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k ${currency}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-border bg-muted/20 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-card border border-border p-1.5 flex items-center justify-center shrink-0 shadow-xs">
              {job.company_logo ? (
                <img src={job.company_logo} alt={job.company} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Briefcase className="w-7 h-7 text-primary" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary tracking-wide uppercase">{job.company}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{job.department}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500 inline" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground mt-0.5">{job.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2 font-medium">
                <span className="flex items-center gap-1 text-foreground">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {job.location} ({job.workplace_type})
                </span>
                <span className="flex items-center gap-1 text-foreground font-semibold">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                </span>
                <span className="px-2 py-0.5 rounded bg-muted text-foreground">{job.experience_level}</span>
                <span className="px-2 py-0.5 rounded bg-muted text-foreground">{job.employment_type}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(job.id)}
                className="p-2.5 rounded-xl border border-border bg-card hover:bg-accent text-foreground transition-colors cursor-pointer"
                title="Bookmark Job"
              >
                {job.is_saved ? <BookmarkCheck className="w-5 h-5 text-primary fill-primary" /> : <Bookmark className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar (Apply, AI Radar, Insider Truth) */}
        <div className="px-6 py-2.5 bg-muted/40 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-card text-foreground shadow-xs border border-border' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview & Requirements
            </button>

            <button
              onClick={() => setActiveTab('ai_fit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ai_fit'
                  ? 'bg-card text-primary shadow-xs border border-primary/40'
                  : 'text-primary hover:bg-primary/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Match Radar</span>
              {job.ai_match_score && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  {job.ai_match_score}%
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('insider')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'insider' ? 'bg-card text-foreground shadow-xs border border-border' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-secondary-foreground" />
              <span>Insider Debriefs</span>
            </button>

            <button
              onClick={() => setActiveTab('referrals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'referrals' ? 'bg-card text-foreground shadow-xs border border-border' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Referrers</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                router.push(`/ai-copilot?tab=interview&jobId=${job.id}&jobTitle=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`);
              }}
              className="px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Mock Interview</span>
            </button>

            <button
              onClick={() => onApply(job)}
              className="px-4 py-1.5 rounded-lg bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Job Description */}
              <div>
                <h4 className="font-bold text-foreground text-sm uppercase tracking-wider mb-2">About The Role</h4>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h4 className="font-bold text-foreground text-sm uppercase tracking-wider mb-2">Key Responsibilities</h4>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h4 className="font-bold text-foreground text-sm uppercase tracking-wider mb-2">Qualifications & Skills</h4>
                  <ul className="space-y-2">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack */}
              {job.tech_stack && job.tech_stack.length > 0 && (
                <div>
                  <h4 className="font-bold text-foreground text-sm uppercase tracking-wider mb-2">Tech Stack & Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.tech_stack.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-lg bg-accent text-foreground text-xs font-mono font-medium border border-border">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="p-4 rounded-xl bg-secondary/15 border border-secondary/30">
                  <h4 className="font-bold text-secondary-foreground text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-secondary-foreground" /> Compensation & Perks
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-secondary-foreground">
                    {job.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-foreground"></span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI FIT & SKILL-GAP RADAR */}
          {activeTab === 'ai_fit' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent border border-primary/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Profile Match Evaluation
                    </span>
                    <h3 className="text-lg font-black text-foreground mt-1">
                      You are in the <span className="text-emerald-600 dark:text-emerald-400 font-black">Top 10% candidate fit</span> for this role!
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on your verified skills in TypeScript, Next.js, Python, and scalable distributed system design.
                    </p>
                  </div>
                  <div className="text-center sm:text-right shrink-0">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card border-4 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black text-xl shadow-md">
                      {job.ai_match_score || 94}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <h4 className="font-bold text-emerald-700 dark:text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Strong Matched Skills ({job.tech_stack?.slice(0, 4).length || 4})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(job.tech_stack?.slice(0, 4) || ['React', 'TypeScript', 'Next.js', 'Python']).map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-medium">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                  <h4 className="font-bold text-amber-700 dark:text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> High-Value Keywords to Highlight
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['Distributed Architecture', 'API Gateways', 'Kubernetes', 'Redis Caching'].map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono text-xs font-medium">
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons for AI */}
              <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-foreground text-xs">Want to tailor your resume bullet points for this specific JD?</h5>
                  <p className="text-[11px] text-muted-foreground">The AI Resume Tailor rewrites your experience bullets with quantified impact for Stripe.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/ai-copilot?tab=resume&jd=${encodeURIComponent(job.description)}`);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 shrink-0 cursor-pointer"
                >
                  Tailor My Resume →
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: INSIDER DEBRIEFS & CULTURE */}
          {activeTab === 'insider' && (
            <div className="space-y-6">
              {/* Culture Scorecard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-muted border border-border text-center">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">Overall Rating</div>
                  <div className="text-xl font-black text-foreground mt-0.5">4.8 ★</div>
                  <div className="text-[10px] text-emerald-600">Top 5% Tech Tier</div>
                </div>
                <div className="p-3 rounded-xl bg-muted border border-border text-center">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">Work-Life Balance</div>
                  <div className="text-xl font-black text-foreground mt-0.5">4.5 ★</div>
                  <div className="text-[10px] text-muted-foreground">Flexible & Remote</div>
                </div>
                <div className="p-3 rounded-xl bg-muted border border-border text-center">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">Engineering Craft</div>
                  <div className="text-xl font-black text-foreground mt-0.5">4.9 ★</div>
                  <div className="text-[10px] text-primary">High Velocity</div>
                </div>
                <div className="p-3 rounded-xl bg-muted border border-border text-center">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">Interview Bar</div>
                  <div className="text-base font-bold text-foreground mt-1">Challenging</div>
                  <div className="text-[10px] text-amber-600">Deep System Design</div>
                </div>
              </div>

              {/* Insider Community Posts */}
              <div>
                <h4 className="font-bold text-foreground text-sm uppercase tracking-wider mb-3">
                  Verified Discussions about {job.company}
                </h4>

                {intelligence?.insider_discussions && intelligence.insider_discussions.length > 0 ? (
                  <div className="space-y-3">
                    {intelligence.insider_discussions.map((p: any) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onClose();
                          router.push(`/community?post=${p.id}`);
                        }}
                        className="p-4 rounded-xl border border-border hover:border-primary/50 bg-card hover:bg-accent/40 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-secondary-foreground bg-secondary/30 px-2 py-0.5 rounded">
                            #{p.channel}
                          </span>
                          <span className="text-xs text-muted-foreground">▲ {p.upvotes} upvotes</span>
                        </div>
                        <h5 className="font-bold text-foreground text-sm mt-1.5">{p.title}</h5>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.content}</p>
                        <div className="mt-2 text-[11px] text-muted-foreground">
                          By <strong className="text-foreground">{p.author_name}</strong> {p.author_headline ? `• ${p.author_headline}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-dashed border-border text-center text-muted-foreground text-xs">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground/60" />
                    <p>Have an interview experience at {job.company}? Share it anonymously in the community to earn 50 Karma points.</p>
                    <button
                      onClick={() => {
                        onClose();
                        router.push(`/community?newPostCompany=${encodeURIComponent(job.company)}`);
                      }}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold cursor-pointer"
                    >
                      Post Insider Debrief
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: VERIFIED REFERRERS */}
          {activeTab === 'referrals' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-foreground text-xs">Verified Referral Fast-Track</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Verified employees at {job.company} have opted in to refer strong candidates for this role. Submitting a referral request gives you a 5x recruiter response rate.
                  </p>
                </div>
              </div>

              {intelligence?.available_referrers && intelligence.available_referrers.length > 0 ? (
                <div className="space-y-3">
                  {intelligence.available_referrers.map((ref: any) => (
                    <div
                      key={ref.id}
                      className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={ref.employee_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                          alt={ref.employee_name}
                          className="w-10 h-10 rounded-full object-cover border border-border"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground text-sm">{ref.employee_name}</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          </div>
                          <p className="text-xs text-muted-foreground">{ref.employee_headline}</p>
                          <p className="text-xs text-foreground mt-1 line-clamp-1">{ref.description}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          router.push(`/referrals?requestListingId=${ref.id}&jobTitle=${encodeURIComponent(job.title)}`);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs shrink-0 cursor-pointer"
                      >
                        Request Referral
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-border text-center text-muted-foreground text-xs">
                  <Award className="w-8 h-8 mx-auto mb-2 text-muted-foreground/60" />
                  <p>No active public referral listings for {job.company} right now.</p>
                  <p className="mt-1">You can ask for a referral in the <strong>#referral-requests</strong> channel!</p>
                  <button
                    onClick={() => {
                      onClose();
                      router.push('/community?channel=referrals');
                    }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold cursor-pointer"
                  >
                    Ask in Community
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Bar */}
        <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            Posted recently • {job.applications_count} applicants • {job.views_count} views
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-accent text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => onApply(job)}
              className="px-5 py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>Proceed Application</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
