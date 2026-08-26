'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';
import { DashboardTopBar } from './DashboardTopBar';
import { SidebarProvider } from '@/context/SidebarContext';
import { BannerWithLinkButtons } from '@/components/ui/banner-demo';

const MARKETING_ROUTES = new Set(['/']);

export const AppFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isMarketing = MARKETING_ROUTES.has(pathname);

  if (isMarketing) {
    return (
      <>
        <BannerWithLinkButtons />
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <Footer />
        <MobileNav />
      </>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex w-full items-start px-3 gap-0 lg:gap-0">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <DashboardTopBar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-6 sm:py-8 pb-24 lg:pb-8">
            {children}
          </main>
        </div>
      </div>
      <MobileNav />
    </SidebarProvider>
  );
};
