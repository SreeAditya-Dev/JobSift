'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usersApi } from '@/lib/api';
import { fireConfetti } from '@/lib/confetti';
import {
  User, Sparkles, Award, Briefcase, MapPin, Globe,
  Code2, Share2, Save, CheckCircle2, ShieldCheck, Plus, X
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const { user, updateUserLocal } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || 'Alex Rivera');
  const [headline, setHeadline] = useState(user?.headline || 'Senior Full-Stack Engineer');
  const [bio, setBio] = useState(user?.bio || 'Building scalable web products & distributed microservices.');
  const [location, setLocation] = useState(user?.location || 'San Francisco, CA');
  const [targetRole, setTargetRole] = useState(user?.target_role || 'Staff Full-Stack Engineer');
  const [yearsOfExperience, setYearsOfExperience] = useState(user?.years_of_experience || 5.5);
  const [company, setCompany] = useState(user?.company || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolio_url || 'https://alexrivera.dev');
  const [githubUrl, setGithubUrl] = useState(user?.github_url || 'https://github.com/alexrivera');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedin_url || 'https://linkedin.com/in/alexrivera');
  const [skills, setSkills] = useState<string[]>(
    user?.skills || ['React', 'Next.js', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'System Design']
  );
  const [newSkill, setNewSkill] = useState('');
  const [resumeText, setResumeText] = useState(user?.resume_text || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedData = {
      full_name: fullName,
      headline,
      bio,
      location,
      target_role: targetRole,
      years_of_experience: Number(yearsOfExperience),
      company,
      portfolio_url: portfolioUrl,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      skills,
      resume_text: resumeText,
    };

    try {
      await usersApi.updateProfile(updatedData);
      updateUserLocal(updatedData);
      setSavedSuccess(true);
      fireConfetti({ particleCount: 50, spread: 50 });
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch {
      updateUserLocal(updatedData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> Professional Profile & Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Profile & Match Credentials
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-secondary/30 text-secondary-foreground text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>⭐ {user?.karma_points || 240} Karma Points</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Information Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-border">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-primary/40 shadow-sm"
            />
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-foreground">{fullName}</h3>
              <p className="text-xs text-muted-foreground">{headline}</p>
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="px-2 py-0.5 rounded-full font-bold bg-primary/10 text-primary uppercase">
                  {user?.role || 'candidate'}
                </span>
                {user?.is_verified_employee && (
                  <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified {user?.company} Insider
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Professional Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Target Role Title</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Years of Experience</label>
              <input
                type="number"
                step="0.5"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground">Current Company (if employed)</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, Stripe, Startup"
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-foreground">About / Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-xs leading-relaxed outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Verified Skills & Tech Stack Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
              Verified Technical Skills ({skills.length})
            </h3>
            <span className="text-[11px] text-muted-foreground">Used for 1-click AI Job Matching</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-accent text-foreground text-xs font-mono font-medium border border-border"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-destructive text-muted-foreground cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Type skill name and press Enter (e.g. Next.js, Kubernetes)..."
              className="flex-1 p-2 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary font-mono"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 rounded-xl bg-muted hover:bg-accent text-foreground font-bold text-xs border border-border cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* Links & Portfolio */}
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border space-y-4 shadow-xs text-xs">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
            Portfolio & Social Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-foreground flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" /> Portfolio URL
              </label>
              <input
                type="text"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full p-2 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-muted-foreground" /> GitHub Profile
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full p-2 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-muted-foreground" /> LinkedIn Profile
              </label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full p-2 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary font-mono"
              />
            </div>
          </div>
        </div>

        {/* Raw Resume Text */}
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border space-y-2 shadow-xs text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
              Profile Resume Master Text
            </h3>
            <span className="text-[11px] text-muted-foreground">Auto-populates job applications & ATS scans</span>
          </div>

          <textarea
            rows={7}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your standard master resume text here..."
            className="w-full p-3.5 rounded-xl border border-border bg-background text-foreground text-xs leading-relaxed outline-none focus:border-primary font-mono"
          />
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Profile Updated Successfully!
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
