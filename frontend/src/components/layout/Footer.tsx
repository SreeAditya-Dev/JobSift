'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, ShieldCheck, Cpu, Code2, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const router = useRouter();

  return (
    <footer className="bg-card border-t border-border mt-20 pt-12 pb-16 md:pb-12 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-border">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#644a40] to-[#3e2723] dark:from-[#ffe0c2] dark:to-[#ffdfb5] flex items-center justify-center text-white dark:text-[#393028] shadow-xs">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-foreground">
                Job<span className="text-primary font-black">Sift</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The unified one-stop career operating system. Connecting job discovery, insider debriefs, verified referral matchmaking, and an interactive AI copilot into a cohesive ecosystem.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero Spam • Verified Networks • Real Data</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Platform</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <button onClick={() => router.push('/jobs')} className="hover:text-primary transition-colors cursor-pointer">
                  Explore Opportunities
                </button>
              </li>
              <li>
                <button onClick={() => router.push('/community')} className="hover:text-primary transition-colors cursor-pointer">
                  Insider Debriefs & Discussions
                </button>
              </li>
              <li>
                <button onClick={() => router.push('/referrals')} className="hover:text-primary transition-colors cursor-pointer">
                  Verified Referral Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => router.push('/tracker')} className="hover:text-primary transition-colors cursor-pointer">
                  Kanban Application Tracker
                </button>
              </li>
              <li>
                <button onClick={() => router.push('/salaries')} className="hover:text-primary transition-colors cursor-pointer">
                  Verified Salary Intelligence
                </button>
              </li>
            </ul>
          </div>

          {/* AI Intelligence Suite */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Career Suite
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <button onClick={() => router.push('/ai-copilot?tab=resume')} className="hover:text-primary transition-colors cursor-pointer">
                  ATS Resume Fit Scanner
                </button>
              </li>
              <li>
                <button onClick={() => router.push('/ai-copilot?tab=interview')} className="hover:text-primary transition-colors cursor-pointer">
                  Interactive AI Mock Interviewer
                </button>
              </li>
              <li>
                <button onClick={() => router.push('/ai-copilot?tab=salary')} className="hover:text-primary transition-colors cursor-pointer">
                  Salary Benchmark & Negotiator
                </button>
              </li>
              <li>
                <button onClick={() => router.push('/ai-copilot?tab=cover-letter')} className="hover:text-primary transition-colors cursor-pointer">
                  Tailored Cover Letter Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Stack */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-primary" /> System Architecture
            </h4>
            <div className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-primary" />
                <span>Next.js 15 App Router + React 19 + TypeScript</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>FastAPI (Python 3.12) AI Engine & REST API</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>SQLite / PostgreSQL ORM with SQLAlchemy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Tailwind CSS v4 with custom Caffeine Theme</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 JobSift. Engineered for the Modern Job Seeker.</p>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Brewed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>& AI Precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
