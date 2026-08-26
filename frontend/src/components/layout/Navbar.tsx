'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Coffee, Briefcase, MessageSquare, Award, Columns3, Bot,
  TrendingUp, Search, Sun, Moon, Bell, Menu, X, User, LogOut,
  ChevronDown, Sparkles
} from 'lucide-react';
import { GlobalSearchModal } from '@/components/common/GlobalSearchModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, switchPersona } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Explore Jobs', href: '/jobs', icon: Briefcase },
    { label: 'Discussions', href: '/community', icon: MessageSquare },
    { label: 'Referrals', href: '/referrals', icon: Award },
    { label: 'Kanban Tracker', href: '/tracker', icon: Columns3 },
    { label: 'AI Copilot', href: '/ai-copilot', icon: Bot, isHighlight: true },
    { label: 'Salaries', href: '/salaries', icon: TrendingUp },
  ];

  const isActive = (href: string) => {
    if (href === '/jobs' && (pathname === '/jobs' || pathname.startsWith('/jobs/'))) return true;
    if (href === '/community' && (pathname === '/community' || pathname.startsWith('/community/'))) return true;
    return pathname === href;
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-card/85 backdrop-blur-md border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#644a40] to-[#3e2723] dark:from-[#ffe0c2] dark:to-[#ffdfb5] flex items-center justify-center text-white dark:text-[#393028] shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                <Coffee className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-lg tracking-tight leading-none text-foreground flex items-center gap-1">
                  Career<span className="text-primary font-black">Brew</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wide">
                  The Unified Career OS
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                    } ${item.isHighlight && !active ? 'text-primary/90 font-semibold' : ''}`}
                  >
                    <Icon className={`w-4 h-4 ${item.isHighlight ? 'text-primary animate-pulse-subtle' : ''}`} />
                    <span>{item.label}</span>
                    {item.isHighlight && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-secondary text-secondary-foreground">
                        AI
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Button (Cmd+K) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition-all cursor-pointer shadow-2xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search everything...</span>
              <kbd className="hidden sm:inline-flex px-1.5 py-0.2 text-[10px] bg-card rounded border border-border font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Recruiter / Post Job Quick Link */}
            <button
              onClick={() => router.push('/recruiter')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                pathname === '/recruiter'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-primary/40 text-primary hover:bg-primary/10'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Recruiter Hub</span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
            </button>

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full border border-border bg-card hover:bg-accent transition-all cursor-pointer"
                >
                  <div className="flex flex-col text-right hidden xl:block">
                    <span className="text-xs font-semibold leading-tight text-foreground">{user.full_name}</span>
                    <span className="text-[10px] text-muted-foreground capitalize leading-tight">
                      ⭐ {user.karma_points} karma
                    </span>
                  </div>
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full object-cover border border-primary/20"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground mr-1" />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-card border border-border shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
                      <div className="px-4 py-2.5 border-b border-border">
                        <p className="text-xs font-semibold text-foreground">{user.full_name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                        <div className="mt-1.5 flex items-center justify-between text-[11px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">
                          <span>Role: {user.role.toUpperCase()}</span>
                          <span>{user.karma_points} Karma</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            router.push('/profile');
                          }}
                          className="w-full px-4 py-2 text-xs text-left text-foreground hover:bg-accent flex items-center gap-2 cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>My Profile & Resume</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            router.push('/tracker');
                          }}
                          className="w-full px-4 py-2 text-xs text-left text-foreground hover:bg-accent flex items-center gap-2 cursor-pointer"
                        >
                          <Columns3 className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>My Application Kanban</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            router.push('/referrals');
                          }}
                          className="w-full px-4 py-2 text-xs text-left text-foreground hover:bg-accent flex items-center gap-2 cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>My Referral Requests</span>
                        </button>
                      </div>

                      <div className="border-t border-border pt-1">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            logout();
                          }}
                          className="w-full px-4 py-2 text-xs text-left text-destructive hover:bg-destructive/10 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => switchPersona('candidate')}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:opacity-90 cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-border text-foreground hover:bg-accent cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border">
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
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium cursor-pointer ${
                      active
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push('/recruiter');
                }}
                className="flex items-center gap-1.5 text-primary font-semibold"
              >
                <Briefcase className="w-4 h-4" /> Recruiter Hub
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push('/profile');
                }}
                className="text-muted-foreground hover:text-foreground font-medium"
              >
                Edit Profile →
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
