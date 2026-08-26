'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import { GlobalSearchModal } from '@/components/common/GlobalSearchModal';
import { Menu, Search } from 'lucide-react';

export const DashboardTopBar: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { openMobile } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  return (
    <>
      <header className="sticky top-3 z-30 px-3 pt-3 lg:pl-0">
        <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-card/90 backdrop-blur-xl shadow-sm px-3 py-2.5">
          <button
            onClick={openMobile}
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-[18px] h-[18px]" strokeWidth={1.9} />
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border bg-background/70 hover:bg-accent/60 text-muted-foreground text-xs transition-colors cursor-pointer group"
          >
            <Search className="w-[15px] h-[15px] text-muted-foreground group-hover:text-foreground transition-colors shrink-0" strokeWidth={1.9} />
            <span className="hidden sm:inline">Search jobs, people, companies...</span>
            <span className="sm:hidden">Search</span>
            <kbd className="hidden sm:inline-flex ml-auto items-center px-1.5 py-0.5 text-[10px] bg-muted rounded-md border border-border font-mono font-semibold text-muted-foreground">
              &#8984;K
            </kbd>
          </button>

          {user && (
            <button
              onClick={() => router.push('/profile')}
              className="shrink-0 rounded-full cursor-pointer focus:outline-none"
              aria-label="Go to profile"
            >
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user.full_name}
                className="w-8 h-8 rounded-full object-cover border border-border"
              />
            </button>
          )}
        </div>
      </header>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
