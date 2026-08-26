'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Briefcase, MessageSquare, Award, Columns3, Bot,
  TrendingUp, Search, Sun, Moon, Bell, Menu, X, User, LogOut,
  ChevronDown, Sparkles, Plus, CheckCircle2, UserCheck, Users,
  Bookmark, ArrowRight, ShieldCheck, Compass, Check
} from 'lucide-react';
import { GlobalSearchModal } from '@/components/common/GlobalSearchModal';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: 'referral' | 'interview' | 'job';
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Referral Accepted 🎉',
    desc: 'David Kim submitted your referral for Senior SWE at Google Cloud.',
    time: '10m ago',
    unread: true,
    type: 'referral',
  },
  {
    id: '2',
    title: 'Interview Scheduled',
    desc: 'Stripe DX team confirmed your System Design round for Thursday.',
    time: '2h ago',
    unread: true,
    type: 'interview',
  },
  {
    id: '3',
    title: 'New Matched Role',
    desc: 'OpenAI posted "AI Systems Engineer" matching 94% of your profile.',
    time: '5h ago',
    unread: false,
    type: 'job',
  },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, switchPersona, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Scroll listener for dynamic glassmorphism elevation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const navLinks = [
    { label: 'Explore Jobs', href: '/jobs', icon: Briefcase },
    { label: 'Kanban Tracker', href: '/tracker', icon: Columns3 },
    { label: 'Referrals', href: '/referrals', icon: Award },
    { label: 'Discussions', href: '/community', icon: MessageSquare },
    { label: 'Salaries', href: '/salaries', icon: TrendingUp },
    { label: 'AI Copilot', href: '/ai-copilot', icon: Bot, isAiSpecial: true },
  ];

  const isActive = (href: string) => {
    if (href === '/jobs' && (pathname === '/jobs' || pathname.startsWith('/jobs/'))) return true;
    if (href === '/community' && (pathname === '/community' || pathname.startsWith('/community/'))) return true;
    if (href === '/tracker' && (pathname === '/tracker' || pathname.startsWith('/tracker/'))) return true;
    if (href === '/referrals' && (pathname === '/referrals' || pathname.startsWith('/referrals/'))) return true;
    if (href === '/salaries' && (pathname === '/salaries' || pathname.startsWith('/salaries/'))) return true;
    if (href === '/ai-copilot' && (pathname === '/ai-copilot' || pathname.startsWith('/ai-copilot/'))) return true;
    return pathname === href;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-30 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-card/90 dark:bg-[#121212]/90 backdrop-blur-xl border-b border-border/80 shadow-sm shadow-black/5 dark:shadow-black/20 py-2.5'
            : 'bg-card/75 dark:bg-[#121212]/75 backdrop-blur-md border-b border-border/60 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left Brand Logo & Primary Navigation */}
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Brand Logo */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none select-none"
              aria-label="JobSift Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#644a40] via-[#4e382f] to-[#2c1d18] dark:from-[#ffdfb5] dark:via-[#f5caa0] dark:to-[#d4a373] flex items-center justify-center text-white dark:text-[#2c1d18] shadow-sm shadow-primary/20 ring-1 ring-white/20 dark:ring-black/10 group-hover:scale-105 group-hover:shadow-primary/30 transition-all duration-200">
                <Compass className="w-4 h-4 text-secondary dark:text-[#3e2723] group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight leading-none text-foreground">
                    Job<span className="text-primary font-black">Sift</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
                    AI OS
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wide">
                  The Unified Career OS
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                if (item.isAiSpecial) {
                  return (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ml-1 ${
                        active
                          ? 'bg-gradient-to-r from-primary text-primary-foreground shadow-xs'
                          : 'bg-gradient-to-r from-primary/10 via-primary/5 to-amber-500/10 hover:from-primary/20 hover:to-amber-500/20 text-primary border border-primary/30'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                      <span>{item.label}</span>
                      <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                      </span>
                    </button>
                  );
                }

                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                      active
                        ? 'bg-primary/12 text-primary font-semibold shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Global Search Command Trigger (Cmd+K) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-border/80 bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs transition-all duration-150 cursor-pointer shadow-2xs group focus:ring-2 focus:ring-primary/20 focus:outline-none"
              title="Search everything (Ctrl+K or ⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="hidden xl:inline text-muted-foreground/90">Search jobs, skills, salaries...</span>
              <span className="hidden sm:inline xl:hidden text-muted-foreground/90">Search...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.2 text-[10px] bg-card rounded-md border border-border/80 font-mono text-muted-foreground font-semibold shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Recruiter Hub / Post Job CTA */}
            <button
              onClick={() => router.push('/recruiter')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                pathname === '/recruiter'
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : 'border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post a Job</span>
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-colors cursor-pointer focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground ring-2 ring-card animate-in zoom-in">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-xl bg-card border border-border shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-primary/10 text-primary rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 text-xs transition-colors hover:bg-muted/40 flex items-start gap-2.5 ${
                            n.unread ? 'bg-primary/5' : ''
                          }`}
                        >
                          <div className={`mt-0.5 p-1 rounded-md ${
                            n.type === 'referral'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : n.type === 'interview'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {n.type === 'referral' ? <Award className="w-3.5 h-3.5" /> : n.type === 'interview' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-foreground">{n.title}</p>
                              <span className="text-[10px] text-muted-foreground">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{n.desc}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-2 border-t border-border bg-muted/20 text-center">
                    <button
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        router.push('/tracker');
                      }}
                      className="text-[11px] font-semibold text-primary hover:underline flex items-center justify-center gap-1 mx-auto"
                    >
                      <span>View Application Pipeline</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg border border-border/70 bg-card hover:bg-muted text-foreground transition-all duration-200 cursor-pointer focus:outline-none active:scale-95"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* User Profile / Auth State Chip */}
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 sm:pl-2 rounded-full border border-border/80 bg-card hover:bg-muted/70 transition-all duration-150 cursor-pointer shadow-2xs group focus:ring-2 focus:ring-primary/20 focus:outline-none"
                >
                  <div className="flex flex-col text-right hidden xl:block">
                    <span className="text-xs font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                      {user.full_name}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize leading-tight flex items-center justify-end gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>⭐ {user.karma_points} karma</span>
                    </span>
                  </div>

                  <div className="relative">
                    <img
                      src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={user.full_name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-primary/20 shadow-2xs"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-card"></span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground mr-1 hidden sm:inline transition-transform duration-200" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-card border border-border shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
                    {/* User Header */}
                    <div className="px-4 py-3 border-b border-border bg-muted/20">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={user.full_name}
                          className="w-10 h-10 rounded-full object-cover border border-primary/30"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{user.full_name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[10px] font-semibold bg-card border border-border/80 px-2.5 py-1 rounded-lg">
                        <span className="text-primary uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" />
                          {user.role} {user.company ? `(${user.company})` : ''}
                        </span>
                        <span className="text-amber-600 dark:text-amber-400">⭐ {user.karma_points} Karma</span>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          router.push('/profile');
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-foreground hover:bg-muted flex items-center gap-2.5 cursor-pointer transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-primary" />
                        <span>My Profile & Master Resume</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          router.push('/tracker');
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-foreground hover:bg-muted flex items-center gap-2.5 cursor-pointer transition-colors"
                      >
                        <Columns3 className="w-3.5 h-3.5 text-primary" />
                        <span>Kanban Application Tracker</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          router.push('/referrals');
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-foreground hover:bg-muted flex items-center gap-2.5 cursor-pointer transition-colors"
                      >
                        <Award className="w-3.5 h-3.5 text-primary" />
                        <span>My Referral Matchmaker</span>
                      </button>
                    </div>

                    {/* 1-Click Fast Switch Section Inside Dropdown */}
                    <div className="border-t border-border pt-2 pb-1 px-4">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Fast Switch Persona
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => {
                            switchPersona('candidate');
                            setIsProfileMenuOpen(false);
                          }}
                          disabled={isLoading || user.role === 'candidate'}
                          className={`px-1.5 py-1 rounded text-[10px] font-medium text-center transition-colors cursor-pointer ${
                            user.role === 'candidate'
                              ? 'bg-primary text-primary-foreground font-bold'
                              : 'bg-muted hover:bg-muted/80 text-foreground'
                          }`}
                        >
                          Candidate
                        </button>
                        <button
                          onClick={() => {
                            switchPersona('recruiter');
                            setIsProfileMenuOpen(false);
                          }}
                          disabled={isLoading || user.role === 'recruiter'}
                          className={`px-1.5 py-1 rounded text-[10px] font-medium text-center transition-colors cursor-pointer ${
                            user.role === 'recruiter'
                              ? 'bg-primary text-primary-foreground font-bold'
                              : 'bg-muted hover:bg-muted/80 text-foreground'
                          }`}
                        >
                          Recruiter
                        </button>
                        <button
                          onClick={() => {
                            switchPersona('employee');
                            setIsProfileMenuOpen(false);
                          }}
                          disabled={isLoading || user.role === 'employee'}
                          className={`px-1.5 py-1 rounded text-[10px] font-medium text-center transition-colors cursor-pointer ${
                            user.role === 'employee'
                              ? 'bg-primary text-primary-foreground font-bold'
                              : 'bg-muted hover:bg-muted/80 text-foreground'
                          }`}
                        >
                          Referrer
                        </button>
                      </div>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-border pt-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-destructive hover:bg-destructive/10 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => switchPersona('candidate')}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-border/70 text-foreground hover:bg-muted cursor-pointer transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Navigation Links */}
            <div className="grid grid-cols-2 gap-2 pb-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push(item.href);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      active
                        ? 'bg-primary/15 text-primary font-bold shadow-2xs'
                        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                    } ${item.isAiSpecial && !active ? 'border border-primary/30 text-primary' : ''}`}
                  >
                    <Icon className={`w-4 h-4 ${item.isAiSpecial ? 'text-primary' : ''}`} />
                    <span>{item.label}</span>
                    {item.isAiSpecial && (
                      <span className="ml-auto text-[9px] px-1 py-0.2 rounded bg-primary text-primary-foreground font-bold">
                        AI
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Recruiter & Profile Action Bar */}
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push('/recruiter');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Post a Job
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push('/profile');
                }}
                className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-1"
              >
                <span>Edit Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Command Palette */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

