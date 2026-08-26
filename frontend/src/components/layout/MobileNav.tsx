'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, MessageSquare, Award, Columns3, Bot, Sparkles } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    { label: 'Jobs', href: '/jobs', icon: Briefcase },
    { label: 'Discuss', href: '/community', icon: MessageSquare },
    { label: 'Referrals', href: '/referrals', icon: Award },
    { label: 'Tracker', href: '/tracker', icon: Columns3 },
    { label: 'AI Copilot', href: '/ai-copilot', icon: Bot, isHighlight: true },
  ];

  const isActive = (href: string) => {
    if (href === '/jobs' && (pathname === '/jobs' || pathname.startsWith('/jobs/'))) return true;
    if (href === '/community' && (pathname === '/community' || pathname.startsWith('/community/'))) return true;
    if (href === '/referrals' && (pathname === '/referrals' || pathname.startsWith('/referrals/'))) return true;
    if (href === '/tracker' && (pathname === '/tracker' || pathname.startsWith('/tracker/'))) return true;
    if (href === '/ai-copilot' && (pathname === '/ai-copilot' || pathname.startsWith('/ai-copilot/'))) return true;
    return pathname === href;
  };

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 max-w-sm mx-auto floating-dock rounded-full border border-border/80 dark:border-white/10 px-2 py-1 shadow-xl shadow-black/15">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.isHighlight) {
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all cursor-pointer ${
                  active
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-primary hover:bg-primary/10'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 ${active ? 'scale-110' : ''}`} />
                  <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                </div>
                <span className="text-[9.5px] font-semibold mt-0.5">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all cursor-pointer ${
                active
                  ? 'text-primary font-bold bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'scale-110' : ''}`} />
              <span className="text-[9.5px] font-medium mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

