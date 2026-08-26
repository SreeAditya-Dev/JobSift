'use client';

import React from 'react';
import Link from 'next/link';
import { Coffee, ShieldCheck, Cpu, Code2, Sparkles, Heart } from 'lucide-react';

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-6 mt-20">
      <footer className="bg-card border border-border rounded-[2.5rem] pt-16 pb-8 text-sm transition-colors relative overflow-hidden shadow-sm max-w-7xl mx-auto">
        {/* Decorative gradient blur in background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-24 bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="px-8 sm:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/60">
            {/* Brand Col */}
            <div className="md:col-span-1 space-y-5">
              <Link href="/" className="flex items-center gap-2.5 inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#644a40] to-[#3e2723] dark:from-[#ffe0c2] dark:to-[#ffdfb5] flex items-center justify-center text-white dark:text-[#393028] shadow-sm">
                  <Coffee className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg tracking-tight text-foreground">
                  Job<span className="text-primary font-black">Sift</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed pr-4">
                The unified one-stop career operating system. Connecting job discovery, insider debriefs, and an interactive AI copilot into a cohesive ecosystem.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/10 py-1.5 px-3 rounded-full w-fit">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Spam • Verified Data</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground">Platform</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {[
                  { label: 'Explore Opportunities', href: '/jobs' },
                  { label: 'Insider Debriefs', href: '/community' },
                  { label: 'Referral Marketplace', href: '/referrals' },
                  { label: 'Application Tracker', href: '/tracker' },
                  { label: 'Salary Intelligence', href: '/salaries' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Intelligence Suite */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> AI Career Suite
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {[
                  { label: 'ATS Resume Scanner', href: '/ai-copilot?tab=resume' },
                  { label: 'AI Mock Interviewer', href: '/ai-copilot?tab=interview' },
                  { label: 'Salary Negotiator', href: '/ai-copilot?tab=salary' },
                  { label: 'Cover Letter Generator', href: '/ai-copilot?tab=cover-letter' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Architecture & Stack */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-primary" /> Architecture
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2 group cursor-default">
                  <Code2 className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  <span>Next.js 15 App Router</span>
                </li>
                <li className="flex items-center gap-2 group cursor-default">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform" />
                  <span>FastAPI Python Engine</span>
                </li>
                <li className="flex items-center gap-2 group cursor-default">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] group-hover:scale-110 transition-transform" />
                  <span>PostgreSQL DB + SQLAlchemy</span>
                </li>
                <li className="flex items-center gap-2 group cursor-default">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)] group-hover:scale-110 transition-transform" />
                  <span>Tailwind CSS v4</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-muted-foreground order-2 md:order-1">
              © {new Date().getFullYear()} JobSift. Engineered for the modern job seeker.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 order-1 md:order-2">
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground hover:-translate-y-0.5 transition-all duration-200" aria-label="Twitter">
                <TwitterIcon className="w-5 h-5" />
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground hover:-translate-y-0.5 transition-all duration-200" aria-label="GitHub">
                <GithubIcon className="w-5 h-5" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground hover:-translate-y-0.5 transition-all duration-200" aria-label="LinkedIn">
                <LinkedinIcon className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground order-3 md:order-3 bg-secondary/30 px-3 py-1.5 rounded-full">
              <span>Brewed with</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span>& AI Precision</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

