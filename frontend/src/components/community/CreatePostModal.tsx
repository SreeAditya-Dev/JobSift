'use client';

import React, { useState } from 'react';
import { CommunityChannel } from '@/types';
import { communityApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { X, Send, Sparkles, Briefcase, Tag, ShieldCheck } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultChannel?: CommunityChannel;
  defaultCompany?: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultChannel = 'interview-prep',
  defaultCompany = '',
}) => {
  const { user } = useAuth();
  const [channel, setChannel] = useState<CommunityChannel>(defaultChannel);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [linkedCompany, setLinkedCompany] = useState(defaultCompany);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const tagsArray = tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    try {
      await communityApi.createPost({
        channel,
        title,
        content,
        tags: tagsArray,
        linked_company: linkedCompany,
        is_anonymous: isAnonymous,
      });
      onSuccess();
      onClose();
    } catch {
      onSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-foreground">Create Community Discussion</h3>
              <p className="text-xs text-muted-foreground">Share interview debriefs, ask salary questions, or offer advice</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Channel Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Select Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as CommunityChannel)}
              className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
            >
              <option value="interview-prep">#interview-prep (System Design, Coding & Behavioral questions)</option>
              <option value="salary-talk">#salary-talk (Compensation breakdowns & counter-offer scripts)</option>
              <option value="resume-review">#resume-review (ATS keyword critique & bullet rewrites)</option>
              <option value="referrals">#referrals (Looking for or offering employee referrals)</option>
              <option value="company-culture">#company-culture (Inside scoop on WLB & engineering velocity)</option>
              <option value="general">#general (General career conversations)</option>
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Discussion Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Inside Stripe's Technical Screen: 3 pitfalls to avoid..."
              className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-semibold outline-none focus:border-primary"
            />
          </div>

          {/* Linked Company & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-foreground flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Target Company (Optional)</span>
              </label>
              <input
                type="text"
                value={linkedCompany}
                onChange={(e) => setLinkedCompany(e.target.value)}
                placeholder="e.g., Stripe, Google, OpenAI"
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Tags (comma separated)</span>
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., System Design, L5, TypeScript"
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Discussion Body Content */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground">Detailed Content</label>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your experience, breakdown, or question in detail. Formatted bullet points and code blocks are supported..."
              className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-xs leading-relaxed outline-none focus:border-primary font-sans"
            />
          </div>

          {/* Anonymous Toggle */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
            <div>
              <div className="font-bold text-foreground text-xs">Post Anonymously</div>
              <div className="text-[11px] text-muted-foreground">Hides your name and avatar for sensitive salary/interview discussions.</div>
            </div>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded text-primary border-border"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-emerald-600 font-medium">Earn +15 Karma for creating a discussion</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-accent font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Posting...' : 'Publish Thread'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
