'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Briefcase, MessageSquare, Award, Columns3, Bot,
  TrendingUp, Search, Sun, Moon, Bell, Menu, X, User, LogOut,
  ChevronDown, Sparkles, Plus, CheckCircle2,
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <header className="sticky top-2 sm:top-3 z-40 w-full px-2.5 sm:px-6 pointer-events-none transition-all duration-300">
        <div
          className={`pointer-events-auto max-w-[1140px] mx-auto rounded-full border border-stone-800/80 bg-[#121110]/92 dark:bg-[#0e0d0c]/92 backdrop-blur-xl transition-all duration-300 ${
            isScrolled
              ? 'py-1.5 px-3 sm:px-4 shadow-2xl shadow-black/80 ring-1 ring-white/10'
              : 'py-2 px-3 sm:px-5 shadow-xl shadow-black/60 ring-1 ring-white/5'
          }`}
        >
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Left: Brand Logo */}
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2.5 group cursor-pointer focus:outline-none select-none text-left"
                aria-label="JobSift Home"
              >
                {/* Compass Icon Badge */}
                <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-2xl bg-[#f2c89b] flex items-center justify-center text-[#2b1f1a] shadow-xs group-hover:scale-105 transition-all duration-200">
                  <Compass className="w-4.5 h-4.5 stroke-[2.2] text-[#2b1f1a]" />
                </div>

                {/* Brand Text & AI OS Stacked Badge */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="font-extrabold text-[15px] sm:text-base tracking-tight text-white">
                      Job<span className="text-[#f2c89b] font-black">Sift</span>
                    </span>

                    {/* AI OS Stacked Pill Badge */}
                    <div className="flex flex-col items-center justify-center px-1.5 py-0.5 rounded-md bg-[#252220] border border-[#3e3832] text-[7.5px] font-black leading-none text-[#f2c89b] tracking-wider">
                      <span>AI</span>
                      <span className="mt-0.5">OS</span>
                    </div>
                  </div>

                  <span className="text-[9.5px] sm:text-[10px] text-stone-400 font-medium leading-none mt-1">
                    Unified Career OS
                  </span>
                </div>
              </button>
            </div>

            {/* Center: Navigation Items (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-1 sm:space-x-2" aria-label="Main Navigation">
              {/* 1. Explore Jobs */}
              <button
                onClick={() => router.push('/jobs')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                  isActive('/jobs')
                    ? 'bg-white/10 text-white font-semibold shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Briefcase className={`w-4 h-4 ${isActive('/jobs') ? 'text-[#f2c89b]' : 'text-stone-400'}`} />
                <span className="text-[11.5px] font-medium">Jobs</span>
              </button>

              {/* 2. Kanban Tracker */}
              <button
                onClick={() => router.push('/tracker')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                  isActive('/tracker')
                    ? 'bg-white/10 text-white font-semibold shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Columns3 className={`w-4 h-4 ${isActive('/tracker') ? 'text-[#f2c89b]' : 'text-stone-400'}`} />
                <span className="text-[11.5px] font-medium">Tracker</span>
              </button>

              {/* 3. Referrals */}
              <button
                onClick={() => router.push('/referrals')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                  isActive('/referrals')
                    ? 'bg-white/10 text-white font-semibold shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Award className={`w-4 h-4 ${isActive('/referrals') ? 'text-[#f2c89b]' : 'text-stone-400'}`} />
                <span className="text-[11.5px] font-medium">Referrals</span>
              </button>

              {/* 4. Community */}
              <button
                onClick={() => router.push('/community')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                  isActive('/community')
                    ? 'bg-white/10 text-white font-semibold shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare className={`w-4 h-4 ${isActive('/community') ? 'text-[#f2c89b]' : 'text-stone-400'}`} />
                <span className="text-[11.5px] font-medium">Community</span>
              </button>

              {/* 5. Salaries */}
              <button
                onClick={() => router.push('/salaries')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                  isActive('/salaries')
                    ? 'bg-white/10 text-white font-semibold shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp className={`w-4 h-4 ${isActive('/salaries') ? 'text-[#f2c89b]' : 'text-stone-400'}`} />
                <span className="text-[11.5px] font-medium">Salaries</span>
              </button>

              {/* 6. AI Copilot Glow Pill */}
              <button
                onClick={() => router.push('/ai-copilot')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer shadow-xs ${
                  isActive('/ai-copilot')
                    ? 'bg-[#5a3a22] border-[#f2c89b] text-[#f2c89b] font-bold shadow-md shadow-[#f2c89b]/20 scale-105'
                    : 'bg-gradient-to-r from-[#442c1b]/70 via-[#352215]/80 to-[#2c1d12]/70 border-[#f2c89b]/40 text-[#f2c89b] hover:border-[#f2c89b]/70 hover:scale-[1.02]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#f2c89b] animate-pulse" />
                <span className="text-[11.5px] font-bold">Copilot</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2c89b] ml-0.5"></span>
              </button>
            </nav>

            {/* Right: Controls & Profile Suite */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Quick Command Palette Search (Cmd+K) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-stone-800 bg-[#1c1a18] hover:bg-[#252220] text-stone-300 text-xs transition-all duration-150 cursor-pointer shadow-2xs group focus:outline-none"
                title="Search everything (Ctrl+K or ⌘K)"
              >
                <Search className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#f2c89b] transition-colors" />
                <span className="hidden xl:inline text-stone-400">Search</span>
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.2 text-[9px] bg-[#292623] rounded border border-stone-700 font-mono text-stone-300 font-semibold">
                  ⌘K
                </kbd>
              </button>

              {/* Notification Center with counter pill */}
              <div className="relative" ref={notifMenuRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-full border border-stone-800 bg-[#1c1a18] hover:bg-[#252220] text-stone-300 transition-colors cursor-pointer focus:outline-none"
                  aria-label="Notifications"
                >
                  <Bell className="w-3.5 h-3.5 text-stone-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black text-black ring-2 ring-[#121110]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-[#181615] border border-stone-800 shadow-2xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-stone-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-[#f2c89b]/15 text-[#f2c89b] rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-[#f2c89b] hover:underline font-medium cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-stone-800/60">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-stone-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 text-xs transition-colors hover:bg-white/5 flex items-start gap-2.5 ${
                              n.unread ? 'bg-[#f2c89b]/5' : ''
                            }`}
                          >
                            <div className={`mt-0.5 p-1 rounded-lg ${
                              n.type === 'referral'
                                ? 'bg-amber-500/10 text-amber-400'
                                : n.type === 'interview'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-[#f2c89b]/15 text-[#f2c89b]'
                            }`}>
                              {n.type === 'referral' ? <Award className="w-3.5 h-3.5" /> : n.type === 'interview' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-white">{n.title}</p>
                                <span className="text-[10px] text-stone-400">{n.time}</span>
                              </div>
                              <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{n.desc}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="px-4 py-2 border-t border-stone-800 bg-[#121110]/50 text-center">
                      <button
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          router.push('/tracker');
                        }}
                        className="text-[11px] font-semibold text-[#f2c89b] hover:underline flex items-center justify-center gap-1 mx-auto"
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
                className="p-2 rounded-full border border-stone-800 bg-[#1c1a18] hover:bg-[#252220] text-amber-400 transition-all duration-200 cursor-pointer focus:outline-none"
                title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-stone-400" />
                )}
              </button>

              {/* User Profile Avatar with dropdown chevron */}
              {user ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-1 p-0.5 pr-1.5 rounded-full border border-stone-800 bg-[#1c1a18] hover:bg-[#252220] transition-all duration-150 cursor-pointer focus:outline-none"
                  >
                    <div className="relative">
                      <img
                        src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={user.full_name}
                        className="w-7 h-7 rounded-full object-cover border border-[#f2c89b]/30"
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#1c1a18]"></span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-stone-400 ml-0.5" />
                  </button>

                  {/* Profile Dropdown Popover */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#181615] border border-stone-800 shadow-2xl py-2 z-50 animate-in fade-in-50 zoom-in-95 text-left">
                      {/* Identity Card Header */}
                      <div className="px-4 py-3 border-b border-stone-800 bg-[#121110]/50">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt={user.full_name}
                            className="w-10 h-10 rounded-full object-cover border border-[#f2c89b]/30"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                            <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                          </div>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between text-[10px] font-semibold bg-[#221f1d] border border-stone-800 px-2.5 py-1 rounded-lg">
                          <span className="text-[#f2c89b] uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            {user.role} {user.company ? `(${user.company})` : ''}
                          </span>
                          <span className="text-amber-400">⭐ {user.karma_points} Karma</span>
                        </div>
                      </div>

                      {/* Navigation Links according to Role */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            router.push('/profile');
                          }}
                          className="w-full px-4 py-2 text-xs text-left text-stone-200 hover:bg-white/5 flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-[#f2c89b]" />
                          <span>My Profile & Settings</span>
                        </button>

                        {user.role === 'candidate' && (
                          <>
                            <button
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                router.push('/tracker');
                              }}
                              className="w-full px-4 py-2 text-xs text-left text-stone-200 hover:bg-white/5 flex items-center gap-2.5 cursor-pointer transition-colors"
                            >
                              <Columns3 className="w-3.5 h-3.5 text-[#f2c89b]" />
                              <span>Application Kanban</span>
                            </button>
                            <button
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                router.push('/referrals');
                              }}
                              className="w-full px-4 py-2 text-xs text-left text-stone-200 hover:bg-white/5 flex items-center gap-2.5 cursor-pointer transition-colors"
                            >
                              <Award className="w-3.5 h-3.5 text-[#f2c89b]" />
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
                            className="w-full px-4 py-2 text-xs text-left text-stone-200 hover:bg-white/5 flex items-center gap-2.5 cursor-pointer transition-colors"
                          >
                            <Briefcase className="w-3.5 h-3.5 text-[#f2c89b]" />
                            <span>Recruiter Command Center</span>
                          </button>
                        )}

                        {user.role === 'employee' && (
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              router.push('/referrals');
                            }}
                            className="w-full px-4 py-2 text-xs text-left text-stone-200 hover:bg-white/5 flex items-center gap-2.5 cursor-pointer transition-colors"
                          >
                            <Award className="w-3.5 h-3.5 text-[#f2c89b]" />
                            <span>Referral Dashboard</span>
                          </button>
                        )}
                      </div>

                      {/* Switch Account */}
                      <div className="border-t border-stone-800 pt-1 pb-1 px-2">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            openAuthModal('login');
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs text-stone-400 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <LogIn className="w-3.5 h-3.5 text-stone-400" />
                          <span>Switch / Log in to another account</span>
                        </button>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-stone-800 pt-1">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            logout();
                          }}
                          className="w-full px-4 py-2 text-xs text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer transition-colors"
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
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-stone-300 hover:bg-white/10 border border-stone-800 transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="px-3.5 py-1.5 rounded-full bg-[#f2c89b] text-[#2b1f1a] text-xs font-bold shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Join Free</span>
                  </button>
                </div>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-full border border-stone-800 text-stone-300 hover:bg-white/10 cursor-pointer transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-stone-800 mt-3 pt-3 pb-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Explore Jobs', href: '/jobs', icon: Briefcase },
                  { label: 'Kanban Tracker', href: '/tracker', icon: Columns3 },
                  { label: 'Referrals', href: '/referrals', icon: Award },
                  { label: 'Community', href: '/community', icon: MessageSquare },
                  { label: 'Salaries', href: '/salaries', icon: TrendingUp },
                  { label: 'AI Copilot', href: '/ai-copilot', icon: Sparkles, isAi: true },
                ].map((item) => {
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
                          ? 'bg-[#f2c89b] text-[#2b1f1a] font-bold shadow-xs'
                          : 'text-stone-300 hover:bg-white/10 hover:text-white'
                      } ${item.isAi && !active ? 'border border-[#f2c89b]/40 text-[#f2c89b] bg-[#f2c89b]/5' : ''}`}
                    >
                      <Icon className={`w-4 h-4 ${item.isAi && !active ? 'text-[#f2c89b]' : ''}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
                {user ? (
                  <>
                    <span className="text-stone-400 text-[11px]">
                      Signed in as <strong className="text-white font-semibold">{user.full_name}</strong> ({user.role})
                    </span>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="text-rose-400 font-semibold hover:underline"
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
                      className="text-[#f2c89b] font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('signup');
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#f2c89b] text-[#2b1f1a] font-bold text-xs"
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
