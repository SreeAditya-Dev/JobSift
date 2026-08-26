'use client';

import React, { useState, useEffect } from 'react';
import { CommunityPost, PostComment } from '@/types';
import { communityApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  X, MessageSquare, ChevronUp, CheckCircle2, Send,
  Briefcase, CornerDownRight, Sparkles, ShieldCheck
} from 'lucide-react';

interface PostDetailModalProps {
  post: CommunityPost | null;
  isOpen: boolean;
  onClose: () => void;
  onUpvote?: (postId: number) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  isOpen,
  onClose,
  onUpvote,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post && isOpen) {
      communityApi
        .getPostComments(post.id)
        .then((data) => setComments(data))
        .catch(() => {
          // Mock comments fallback
          setComments([
            {
              id: 1,
              post_id: post.id,
              author_id: 1,
              content: 'Fantastic insights! This completely changes how I approach the first 10 minutes of technical interview rounds.',
              upvotes: 12,
              is_anonymous: false,
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
              author_name: 'Alex Rivera',
              author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              author_headline: 'Senior Full-Stack Engineer',
              replies: [
                {
                  id: 2,
                  post_id: post.id,
                  author_id: 3,
                  parent_id: 1,
                  content: 'Glad it helped! Remember to always lead with clear requirements before jumping into diagram boxes.',
                  upvotes: 8,
                  is_anonymous: false,
                  created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
                  author_name: 'David Kim',
                  author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                  author_headline: 'Staff SWE @ Google Cloud',
                }
              ]
            }
          ]);
        });
    }
  }, [post, isOpen]);

  if (!isOpen || !post) return null;

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const added = await communityApi.addComment(post.id, {
        content: newComment,
        parent_id: replyToId,
        is_anonymous: isAnonymous,
      });

      // Update state
      if (replyToId) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === replyToId
              ? { ...c, replies: [...(c.replies || []), added] }
              : c
          )
        );
      } else {
        setComments((prev) => [added, ...prev]);
      }
      setNewComment('');
      setReplyToId(null);
    } catch {
      // Mock local update
      const mockNew: PostComment = {
        id: Date.now(),
        post_id: post.id,
        author_id: user?.id || 1,
        content: newComment,
        upvotes: 1,
        is_anonymous: isAnonymous,
        created_at: new Date().toISOString(),
        author_name: isAnonymous ? 'Anonymous Insider' : (user?.full_name || 'Alex Rivera'),
        author_avatar: isAnonymous ? '' : (user?.avatar_url || ''),
        author_headline: isAnonymous ? '' : (user?.headline || ''),
        replies: [],
      };
      setComments((prev) => [mockNew, ...prev]);
      setNewComment('');
      setReplyToId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-3xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full font-bold bg-secondary text-secondary-foreground">
              #{post.channel}
            </span>
            {post.linked_company && (
              <span className="px-2 py-0.5 rounded bg-muted text-foreground font-medium flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-muted-foreground" /> {post.linked_company}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
          {/* Post Header & Author */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{post.title}</h2>
              <div className="flex items-center gap-2.5 mt-2 text-xs text-muted-foreground">
                <img
                  src={post.is_anonymous ? 'https://api.dicebear.com/7.x/bottts/svg?seed=anonymous' : (post.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')}
                  alt="Author"
                  className="w-7 h-7 rounded-full object-cover border border-border"
                />
                <div>
                  <span className="font-bold text-foreground">
                    {post.is_anonymous ? 'Anonymous Insider' : post.author_name}
                  </span>
                  {post.author_headline && !post.is_anonymous && (
                    <span className="ml-1 text-muted-foreground">• {post.author_headline}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => onUpvote && onUpvote(post.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs border border-primary/20 cursor-pointer"
            >
              <ChevronUp className="w-4 h-4" />
              <span>{post.upvotes} Upvotes</span>
            </button>
          </div>

          {/* Post Body */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border text-foreground leading-relaxed whitespace-pre-line text-xs sm:text-sm">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span key={t} className="text-[11px] px-2.5 py-0.5 rounded bg-accent text-foreground font-mono">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <div className="pt-4 border-t border-border space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span>Discussion & Insider Debriefs ({comments.length})</span>
            </h3>

            {/* Comment List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 rounded-xl bg-card border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={comment.is_anonymous ? 'https://api.dicebear.com/7.x/bottts/svg?seed=anon' : (comment.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')}
                        alt="Commenter"
                        className="w-6 h-6 rounded-full object-cover border border-border"
                      />
                      <span className="font-bold text-foreground">
                        {comment.is_anonymous ? 'Anonymous Insider' : comment.author_name}
                      </span>
                      {comment.author_headline && !comment.is_anonymous && (
                        <span className="text-[11px] text-muted-foreground hidden sm:inline">• {comment.author_headline}</span>
                      )}
                    </div>
                    <span className="text-muted-foreground text-[11px]">▲ {comment.upvotes}</span>
                  </div>

                  <p className="text-xs text-foreground leading-relaxed pl-8">{comment.content}</p>

                  <div className="pl-8 pt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <button
                      onClick={() => setReplyToId(comment.id)}
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-8 pt-2 space-y-2 border-l-2 border-primary/20 ml-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="p-3 rounded-lg bg-muted/40 border border-border/80 text-xs space-y-1">
                          <div className="flex items-center gap-2 font-bold text-foreground">
                            <CornerDownRight className="w-3.5 h-3.5 text-primary" />
                            <span>{reply.is_anonymous ? 'Anonymous Insider' : reply.author_name}</span>
                            {reply.author_headline && <span className="text-[10px] text-muted-foreground font-normal">({reply.author_headline})</span>}
                          </div>
                          <p className="text-muted-foreground pl-5">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comment Form Bottom Bar */}
        <form onSubmit={handleAddComment} className="p-4 border-t border-border bg-card space-y-2">
          {replyToId && (
            <div className="flex items-center justify-between text-xs text-primary bg-primary/10 px-3 py-1 rounded-md">
              <span>Replying to comment #{replyToId}</span>
              <button onClick={() => setReplyToId(null)} className="font-bold cursor-pointer">Cancel</button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your interview experience, advice, or ask a question..."
              className="flex-1 p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-4 py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-border text-primary"
              />
              <span>Post Anonymously (Hide profile)</span>
            </label>
            <span>Earn +5 Karma per helpful comment</span>
          </div>
        </form>
      </div>
    </div>
  );
};
