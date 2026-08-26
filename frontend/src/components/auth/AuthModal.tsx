'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { fireConfetti } from '@/lib/confetti';
import {
  X, Mail, Lock, User, Briefcase, Award, Sparkles, Building,
  Globe, MapPin, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck,
  AlertCircle, Code2, FileText
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialRole = 'candidate',
}) => {
  const { login, register, isLoading } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [signupStep, setSignupStep] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Common Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');

  // Candidate Specific Fields
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Engineer');
  const [yearsOfExperience, setYearsOfExperience] = useState('5');
  const [location, setLocation] = useState('San Francisco, CA');
  const [skills, setSkills] = useState<string[]>(['React', 'Next.js', 'TypeScript', 'Python', 'PostgreSQL']);
  const [skillInput, setSkillInput] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeText, setResumeText] = useState('');

  // Recruiter Specific Fields
  const [companyName, setCompanyName] = useState('Stripe');
  const [recruiterTitle, setRecruiterTitle] = useState('Principal Talent Partner');
  const [companyWebsite, setCompanyWebsite] = useState('https://stripe.com');
  const [hiringDomain, setHiringDomain] = useState('Engineering & Infrastructure');

  // Employee / Referrer Specific Fields
  const [employeeCompany, setEmployeeCompany] = useState('Google');
  const [employeeTitle, setEmployeeTitle] = useState('Staff Software Engineer');
  const [department, setDepartment] = useState('Google Cloud Core');
  const [yearsAtCompany, setYearsAtCompany] = useState('3.5');
  const [referralGuidelines, setReferralGuidelines] = useState('Looking for engineers with 3+ years experience in distributed systems. Please provide GitHub/portfolio.');

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await login(email, password);
      fireConfetti({ particleCount: 50, spread: 60 });
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.detail || 'Invalid email or password. Please try again.');
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setErrorMessage('');
    let demoEmail = 'alex.rivera@example.com';
    if (role === 'recruiter') demoEmail = 'sarah.chen@stripe.com';
    if (role === 'employee') demoEmail = 'david.kim@google.com';

    try {
      await login(demoEmail, 'password123');
      fireConfetti({ particleCount: 50, spread: 60 });
      setSuccessMessage(`Logged in as ${role.toUpperCase()}!`);
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.detail || 'Quick demo login failed.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    let payload: Record<string, any> = {
      email,
      password,
      full_name: fullName,
      role: selectedRole,
      headline: headline || (selectedRole === 'candidate' ? targetRole : selectedRole === 'recruiter' ? `${recruiterTitle} @ ${companyName}` : `${employeeTitle} @ ${employeeCompany}`),
    };

    if (selectedRole === 'candidate') {
      payload = {
        ...payload,
        target_role: targetRole,
        years_of_experience: parseFloat(yearsOfExperience) || 0,
        location,
        skills,
        portfolio_url: portfolioUrl,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        resume_text: resumeText || `Professional candidate summary for ${fullName} specializing in ${targetRole}.`,
      };
    } else if (selectedRole === 'recruiter') {
      payload = {
        ...payload,
        company: companyName,
        headline: `${recruiterTitle} @ ${companyName}`,
        location,
        portfolio_url: companyWebsite,
        linkedin_url: linkedinUrl,
        bio: `Leading talent acquisition and hiring for ${companyName} across ${hiringDomain}.`,
        is_verified_employee: true,
      };
    } else if (selectedRole === 'employee') {
      payload = {
        ...payload,
        company: employeeCompany,
        headline: `${employeeTitle} @ ${employeeCompany}`,
        location,
        years_of_experience: parseFloat(yearsAtCompany) || 2,
        linkedin_url: linkedinUrl,
        bio: `Working at ${employeeCompany} in ${department}. Referral guidelines: ${referralGuidelines}`,
        is_verified_employee: true,
      };
    }

    try {
      await register(payload);
      fireConfetti({ particleCount: 70, spread: 70 });
      setSuccessMessage('Account created successfully!');
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.detail || 'Failed to create account. Please check your details.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {mode === 'login' ? 'Welcome Back to JobSift' : 'Create Your JobSift Account'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {mode === 'login'
                ? 'Sign in to access your dashboard, applications, and network.'
                : 'Join the next-generation Career Operating System.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Login vs Sign Up) */}
        <div className="grid grid-cols-2 border-b border-border bg-muted/40 p-1">
          <button
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Status Banners */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ===================== LOGIN FORM ===================== */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rivera@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <span>Sign In to JobSift</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Fast 1-Click Demo Accounts for Easy Testing */}
              <div className="pt-4 border-t border-border space-y-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">
                  Or Quick-Fill Demo Test Accounts (RBAC)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('candidate')}
                    className="p-2 rounded-xl border border-border/80 bg-muted/30 hover:bg-muted text-center transition-all cursor-pointer group text-xs"
                  >
                    <div className="font-semibold text-foreground group-hover:text-primary flex items-center justify-center gap-1">
                      <User className="w-3 h-3 text-primary" /> Candidate
                    </div>
                    <span className="text-[10px] text-muted-foreground">Alex Rivera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('recruiter')}
                    className="p-2 rounded-xl border border-border/80 bg-muted/30 hover:bg-muted text-center transition-all cursor-pointer group text-xs"
                  >
                    <div className="font-semibold text-foreground group-hover:text-primary flex items-center justify-center gap-1">
                      <Briefcase className="w-3 h-3 text-primary" /> Recruiter
                    </div>
                    <span className="text-[10px] text-muted-foreground">Sarah @ Stripe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('employee')}
                    className="p-2 rounded-xl border border-border/80 bg-muted/30 hover:bg-muted text-center transition-all cursor-pointer group text-xs"
                  >
                    <div className="font-semibold text-foreground group-hover:text-primary flex items-center justify-center gap-1">
                      <Award className="w-3 h-3 text-primary" /> Referrer
                    </div>
                    <span className="text-[10px] text-muted-foreground">David @ Google</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ===================== SIGNUP 3-STEP FLOW ===================== */
            <div className="space-y-4">
              {/* Step Indicators */}
              <div className="flex items-center justify-between text-xs px-1">
                <span className={`font-semibold ${signupStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                  1. Role Select
                </span>
                <span className="text-muted-foreground">→</span>
                <span className={`font-semibold ${signupStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                  2. Credentials
                </span>
                <span className="text-muted-foreground">→</span>
                <span className={`font-semibold ${signupStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  3. {selectedRole === 'candidate' ? 'Skills & Resume' : selectedRole === 'recruiter' ? 'Company Details' : 'Referral Profile'}
                </span>
              </div>

              {/* STEP 1: Choose Role */}
              {signupStep === 1 && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Select your primary account purpose. Your permissions and portal features will be tailored accordingly:
                  </p>

                  <div className="space-y-2">
                    {/* Role Option: Candidate */}
                    <div
                      onClick={() => setSelectedRole('candidate')}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        selectedRole === 'candidate'
                          ? 'border-primary bg-primary/5 shadow-2xs'
                          : 'border-border hover:border-border/80 bg-card'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-foreground">Job Seeker (Candidate)</h4>
                          {selectedRole === 'candidate' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Explore curated tech roles, manage applications with Kanban, request verified employee referrals, and practice with AI Copilot.
                        </p>
                      </div>
                    </div>

                    {/* Role Option: Recruiter */}
                    <div
                      onClick={() => setSelectedRole('recruiter')}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        selectedRole === 'recruiter'
                          ? 'border-primary bg-primary/5 shadow-2xs'
                          : 'border-border hover:border-border/80 bg-card'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-foreground">Hiring Manager / Recruiter</h4>
                          {selectedRole === 'recruiter' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Post engineering roles, review applicants with AI resume scoring, schedule interviews, and build high-performing teams.
                        </p>
                      </div>
                    </div>

                    {/* Role Option: Employee / Referrer */}
                    <div
                      onClick={() => setSelectedRole('employee')}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        selectedRole === 'employee'
                          ? 'border-primary bg-primary/5 shadow-2xs'
                          : 'border-border hover:border-border/80 bg-card'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-foreground">Company Insider (Referrer)</h4>
                          {selectedRole === 'employee' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          List referral slots for your employer, review candidate elevator pitches, submit verified referrals, and earn community karma.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSignupStep(2)}
                    className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <span>Continue to Credentials</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* STEP 2: Basic Account Details */}
              {signupStep === 2 && (
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-muted-foreground" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      {selectedRole === 'recruiter' || selectedRole === 'employee' ? 'Work / Corporate Email' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={selectedRole === 'recruiter' ? 'sarah@stripe.com' : selectedRole === 'employee' ? 'david@google.com' : 'alex@example.com'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="w-1/3 py-2.5 rounded-xl border border-border hover:bg-muted text-foreground text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!fullName.trim() || !email.trim() || !password.trim()) {
                          setErrorMessage('Please fill in your name, email, and password.');
                          return;
                        }
                        setErrorMessage('');
                        setSignupStep(3);
                      }}
                      className="w-2/3 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Next: {selectedRole === 'candidate' ? 'Candidate Profile' : selectedRole === 'recruiter' ? 'Company Info' : 'Referral Profile'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Tailored Role-Specific Information Collection */}
              {signupStep === 3 && (
                <form onSubmit={handleSignup} className="space-y-3.5">
                  {/* ====== CANDIDATE SPECIFIC FIELDS ====== */}
                  {selectedRole === 'candidate' && (
                    <>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-foreground">Target Role / Title</label>
                          <input
                            type="text"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            placeholder="Staff Full-Stack Engineer"
                            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-foreground">Years of Experience</label>
                          <input
                            type="number"
                            step="0.5"
                            value={yearsOfExperience}
                            onChange={(e) => setYearsOfExperience(e.target.value)}
                            placeholder="5"
                            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Location / Preferred Hub
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="San Francisco, CA or Remote"
                          className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      {/* Skills Tags */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                          <Code2 className="w-3.5 h-3.5 text-muted-foreground" /> Technical Skills
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSkill();
                              }
                            }}
                            placeholder="Add skill (e.g. Next.js, Rust, Docker) & Enter"
                            className="flex-1 px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            type="button"
                            onClick={handleAddSkill}
                            className="px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold cursor-pointer"
                          >
                            Add
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-primary/10 text-primary border border-primary/20"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="hover:text-destructive cursor-pointer"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-muted-foreground" /> Resume / Elevator Pitch
                        </label>
                        <textarea
                          rows={2}
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          placeholder="Paste a brief summary of your career background, key architecture accomplishments, or link to resume."
                          className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* ====== RECRUITER SPECIFIC FIELDS ====== */}
                  {selectedRole === 'recruiter' && (
                    <>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-muted-foreground" /> Company Name
                          </label>
                          <input
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Stripe, Vercel, Figma"
                            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-foreground">Official Title</label>
                          <input
                            type="text"
                            required
                            value={recruiterTitle}
                            onChange={(e) => setRecruiterTitle(e.target.value)}
                            placeholder="Principal Talent Partner"
                            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-muted-foreground" /> Company Careers / Website URL
                        </label>
                        <input
                          type="url"
                          value={companyWebsite}
                          onChange={(e) => setCompanyWebsite(e.target.value)}
                          placeholder="https://stripe.com/jobs"
                          className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Hiring Focus / Department</label>
                        <input
                          type="text"
                          value={hiringDomain}
                          onChange={(e) => setHiringDomain(e.target.value)}
                          placeholder="Core Engineering, Cloud Infrastructure, AI Systems"
                          className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </>
                  )}

                  {/* ====== EMPLOYEE / REFERRER SPECIFIC FIELDS ====== */}
                  {selectedRole === 'employee' && (
                    <>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-muted-foreground" /> Current Employer
                          </label>
                          <input
                            type="text"
                            required
                            value={employeeCompany}
                            onChange={(e) => setEmployeeCompany(e.target.value)}
                            placeholder="Google, Microsoft, Meta"
                            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-foreground">Current Title</label>
                          <input
                            type="text"
                            required
                            value={employeeTitle}
                            onChange={(e) => setEmployeeTitle(e.target.value)}
                            placeholder="Staff Software Engineer"
                            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-foreground">Department / Team</label>
                          <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="Cloud Platform"
                            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-foreground">Years at Company</label>
                          <input
                            type="number"
                            step="0.5"
                            value={yearsAtCompany}
                            onChange={(e) => setYearsAtCompany(e.target.value)}
                            placeholder="3.5"
                            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Referral Guidelines / Preferences
                        </label>
                        <textarea
                          rows={2}
                          value={referralGuidelines}
                          onChange={(e) => setReferralGuidelines(e.target.value)}
                          placeholder="What criteria should candidates meet when asking you for a referral?"
                          className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSignupStep(2)}
                      className="w-1/3 py-2.5 rounded-xl border border-border hover:bg-muted text-foreground text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-2/3 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <>
                          <span>Complete & Join JobSift</span>
                          <Sparkles className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
