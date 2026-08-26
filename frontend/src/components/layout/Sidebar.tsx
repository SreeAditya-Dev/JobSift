'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import {
  Compass, Briefcase, Columns3, Award, MessageSquare, TrendingUp,
  Sparkles, LayoutDashboard, User, ChevronLeft, ChevronRight,
  ChevronsUpDown, LogOut, LogIn, UserPlus, X, ShieldCheck,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  roles?: UserRole[];
}

const PRIMARY_NAV: NavItem[] = [
  { label: 'Explore Jobs', href: '/jobs', icon: Briefcase },
  { label: 'Tracker', href: '/tracker', icon: Columns3, roles: ['candidate'] },
  { label: 'Referrals', href: '/referrals', icon: Award },
  { label: 'Community', href: '/community', icon: MessageSquare },
  { label: 'Salaries', href: '/salaries', icon: TrendingUp },
  { label: 'AI Copilot', href: '/ai-copilot', icon: Sparkles },
];

const isRouteActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

const SidebarInner: React.FC<{ collapsed: boolean; onNavigate?: () => void }> = ({
  collapsed,
  onNavigate,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, openAuthModal } = useAuth();
  const { toggleCollapsed } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const go = (href: string) => {
    router.push(href);
    onNavigate?.();
  };

  const items: NavItem[] = [
    ...(user?.role === 'recruiter'
      ? [{ label: 'Command Center', href: '/recruiter', icon: LayoutDashboard } as NavItem]
      : []),
    ...PRIMARY_NAV.filter((item) => !item.roles || !user || item.roles.includes(user.role)),
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Brand + collapse toggle */}
      <div className={cn('flex items-center gap-2 px-3 pt-1', collapsed ? 'justify-center' : 'justify-between')}>
        <button
          onClick={() => go('/')}
          className="flex items-center gap-2.5 cursor-pointer select-none focus:outline-none"
          aria-label="JobSift Home"
        >
          <div className="w-9 h-9 shrink-0 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <Compass className="w-4.5 h-4.5" strokeWidth={2.2} />
          </div>
          {!collapsed && (
            <span className="font-extrabold text-[15px] tracking-tight text-foreground whitespace-nowrap">
              Job<span className="text-primary font-black">Sift</span>
            </span>
          )}
        </button>

        {!collapsed && (
          <button
            onClick={toggleCollapsed}
            className="hidden lg:flex p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2} />
          </button>
        )}
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={toggleCollapsed}
          className="hidden lg:flex mx-auto mt-3 p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={2} />
        </button>
      )}

      {/* Primary navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 mt-5 space-y-1">
        {!collapsed && (
          <p className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
        )}
        {items.map((item) => {
          const active = isRouteActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <button
              key={item.href}
              onClick={() => go(item.href)}
              title={collapsed ? item.label : undefined}
              className={cn(
                'group w-full flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-[13px] font-medium transition-colors cursor-pointer',
                collapsed && 'justify-center',
                active
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-foreground/70 hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon
                className={cn('w-[18px] h-[18px] shrink-0', active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')}
                strokeWidth={1.75}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer: account */}
      <div className="p-2.5 border-t border-border/70 mt-2">
        {user ? (
          <div className="relative" ref={menuRef}>
            {menuOpen && (
              <div
                className={cn(
                  'absolute bottom-full mb-2 rounded-2xl bg-popover border border-border shadow-xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95',
                  collapsed ? 'left-0 w-64' : 'left-0 right-0'
                )}
              >
                <div className="px-3.5 py-2.5 border-b border-border/70">
                  <p className="text-xs font-bold text-foreground truncate">{user.full_name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> {user.role}
                  </span>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); go('/profile'); }}
                  className="w-full px-3.5 py-2 text-xs text-left text-foreground/80 hover:bg-accent flex items-center gap-2.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Profile & Settings</span>
                </button>
                <button
                  onClick={() => { setMenuOpen(false); logout(); }}
                  className="w-full px-3.5 py-2 text-xs text-left text-destructive hover:bg-destructive/10 flex items-center gap-2.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={cn(
                'w-full flex items-center gap-2.5 rounded-xl p-2 hover:bg-accent transition-colors cursor-pointer',
                collapsed && 'justify-center'
              )}
            >
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user.full_name}
                className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
              />
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[12.5px] font-bold text-foreground truncate leading-tight">{user.full_name}</p>
                    <p className="text-[10.5px] text-muted-foreground truncate capitalize">{user.role}</p>
                  </div>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </>
              )}
            </button>
          </div>
        ) : collapsed ? (
          <button
            onClick={() => openAuthModal('login')}
            className="w-full flex items-center justify-center p-2.5 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            title="Sign in"
          >
            <LogIn className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </button>
        ) : (
          <div className="space-y-1.5">
            <button
              onClick={() => openAuthModal('signup')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Join Free</span>
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border text-foreground/80 text-xs font-semibold hover:bg-accent transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const { collapsed, mobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {/* Desktop rail */}
      <aside
        className={cn(
          'hidden lg:flex sticky top-3 h-[calc(100vh-1.5rem)] shrink-0 flex-col rounded-3xl border border-border bg-card shadow-sm transition-[width] duration-300 ease-in-out',
          collapsed ? 'w-[76px]' : 'w-[264px]'
        )}
      >
        <SidebarInner collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={closeMobile}
          />
          <aside className="absolute left-3 top-3 bottom-3 w-72 max-w-[85vw] rounded-3xl border border-border bg-card shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <SidebarInner collapsed={false} onNavigate={closeMobile} />
          </aside>
        </div>
      )}
    </>
  );
};
