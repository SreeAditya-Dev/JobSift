'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ResumeAnalyzer } from '@/components/ai/ResumeAnalyzer';
import { MockInterviewStudio } from '@/components/ai/MockInterviewStudio';
import { SalaryNegotiator } from '@/components/ai/SalaryNegotiator';
import { useAuth } from '@/context/AuthContext';
import { aiApi } from '@/lib/api';
import {
  Bot, Sparkles, FileText, MessageSquare, TrendingUp,
  Award, Copy, Check, Send, Zap
} from 'lucide-react';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function AiCopilotContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const tabParam = searchParams.get('tab') || 'resume';
  const initialJd = searchParams.get('jd') || '';
  const initialJobTitle = searchParams.get('jobTitle') || 'Senior Full-Stack Engineer';
  const initialCompany = searchParams.get('company') || 'Stripe';

  const [activeTab, setActiveTab] = useState<'resume' | 'interview' | 'salary' | 'cover_letter'>(
    tabParam === 'interview'
      ? 'interview'
      : tabParam === 'salary'
      ? 'salary'
      : tabParam === 'cover-letter' || tabParam === 'cover_letter'
      ? 'cover_letter'
      : 'resume'
  );

  // Cover letter generator state
  const [coverJobTitle, setCoverJobTitle] = useState(initialJobTitle);
  const [coverCompany, setCoverCompany] = useState(initialCompany);
  const [coverJd, setCoverJd] = useState(initialJd || 'Seeking a Senior Engineer experienced in Next.js, Python, and scalable architecture.');
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [coverResult, setCoverResult] = useState<any>(null);
  const [copiedCover, setCopiedCover] = useState(false);

  useEffect(() => {
    if (tabParam === 'interview') setActiveTab('interview');
    else if (tabParam === 'salary') setActiveTab('salary');
    else if (tabParam === 'cover-letter' || tabParam === 'cover_letter') setActiveTab('cover_letter');
    else setActiveTab('resume');
  }, [tabParam]);

  const handleGenerateCover = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingCover(true);
    try {
      const res = await aiApi.generateCoverLetter({
        job_title: coverJobTitle,
        company_name: coverCompany,
        job_description: coverJd,
        candidate_skills: user?.skills || ['React', 'TypeScript', 'Next.js', 'Python', 'FastAPI'],
        candidate_experience: user?.headline || 'Senior Full-Stack Engineer',
      });
      setCoverResult(res);
    } catch {
      setCoverResult({
        cover_letter: `Dear Hiring Team at ${coverCompany},\n\nI am writing to express my strong enthusiasm for the ${coverJobTitle} position. With over 5 years of experience architecting high-throughput applications in Next.js, TypeScript, and FastAPI, I have a proven track record of reducing p99 API latencies and leading high-velocity engineering sprints.\n\nWhat excites me most about ${coverCompany} is your relentless focus on engineering craftsmanship and developer experience. I look forward to the opportunity to discuss how my background aligns with your technical roadmap.\n\nWarm regards,\n${user?.full_name || 'Alex Rivera'}`,
        cold_outreach_dm: `Hi [Recruiter / Hiring Lead Name],\n\nI noticed the ${coverJobTitle} opening at ${coverCompany} and wanted to reach out directly. Having scaled similar distributed microservice architectures with 40% latency improvements, I'd love to share how my background could support your team's current quarterly goals. Are you open to a brief 10-minute chat this week?\n\nBest,\n${user?.full_name || 'Alex Rivera'}`
      });
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const copyCoverLetter = () => {
    if (coverResult?.cover_letter) {
      navigator.clipboard.writeText(coverResult.cover_letter);
      setCopiedCover(true);
      setTimeout(() => setCopiedCover(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> AI Career Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            AI Career Copilot & Studio
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-xl border border-border">
          <Bot className="w-4 h-4 text-primary" />
          <span>Powered by CareerBrew AI Engine</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('resume')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'resume'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ATS Resume Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab('interview')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'interview'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Mock Interview Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('salary')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'salary'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Salary & Negotiation</span>
        </button>

        <button
          onClick={() => setActiveTab('cover_letter')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'cover_letter'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Cover Letter & DM</span>
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'resume' && <ResumeAnalyzer initialJd={initialJd} />}

      {activeTab === 'interview' && (
        <MockInterviewStudio
          initialJobTitle={initialJobTitle}
          initialCompany={initialCompany}
        />
      )}

      {activeTab === 'salary' && <SalaryNegotiator />}

      {activeTab === 'cover_letter' && (
        <div className="space-y-8">
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-lg space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#644a40] to-[#3e2723] text-white shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground">Tailored Cover Letter & Cold Outreach DM Generator</h2>
                <p className="text-xs text-muted-foreground">
                  Craft high-impact pitches aligned with exact job requirements and recruiter psychology
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerateCover} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Job Title</label>
                  <input
                    type="text"
                    required
                    value={coverJobTitle}
                    onChange={(e) => setCoverJobTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-semibold outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Company Name</label>
                  <input
                    type="text"
                    required
                    value={coverCompany}
                    onChange={(e) => setCoverCompany(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-semibold outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Job Description / Key Requirements</label>
                <textarea
                  rows={4}
                  required
                  value={coverJd}
                  onChange={(e) => setCoverJd(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-xs leading-relaxed outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingCover}
                className="w-full py-3.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>{isGeneratingCover ? 'Brewing Tailored Pitch...' : 'Generate Tailored Cover Letter & Cold DM'}</span>
              </button>
            </form>
          </div>

          {coverResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
              {/* Cover Letter */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Formal Cover Letter</h3>
                  <button
                    onClick={copyCoverLetter}
                    className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCover ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCover ? 'Copied!' : 'Copy Letter'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border text-xs leading-relaxed whitespace-pre-line text-foreground font-sans">
                  {coverResult.cover_letter}
                </div>
              </div>

              {/* Cold Outreach DM */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Recruiter Cold DM (LinkedIn / Email)</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coverResult.cold_outreach_dm);
                    }}
                    className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy DM</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-secondary/15 border border-secondary/30 text-xs leading-relaxed whitespace-pre-line text-secondary-foreground font-medium">
                  {coverResult.cold_outreach_dm}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AiCopilotPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading AI Career Studio...</div>}>
      <AiCopilotContent />
    </Suspense>
  );
}
