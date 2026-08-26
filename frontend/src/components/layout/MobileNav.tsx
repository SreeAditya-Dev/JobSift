'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, MessageSquare, Award, Columns3, Bot } from 'lucide-react';

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
    return pathname === href;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border px-2 py-1.5 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all cursor-pointer ${
                active
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''}`} />
                {item.isHighlight && (
                  <span className="absolute -top-1 -right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
