import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { AppFrame } from '@/components/layout/AppFrame';

export const metadata: Metadata = {
  title: 'JobSift | The Unified One-Stop Career Operating System',
  description:
    'Rethinking the modern job search. Unified job discovery, insider debriefs, verified referral matchmaking, and an interactive AI copilot in a cohesive modern platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-secondary selection:text-secondary-foreground">
        <ThemeProvider>
          <AuthProvider>
            <AppFrame>{children}</AppFrame>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
