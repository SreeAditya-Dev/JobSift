'use client';

import React, { useState } from 'react';
import { aiApi } from '@/lib/api';
import { TrendingUp, Award, Copy, Check, DollarSign, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const SalaryNegotiator: React.FC = () => {
  const [roleTitle, setRoleTitle] = useState('Senior Full-Stack Engineer');
  const [experienceYears, setExperienceYears] = useState(5.5);
  const [location, setLocation] = useState('San Francisco, CA');
  const [isCalculating, setIsCalculating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [data, setData] = useState<any>({
    role_title: 'Senior Full-Stack Engineer',
    location: 'San Francisco, CA',
    p25_salary: 195000,
    median_salary: 235000,
    p75_salary: 275000,
    p90_salary: 320000,
    currency: 'USD',
    equity_range_percent: '0.08% - 0.22% ($60k - $120k/yr RSUs)',
    top_paying_skills: ['Distributed Systems', 'TypeScript', 'Next.js', 'FastAPI', 'Kubernetes', 'AWS'],
    negotiation_leverage_tips: [
      'Never anchor with a single low number; provide a target band with your top 75th percentile ($275k).',
      'Emphasize unique cross-functional impact (e.g. bridging frontend velocity with robust backend architecture).',
      'Negotiate non-base components: signing bonus ($20k+), annual refreshers, early vesting cliffs, or extra PTO.'
    ],
    counter_offer_script:
      'Thank you for this exciting offer! Based on current market benchmarks for a Senior Full-Stack Engineer with my track record in distributed web architecture in San Francisco, I was anticipating a total compensation package closer to $275,000. If we can align closer to that number or adjust the equity component, I am ready to sign immediately.'
  });

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const res = await aiApi.getSalaryBenchmark({
        role_title: roleTitle,
        experience_years: Number(experienceYears),
        location,
      });
      setData(res);
    } catch {
      // Keep state
    } finally {
      setIsCalculating(false);
    }
  };

  const copyScript = () => {
    if (data?.counter_offer_script) {
      navigator.clipboard.writeText(data.counter_offer_script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-lg space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground">Salary Benchmark & AI Counter-Offer Copilot</h2>
            <p className="text-xs text-muted-foreground">
              Real-time compensation distributions, equity multipliers, and proven negotiation battle scripts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Role Title</label>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-semibold outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Years of Experience</label>
            <input
              type="number"
              step="0.5"
              value={experienceYears}
              onChange={(e) => setExperienceYears(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-semibold outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., San Francisco, CA / Remote / Seattle"
              className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-semibold outline-none focus:border-primary"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="w-full py-3.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>{isCalculating ? 'Computing Market Benchmarks...' : 'Calculate Market Distribution & Script'}</span>
        </button>
      </div>

      {/* Compensation Visualizer */}
      {data && (
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-lg space-y-8 animate-in fade-in duration-200">
          {/* Percentile Cards */}
          <div>
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Total Compensation Percentiles ({data.location})</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-muted/40 border border-border">
                <div className="text-xs text-muted-foreground font-semibold">25th Percentile</div>
                <div className="text-2xl font-black text-foreground mt-1">${(data.p25_salary / 1000).toFixed(0)}k</div>
                <div className="text-[10px] text-muted-foreground">Standard Base</div>
              </div>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                <div className="text-xs text-primary font-bold">Median / Target</div>
                <div className="text-2xl font-black text-primary mt-1">${(data.median_salary / 1000).toFixed(0)}k</div>
                <div className="text-[10px] text-primary">Market Average</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">75th Percentile</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">${(data.p75_salary / 1000).toFixed(0)}k</div>
                <div className="text-[10px] text-emerald-600">Top Tier Comp</div>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <div className="text-xs text-purple-700 dark:text-purple-400 font-bold">90th Percentile</div>
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">${(data.p90_salary / 1000).toFixed(0)}k</div>
                <div className="text-[10px] text-purple-600">Staff / FAANG Scale</div>
              </div>
            </div>
          </div>

          {/* Equity & High-value skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 rounded-xl bg-muted/20 border border-border space-y-2">
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" /> Typical Equity Grant
              </h4>
              <p className="text-sm font-bold text-foreground">{data.equity_range_percent}</p>
              <p className="text-muted-foreground leading-relaxed">
                Standard 4-year vesting schedule with 1-year cliff. Startups may offer higher percentage grants (0.25% - 0.5%).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-muted/20 border border-border space-y-2">
              <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> Highest Leverage Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {data.top_paying_skills.map((s: string) => (
                  <span key={s} className="px-2.5 py-1 rounded-md bg-accent text-foreground font-mono font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Negotiation Battle Card Script */}
          <div className="p-6 rounded-2xl bg-secondary/15 border border-secondary/40 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-secondary-foreground text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI-Generated Counter-Offer Script
              </h4>
              <button
                onClick={copyScript}
                className="px-3 py-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-accent text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Script'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border text-foreground text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium shadow-xs">
              {data.counter_offer_script}
            </div>

            {/* Negotiation Tips */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold text-secondary-foreground uppercase tracking-wide block">
                3 Key Negotiation Rules:
              </span>
              <ul className="space-y-1 text-xs text-secondary-foreground/90">
                {data.negotiation_leverage_tips.map((tip: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-foreground shrink-0 mt-1.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
