'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { communityApi } from '@/lib/api';
import { CommunityPost, CommunityChannel } from '@/types';
import { MOCK_COMMUNITY_POSTS } from '@/lib/mockData';
import { PostCard } from '@/components/community/PostCard';
import { PostDetailModal } from '@/components/community/PostDetailModal';
import { CreatePostModal } from '@/components/community/CreatePostModal';
import {
  MessageSquare, Plus, Search, Sparkles, TrendingUp,
  Award, ShieldCheck, Filter, Hash, CheckCircle2
} from 'lucide-react';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const CHANNELS: { id: string; label: string; icon: any; count: number }[] = [
  { id: 'all', label: 'All Discussions', icon: Hash, count: 240 },
  { id: 'interview-prep', label: '#interview-prep', icon: Sparkles, count: 85 },
  { id: 'salary-talk', label: '#salary-talk', icon: TrendingUp, count: 62 },
  { id: 'resume-review', label: '#resume-review', icon: Award, count: 48 },
  { id: 'referrals', label: '#referrals', icon: ShieldCheck, count: 31 },
  { id: 'company-culture', label: '#company-culture', icon: MessageSquare, count: 14 },
];

function CommunityContent() {
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [selectedChannel, setSelectedChannel] = useState<string>(searchParams.get('channel') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('hot');

  // Modals
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      const data = await communityApi.getPosts({
        channel: selectedChannel !== 'all' ? selectedChannel : undefined,
        search: searchQuery || undefined,
        sort_by: sortBy,
      });
      if (data && data.length > 0) setPosts(data);
    } catch {
      // Local fallback filter
      let filtered = [...MOCK_COMMUNITY_POSTS];
      if (selectedChannel !== 'all') {
        filtered = filtered.filter((p) => p.channel === selectedChannel);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q) ||
            (p.linked_company && p.linked_company.toLowerCase().includes(q))
        );
      }
      setPosts(filtered);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedChannel, searchQuery, sortBy]);

  // Check URL params for specific post
  useEffect(() => {
    const postIdParam = searchParams.get('post');
    if (postIdParam) {
      const target = posts.find((p) => p.id === parseInt(postIdParam));
      if (target) {
        setSelectedPost(target);
        setIsPostModalOpen(true);
      }
    }
  }, [searchParams, posts]);

  const handleUpvote = async (postId: number) => {
    try {
      const res = await communityApi.upvotePost(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, upvotes: res.upvotes } : p))
      );
    } catch {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p))
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> Community Discussions
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Insider Debriefs, Interview Truths & Salary Talk
          </h1>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Main Grid: Channels Sidebar + Posts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left: Channels Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border space-y-2 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">
              Channels
            </h3>
            <div className="space-y-1">
              {CHANNELS.map((ch) => {
                const Icon = ch.icon;
                const active = selectedChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChannel(ch.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-primary/10 text-primary font-bold shadow-2xs'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{ch.label}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-mono">
                      {ch.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Karma Info Card */}
          <div className="p-4 rounded-2xl bg-secondary/15 border border-secondary/30 text-xs text-secondary-foreground space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Karma & Reputation
            </div>
            <p className="text-[11px] leading-relaxed">
              Earn +15 Karma for publishing debriefs, +5 for helpful answers, and +50 for referring applicants.
            </p>
          </div>
        </div>

        {/* Right: Posts Feed & Filters */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search debriefs, interview questions, or company..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border-none bg-muted/40 text-foreground text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0 text-xs">
              <button
                onClick={() => setSortBy('hot')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  sortBy === 'hot' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                Hot
              </button>
              <button
                onClick={() => setSortBy('top')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  sortBy === 'top' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                Top Rated
              </button>
              <button
                onClick={() => setSortBy('new')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  sortBy === 'new' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                Latest
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="p-12 rounded-2xl border border-dashed border-border text-center space-y-3">
                <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto" />
                <h3 className="font-bold text-base text-foreground">No discussions found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Be the first to start a conversation in this channel or clear your search filter.
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs cursor-pointer"
                >
                  Start Discussion
                </button>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onSelect={(p) => {
                    setSelectedPost(p);
                    setIsPostModalOpen(true);
                  }}
                  onUpvote={handleUpvote}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PostDetailModal
        post={selectedPost}
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onUpvote={handleUpvote}
      />

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchPosts}
      />
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading Community Discussions...</div>}>
      <CommunityContent />
    </Suspense>
  );
}
