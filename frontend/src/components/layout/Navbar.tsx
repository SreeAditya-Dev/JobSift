'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Briefcase, MessageSquare, Award, Columns3, Bot,
  TrendingUp, Search, Sun, Moon, Bell, Menu, X, User, LogOut,
  ChevronDown, Sparkles, Plus, CheckCircle2, UserCheck, Users,
  ArrowRight, ShieldCheck, Compass, LogIn, UserPlus
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
  const { user, logout, openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Scroll listener for dynamic elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
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

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Role-Aware Navigation Links
  const getNavLinks = () => {
    if (user?.role === 'recruiter') {
      return [
        { label: 'Talent Hub', shortLabel: 'Hub', href: '/recruiter', icon: Briefcase },
        { label: 'Post Role', shortLabel: 'Post', href: '/recruiter?tab=post', icon: Plus },
        { label: 'Community', shortLabel: 'Discuss', href: '/community', icon: MessageSquare },
        { label: 'Salaries', shortLabel: 'Salaries', href: '/salaries', icon: TrendingUp },
        { label: 'Explore Jobs', shortLabel: 'Jobs', href: '/jobs', icon: Compass },
      ];
    }
    if (user?.role === 'employee') {
      return [
        { label: 'Referral Matchmaker', shortLabel: 'Referrals', href: '/referrals', icon: Award },
        { label: 'Explore Jobs', shortLabel: 'Jobs', href: '/jobs', icon: Briefcase },
        { label: 'Community', shortLabel: 'Discuss', href: '/community', icon: MessageSquare },
        { label: 'Salaries', shortLabel: 'Salaries', href: '/salaries', icon: TrendingUp },
        { label: 'AI Copilot', shortLabel: 'AI Copilot', href: '/ai-copilot', icon: Bot, isAiSpecial: true },
      ];
    }
    // Candidate & Public Visitor
    return [
      { label: 'Explore Jobs', shortLabel: 'Jobs', href: '/jobs', icon: Briefcase },
      { label: 'Kanban Tracker', shortLabel: 'Tracker', href: '/tracker', icon: Columns3 },
      { label: 'Referrals', shortLabel: 'Referrals', href: '/referrals', icon: Award },
      { label: 'Community', shortLabel: 'Discuss', href: '/community', icon: MessageSquare },
      { label: 'Salaries', shortLabel: 'Salaries', href: '/salaries', icon: TrendingUp },
      { label: 'AI Copilot', shortLabel: 'AI Copilot', href: '/ai-copilot', icon: Bot, isAiSpecial: true },
    ];
  };

  const navLinks = getNavLinks();

  const isActive = (href: string) => {
    if (href === '/jobs' && (pathname === '/jobs' || pathname.startsWith('/jobs/'))) return true;
    if (href === '/community' && (pathname === '/community' || pathname.startsWith('/community/'))) return true;
    if (href === '/tracker' && (pathname === '/tracker' || pathname.startsWith('/tracker/'))) return true;
    if (href === '/referrals' && (pathname === '/referrals' || pathname.startsWith('/referrals/'))) return true;
    if (href === '/salaries' && (pathname === '/salaries' || pathname.startsWith('/salaries/'))) return true;
    if (href === '/ai-copilot' && (pathname === '/ai-copilot' || pathname.startsWith('/ai-copilot/'))) return true;
    if (href.startsWith('/recruiter') && pathname.startsWith('/recruiter')) return true;
    return pathname === href;
  };

  return (
    <>
      {/* Floating Top Dock Container */}
      <header className="sticky top-2 sm:top-3.5 z-40 w-full px-3 sm:px-6 pointer-events-none transition-all duration-300">
        <div
          className={`pointer-events-auto max-w-6xl mx-auto floating-dock rounded-2xl sm:rounded-full border border-border/80 dark:border-white/10 transition-all duration-300 ${
            isScrolled
              ? 'py-1.5 sm:py-2 px-3 sm:px-4 shadow-xl shadow-black/8 dark:shadow-black/50'
              : 'py-2 sm:py-2.5 px-3.5 sm:px-5 shadow-lg shadow-black/5 dark:shadow-black/30'
          }`}
        >
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-3 lg:gap-5">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 group cursor-pointer focus:outline-none select-none"
                aria-label="JobSift Home"
              >
                <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-gradient-to-br from-[#644a40] via-[#4e382f] to-[#2c1d18] dark:from-[#ffdfb5] dark:via-[#f5caa0] dark:to-[#d4a373] flex items-center justify-center text-white dark:text-[#2c1d18] shadow-xs ring-1 ring-white/20 dark:ring-black/10 group-hover:scale-105 group-hover:rotate-6 transition-all duration-200">
                  <Compass className="w-4 h-4 text-secondary dark:text-[#3e2723]" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-base sm:text-lg tracking-tight leading-none text-foreground">
                      Job<span className="text-primary font-black">Sift</span>
                    </span>
                    <span className="hidden md:inline-flex items-center px-1.5 py-0.2 rounded-full text-[8.5px] font-bold uppercase bg-primary/10 text-primary border border-primary/20 tracking-wider">
                      AI OS
                    </span>
                  </div>
                  <span className="text-[9.5px] text-muted-foreground font-medium hidden sm:inline leading-none mt-0.5">
                    Unified Career OS
                  </span>
                </div>
              </button>
            </div>

            {/* Center: Dynamic Role-Aware Dock Item Pills (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-1 p-1 rounded-full bg-muted/30 border border-border/40" aria-label="Main Navigation">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                if (item.isAiSpecial) {
                  return (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        active
                          ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                          : 'bg-gradient-to-r from-primary/15 via-primary/10 to-amber-500/15 hover:from-primary/25 hover:to-amber-500/25 text-primary border border-primary/30 hover:scale-[1.02]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                      active
                        ? 'bg-card text-primary font-bold shadow-xs border border-border/80'
                        : 'text-muted-foreground hover:text-foreground hover:bg-card/70'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Controls & User Auth Suite */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Quick Command Palette Search (Cmd+K) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition-all duration-150 cursor-pointer shadow-2xs group focus:ring-2 focus:ring-primary/20 focus:outline-none"
                title="Search everything (Ctrl+K or ⌘K)"
              >
                <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="hidden xl:inline text-muted-foreground/90">Search jobs, salaries...</span>
                <span className="hidden sm:inline xl:hidden text-muted-foreground/90">Search</span>
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.2 text-[9.5px] bg-muted rounded-md border border-border/80 font-mono text-muted-foreground font-semibold shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* Dynamic Action Button based on Role */}
              {user?.role === 'recruiter' ? (
                <button
                  onClick={() => router.push('/recruiter')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:opacity-90 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post Job</span>
                </button>
              ) : user?.role === 'employee' ? (
                <button
                  onClick={() => router.push('/referrals')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/40 text-primary hover:bg-primary/10 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Offer Referral</span>
                </button>
              ) : null}

              {/* Notification Center */}
              <div className="relative" ref={notifMenuRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-full border border-border/70 bg-card hover:bg-muted text-foreground transition-colors cursor-pointer focus:outline-none"
                  aria-label="Notifications"
                >
                  <Bell className="w-3.5 h-3.5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8.5px] font-bold text-primary-foreground ring-2 ring-card animate-in zoom-in">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-card border border-border shadow-2xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
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
                          Mark all read
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
                            <div className={`mt-0.5 p-1 rounded-lg ${
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
                        <span>View Pipeline Tracker</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="p-2 rounded-full border border-border/70 bg-card hover:bg-muted text-foreground transition-all duration-200 cursor-pointer focus:outline-none active:scale-95"
                title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-stone-600 hover:-rotate-12 transition-transform" />
                )}
              </button>

              {/* User Authenticated Profile or Login CTA */}
              {user ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-2.5 rounded-full border border-border/80 bg-card hover:bg-muted transition-all duration-150 cursor-pointer shadow-2xs group focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    <div className="flex flex-col text-right hidden xl:block">
                      <span className="text-xs font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                        {user.full_name}
                      </span>
                      <span className="text-[9.5px] text-muted-foreground capitalize leading-tight flex items-center justify-end gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>⭐ {user.karma_points} pts</span>
                      </span>
                    </div>

                    <div className="relative">
                      <img
                        src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={user.full_name}
                        className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full object-cover border border-primary/20 shadow-2xs"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-card"></span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-muted-foreground mr-0.5 hidden sm:inline" />
                  </button>

                  {/* Profile Dropdown Popover */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-card border border-border shadow-2xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
                      {/* Identity Card Header */}
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

                      {/* Navigation Links according to Role */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            router.push('/profile');
                          }}
                          className="w-full px-4 py-2 text-xs text-left text-foreground hover:bg-muted flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-primary" />
                          <span>My Profile & Settings</span>
                        </button>

                        {user.role === 'candidate' && (
                          <>
                            <button
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                router.push('/tracker');
                              }}
                              className="w-full px-4 py-2 text-xs text-left text-foreground hover:bg-muted flex items-center gap-2.5 cursor-pointer transition-colors"
                            >
                              <Columns3 className="w-3.5 h-3.5 text-primary" />
                              <span>Application Kanban</span>
                            </button>
                            <button
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                router.push('/referrals');
                              }}
                              className="w-full px-4 py-2 text-xs text-left text-foreground hover:bg-muted flex items-center gap-2.5 cursor-pointer transition-colors"
                            >
                              <Award className="w-3.5 h-3.5 text-primary" />
                              <span>My Referral Requests</span>
                            </button>
                          </>
                        )}

                        {user.role === 'recruiter' && (
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              router.push('/recruiter');
                            }}
                            className="w-full px-4 py-2 text-xs text-left text-foreground hover:bg-muted flex items-center gap-2.5 cursor-pointer transition-colors"
                          >
                            <Briefcase className="w-3.5 h-3.5 text-primary" />
                            <span>Recruiter Command Center</span>
                          </button>
                        )}

                        {user.role === 'employee' && (
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              router.push('/referrals');
                            }}
                            className="w-full px-4 py-2 text-xs text-left text-foreground hover:bg-muted flex items-center gap-2.5 cursor-pointer transition-colors"
                          >
                            <Award className="w-3.5 h-3.5 text-primary" />
                            <span>Referral Dashboard</span>
                          </button>
                        )}
                      </div>

                      {/* Switch Account / Sign In */}
                      <div className="border-t border-border pt-1 pb-1 px-2">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            openAuthModal('login');
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <LogIn className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>Switch / Log in to another account</span>
                        </button>
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
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-foreground hover:bg-card border border-border/80 transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Join Free</span>
                  </button>
                </div>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-full border border-border/70 text-foreground hover:bg-muted cursor-pointer transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-border mt-3 pt-3 pb-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-1.5">
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
                          ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                          : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                      } ${item.isAiSpecial && !active ? 'border border-primary/30 text-primary bg-primary/5' : ''}`}
                    >
                      <Icon className={`w-4 h-4 ${item.isAiSpecial && !active ? 'text-primary' : ''}`} />
                      <span>{item.label}</span>
                      {item.isAiSpecial && (
                        <span className={`ml-auto text-[8.5px] px-1 py-0.2 rounded font-bold ${
                          active ? 'bg-white/20 text-white' : 'bg-primary text-primary-foreground'
                        }`}>
                          AI
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                {user ? (
                  <>
                    <span className="text-muted-foreground text-[11px]">
                      Signed in as <strong className="text-foreground font-semibold">{user.full_name}</strong> ({user.role})
                    </span>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="text-destructive font-semibold hover:underline"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 w-full justify-between">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                      className="text-primary font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('signup');
                      }}
                      className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground font-bold text-xs"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Global Search Command Palette */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
