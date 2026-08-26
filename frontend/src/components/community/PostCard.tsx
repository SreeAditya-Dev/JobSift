'use client';

import React from 'react';
import { CommunityPost } from '@/types';
import {
  MessageSquare, ChevronUp, ChevronDown, CheckCircle2,
  Tag, ShieldCheck, UserCheck, Briefcase, Eye, Sparkles
} from 'lucide-react';

interface PostCardProps {
  post: CommunityPost;
  onSelect: (post: CommunityPost) => void;
  onUpvote?: (postId: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onSelect, onUpvote }) => {
  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case 'interview-prep':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'salary-talk':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'referrals':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'resume-review':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-secondary/30 text-secondary-foreground border-secondary/40';
    }
  };

  return (
    <div
      onClick={() => onSelect(post)}
      className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all cursor-pointer flex gap-4 items-start"
    >
      {/* Upvote Box */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (onUpvote) onUpvote(post.id);
        }}
        className="flex flex-col items-center justify-center p-2 rounded-xl bg-muted/60 hover:bg-primary/10 border border-border/80 text-muted-foreground hover:text-primary transition-colors shrink-0 cursor-pointer min-w-[44px]"
      >
        <ChevronUp className="w-5 h-5" />
        <span className="font-bold text-xs text-foreground mt-0.5">{post.upvotes}</span>
      </div>

      {/* Main Post Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getChannelBadge(post.channel)}`}>
            #{post.channel}
          </span>

          {post.linked_company && (
            <span className="px-2 py-0.5 rounded-md bg-muted text-foreground text-[11px] font-medium flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-muted-foreground" />
              {post.linked_company}
            </span>
          )}

          {post.is_solved && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> SOLVED / VERIFIED
            </span>
          )}
        </div>

        {/* Post Title */}
        <h3 className="font-bold text-base text-foreground hover:text-primary transition-colors leading-snug">
          {post.title}
        </h3>

        {/* Content Snippet */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-accent text-foreground font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Meta */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground border-t border-border/40">
          <div className="flex items-center gap-2">
            {!post.is_anonymous && post.author_avatar ? (
              <img
                src={post.author_avatar}
                alt={post.author_name || 'Author'}
                className="w-5 h-5 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                ?
              </div>
            )}
            <span className="font-medium text-foreground">
              {post.is_anonymous ? 'Anonymous Insider' : post.author_name}
            </span>
            {post.author_company && !post.is_anonymous && (
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                ({post.author_company})
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px]">
              <Eye className="w-3.5 h-3.5" /> {post.views_count} views
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-foreground">
              <MessageSquare className="w-3.5 h-3.5 text-primary" /> {post.comments_count} replies
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
