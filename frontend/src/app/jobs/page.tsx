'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { jobsApi } from '@/lib/api';
import { Job } from '@/types';
import { MOCK_JOBS } from '@/lib/mockData';
import { JobCard } from '@/components/jobs/JobCard';
import { JobDetailModal } from '@/components/jobs/JobDetailModal';
import { ApplyModal } from '@/components/jobs/ApplyModal';
import {
  Briefcase, Search, Filter, MapPin, DollarSign,
  Sparkles, SlidersHorizontal, ArrowUpDown, X, Check
} from 'lucide-react';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [isLoading, setIsLoading] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [workplaceType, setWorkplaceType] = useState('All');
  const [experienceLevel, setExperienceLevel] = useState('All');
  const [department, setDepartment] = useState('All');
  const [minSalary, setMinSalary] = useState<number>(0);
  const [sortBy, setSortBy] = useState('recent');

  // Modals
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await jobsApi.getJobs({
        q: searchQuery,
        location: location !== 'All' ? location : undefined,
        workplace_type: workplaceType !== 'All' ? workplaceType : undefined,
        experience_level: experienceLevel !== 'All' ? experienceLevel : undefined,
        department: department !== 'All' ? department : undefined,
        min_salary: minSalary > 0 ? minSalary : undefined,
        sort_by: sortBy,
      });
      if (data && data.length > 0) setJobs(data);
      else setJobs([]);
    } catch {
      // Local filter fallback
      let filtered = [...MOCK_JOBS];
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.company.toLowerCase().includes(q) ||
            j.tech_stack.some((t) => t.toLowerCase().includes(q))
        );
      }
      if (workplaceType !== 'All') {
        filtered = filtered.filter((j) => j.workplace_type === workplaceType);
      }
      if (experienceLevel !== 'All') {
        filtered = filtered.filter((j) => j.experience_level === experienceLevel);
      }
      if (minSalary > 0) {
        filtered = filtered.filter((j) => j.salary_max >= minSalary);
      }
      setJobs(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, location, workplaceType, experienceLevel, department, minSalary, sortBy]);

  // Check if job ID is in URL
  useEffect(() => {
    const jobIdParam = searchParams.get('id');
    if (jobIdParam) {
      const target = jobs.find((j) => j.id === parseInt(jobIdParam));
      if (target) {
        setSelectedJob(target);
        setIsJobModalOpen(true);
      }
    }
  }, [searchParams, jobs]);

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleStartApply = (job: Job) => {
    setIsJobModalOpen(false);
    setApplyingJob(job);
    setIsApplyModalOpen(true);
  };

  const handleToggleSave = async (jobId: number) => {
    try {
      const res = await jobsApi.toggleSaveJob(jobId);
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, is_saved: res.saved } : j))
      );
    } catch {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, is_saved: !j.is_saved } : j))
      );
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('All');
    setWorkplaceType('All');
    setExperienceLevel('All');
    setDepartment('All');
    setMinSalary(0);
    setSortBy('recent');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Unified Job Board
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Explore Opportunities with AI Fit & Insider Intel
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/recruiter')}
            className="px-4 py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>Post a Job Opening</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Job Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-primary" /> Filter Roles
              </h3>
              <button
                onClick={clearFilters}
                className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Keywords / Tech Stack</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Next.js, Python, Staff"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Workplace Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Workplace Policy</label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary cursor-pointer"
              >
                <option value="All">All Workplace Types</option>
                <option value="Remote">100% Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary cursor-pointer"
              >
                <option value="All">All Experience Levels</option>
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Staff">Staff / Principal</option>
              </select>
            </div>

            {/* Min Salary Range */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>Minimum Salary</span>
                <span className="text-primary">${minSalary > 0 ? `${(minSalary / 1000).toFixed(0)}k/yr` : 'Any'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="300000"
                step="25000"
                value={minSalary}
                onChange={(e) => setMinSalary(parseInt(e.target.value) || 0)}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>$0</span>
                <span>$150k</span>
                <span>$300k+</span>
              </div>
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Sort Order</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="salary">Highest Compensation</option>
                <option value="popular">Most Popular & Views</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs List Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Showing <strong className="text-foreground">{jobs.length}</strong> opportunities</span>
            <span>Matched to your verified profile</span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Loading verified opportunities...
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 rounded-2xl border border-dashed border-border text-center space-y-3">
              <Briefcase className="w-10 h-10 text-muted-foreground mx-auto" />
              <h3 className="font-bold text-base text-foreground">No matching positions found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try widening your salary filters, selecting "All Workplace Types", or clearing keyword search.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id && isJobModalOpen}
                  onSelect={handleSelectJob}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onApply={handleStartApply}
        onToggleSave={handleToggleSave}
      />

      <ApplyModal
        job={applyingJob}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => {
          router.push('/tracker');
        }}
      />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading Jobs...</div>}>
      <JobsContent />
    </Suspense>
  );
}
