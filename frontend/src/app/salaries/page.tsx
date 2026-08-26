'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { salariesApi } from '@/lib/api';
import { SalaryReport } from '@/types';
import {
  TrendingUp, DollarSign, Search, ShieldCheck,
  Building, MapPin, Sparkles, Award, ArrowRight
} from 'lucide-react';

export default function SalariesPage() {
  const router = useRouter();
  const [salaries, setSalaries] = useState<SalaryReport[]>([]);
  const [summary, setSummary] = useState({
    average_total_comp: 371000,
    max_total_comp: 580000,
    min_total_comp: 265000,
    total_submissions: 5,
  });
  const [companyQuery, setCompanyQuery] = useState('');
  const [titleQuery, setTitleQuery] = useState('');

  const fetchSalaries = async () => {
    try {
      const data = await salariesApi.getSalaries(companyQuery || undefined, titleQuery || undefined);
      if (data && data.reports) {
        setSalaries(data.reports);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error("Failed to fetch salaries:", error);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [companyQuery, titleQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" /> Compensation Transparency
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Verified Salary & Total Comp Intelligence
          </h1>
        </div>

        <button
          onClick={() => router.push('/ai-copilot?tab=salary')}
          className="px-4 py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch AI Negotiator</span>
        </button>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
          <div className="text-xs text-muted-foreground font-semibold">Average Senior Comp</div>
          <div className="text-2xl font-black text-foreground">${(summary.average_total_comp / 1000).toFixed(0)}k/yr</div>
          <div className="text-[10px] text-emerald-600">Base + Equity + Bonus</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
          <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Top Verified TC</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${(summary.max_total_comp / 1000).toFixed(0)}k/yr</div>
          <div className="text-[10px] text-emerald-600">Google Staff L6</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-xs">
          <div className="text-xs text-muted-foreground font-semibold">Verified Submissions</div>
          <div className="text-2xl font-black text-foreground">{salaries.length} Reports</div>
          <div className="text-[10px] text-primary">W2 & Offer Verified</div>
        </div>

        <div className="p-5 rounded-2xl bg-secondary/15 border border-secondary/30 space-y-1 shadow-xs">
          <div className="text-xs text-secondary-foreground font-semibold">AI Counter-Offer</div>
          <div className="text-2xl font-black text-foreground">+22% Boost</div>
          <div className="text-[10px] text-secondary-foreground">Average negotiation lift</div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={companyQuery}
            onChange={(e) => setCompanyQuery(e.target.value)}
            placeholder="Filter by company (e.g. Google, Stripe, OpenAI)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
          />
        </div>

        <div className="relative flex-1 w-full">
          <Building className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={titleQuery}
            onChange={(e) => setTitleQuery(e.target.value)}
            placeholder="Filter by role title (e.g. Full-Stack, Staff, Designer)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Salary Reports Table / Cards */}
      <div className="space-y-3">
        {salaries.map((report) => (
          <div
            key={report.id}
            className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted border border-border p-1 flex items-center justify-center font-bold text-primary shrink-0">
                <Building className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-foreground">{report.company}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {report.level}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="font-semibold text-xs text-primary">{report.title}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {report.location}
                  </span>
                  <span>•</span>
                  <span>{report.years_of_experience} yrs YOE</span>
                </div>
              </div>
            </div>

            {/* Compensation Breakdown */}
            <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
              <div className="text-left md:text-right text-xs">
                <div className="text-muted-foreground">
                  Base: ${(report.base_salary / 1000).toFixed(0)}k • Equity: ${(report.equity / 1000).toFixed(0)}k
                  {report.bonus ? ` • Bonus: $${(report.bonus / 1000).toFixed(0)}k` : ''}
                </div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ${(report.total_comp / 1000).toFixed(0)}k <span className="text-xs font-semibold text-muted-foreground">/ yr TC</span>
                </div>
              </div>

              <button
                onClick={() =>
                  router.push(
                    `/ai-copilot?tab=salary&roleTitle=${encodeURIComponent(report.title)}&location=${encodeURIComponent(report.location)}`
                  )
                }
                className="px-3 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 text-xs font-semibold shrink-0 cursor-pointer"
              >
                Benchmark AI →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
