'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { jobsApi, communityApi, referralsApi } from '@/lib/api';
import { Job, CommunityPost, ReferralListing } from '@/types';
import { MOCK_JOBS, MOCK_COMMUNITY_POSTS, MOCK_REFERRAL_LISTINGS } from '@/lib/mockData';
import { JobCard } from '@/components/jobs/JobCard';
import { JobDetailModal } from '@/components/jobs/JobDetailModal';
import { ApplyModal } from '@/components/jobs/ApplyModal';
import { PostCard } from '@/components/community/PostCard';
import { PostDetailModal } from '@/components/community/PostDetailModal';
import { ReferralCard } from '@/components/referrals/ReferralCard';
import { RequestReferralModal } from '@/components/referrals/RequestReferralModal';
import {
  Coffee, Search, Sparkles, Briefcase, MessageSquare, Award,
  Columns3, Bot, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp,
  Zap, Users, Compass, ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');

  // Datasets
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>(MOCK_JOBS.slice(0, 3));
  const [trendingPosts, setTrendingPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS.slice(0, 2));
  const [activeReferrals, setActiveReferrals] = useState<ReferralListing[]>(MOCK_REFERRAL_LISTINGS.slice(0, 3));

  // Modals state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const [requestingListing, setRequestingListing] = useState<ReferralListing | null>(null);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  useEffect(() => {
    // Load live data from FastAPI backend with graceful fallback
    jobsApi.getJobs({ sort_by: 'popular' }).then((data) => {
      if (data && data.length > 0) setFeaturedJobs(data.slice(0, 3));
    }).catch(() => {});

    communityApi.getPosts({ sort_by: 'hot' }).then((data) => {
      if (data && data.length > 0) setTrendingPosts(data.slice(0, 2));
    }).catch(() => {});

    referralsApi.getListings().then((data) => {
      if (data && data.length > 0) setActiveReferrals(data.slice(0, 3));
    }).catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedLocation && selectedLocation !== 'All') params.append('location', selectedLocation);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleOpenJob = (job: Job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleStartApply = (job: Job) => {
    setIsJobModalOpen(false);
    setApplyingJob(job);
    setIsApplyModalOpen(true);
  };

  const handleOpenPost = (post: CommunityPost) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };

  const handleRequestReferral = (listing: ReferralListing) => {
    setRequestingListing(listing);
    setIsReferralModalOpen(true);
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden p-6 sm:p-12 lg:p-16 border border-border bg-gradient-to-b from-[#644a40]/10 via-secondary/15 to-card text-center space-y-6 shadow-sm">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/30 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary/40 border border-secondary text-secondary-foreground text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rethinking the Fragmented Job Search</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Stop switching between 6 different apps. <br className="hidden sm:inline" />
          Meet the <span className="text-primary underline decoration-secondary decoration-wavy decoration-2">Unified Career OS</span>.
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Discover verified opportunities, unlock authentic employee interview debriefs, request referrals from insider networks, and ace your preparation with an interactive AI copilot—all in one place.
        </p>

        {/* Unified Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-3xl mx-auto p-2 sm:p-2.5 rounded-2xl bg-card border border-border shadow-xl flex flex-col sm:flex-row items-center gap-2 text-xs"
        >
          <div className="flex items-center gap-2 px-3 flex-1 w-full">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, skill (e.g. Next.js, FastAPI), or company..."
              className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-xs sm:text-sm py-2"
            />
          </div>

          <div className="h-6 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2 w-full sm:w-auto px-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full sm:w-auto bg-transparent border-none outline-none text-foreground text-xs py-2 cursor-pointer font-medium"
            >
              <option value="All">All Locations & Remote</option>
              <option value="Remote">Remote Only</option>
              <option value="San Francisco">San Francisco, CA</option>
              <option value="Sunnyvale">Sunnyvale / Silicon Valley</option>
              <option value="Seattle">Seattle, WA</option>
              <option value="New York">New York, NY</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <span>Explore Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Popular:</span>
          {['Next.js & React', 'FastAPI Microservices', 'Stripe SWE', 'Google Cloud L5', 'Design Systems', 'AI / LLM Engineers'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setSearchQuery(tag);
                router.push(`/jobs?q=${encodeURIComponent(tag)}`);
              }}
              className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-accent border border-border/60 text-foreground transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* 2. THE 4 PILLARS OF INNOVATION */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">The Innovation</span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            What JobSift Does That Traditional Platforms Can't
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Traditional job boards keep applications, community discussions, employee referrals, and interview prep in isolated silos. JobSift ties them into a single interconnected graph.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-3 hover:border-primary/40 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">Living Job Canvas</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every job opening includes verified company insider debriefs, active referrers, and real-time AI skill-gap radar right beside the specs.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-3 hover:border-primary/40 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-secondary/40 text-secondary-foreground flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">Verified Referral Market</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Direct matchmaking with verified Google, Stripe, and Figma employees who opt-in to refer qualified candidates with anti-spam karma escrows.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-3 hover:border-primary/40 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">Insider Discussions</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Threaded Reddit/Blind style community with channel categories, verified tags, salary breakdown truths, and nested solutions.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-3 hover:border-primary/40 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">AI Career Copilot</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ATS resume fit scanner, dynamic STAR mock interview coaching with live rubric feedback, and salary negotiation counter scripts.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED JOB OPPORTUNITIES WITH AI MATCH */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">High-Fit Roles</span>
            <h2 className="text-2xl font-black text-foreground">Featured Job Opportunities</h2>
          </div>
          <button
            onClick={() => router.push('/jobs')}
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            <span>View All Jobs</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={handleOpenJob}
              onToggleSave={() => {}}
            />
          ))}
        </div>
      </section>

      {/* 4. HOT INSIDER DEBRIEFS & DISCUSSIONS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-secondary-foreground uppercase tracking-wider">Unfiltered Insights</span>
            <h2 className="text-2xl font-black text-foreground">Hot Community Discussions & Debriefs</h2>
          </div>
          <button
            onClick={() => router.push('/community')}
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            <span>Explore Community</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trendingPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onSelect={handleOpenPost}
              onUpvote={() => {}}
            />
          ))}
        </div>
      </section>

      {/* 5. VERIFIED REFERRALS SPOTLIGHT */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Insider Network</span>
            <h2 className="text-2xl font-black text-foreground">Verified Referral Marketplace</h2>
          </div>
          <button
            onClick={() => router.push('/referrals')}
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            <span>Browse All Referrers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeReferrals.map((listing) => (
            <ReferralCard
              key={listing.id}
              listing={listing}
              onRequest={handleRequestReferral}
            />
          ))}
        </div>
      </section>

      {/* 6. AI COPILOT CTA BANNER */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#644a40] via-[#503a31] to-[#3a2923] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 text-center md:text-left max-w-xl">
          <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider border border-secondary/30 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI Career Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to test your resume and practice with AI?
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Run an instant ATS resume scan, simulate real interview questions tailored to any company, and generate counter-offer negotiation scripts with high confidence.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => router.push('/ai-copilot?tab=resume')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-bold text-xs shadow-md hover:bg-amber-200 transition-all cursor-pointer"
          >
            Scan My Resume
          </button>
          <button
            onClick={() => router.push('/ai-copilot?tab=interview')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer"
          >
            Start Mock Interview
          </button>
        </div>
      </section>

      {/* Modals */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onApply={handleStartApply}
      />

      <ApplyModal
        job={applyingJob}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => {
          router.push('/tracker');
        }}
      />

      <PostDetailModal
        post={selectedPost}
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />

      <RequestReferralModal
        listing={requestingListing}
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
        onSuccess={() => {
          router.push('/referrals');
        }}
      />
    </div>
  );
}
