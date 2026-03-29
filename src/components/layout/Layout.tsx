import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout wrapper component
 * Provides consistent header and footer across all pages.
 * Top padding is removed for projects and homepage to allow hero section placement.
 */
export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isPortfolioPage = location.pathname === '/portfolio' || location.pathname === '/';
  const isProjectPage = location.pathname.startsWith('/project/');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isProjectPage && <Header />}
      <main
        id="main-content"
        className={cn(
          "flex-1 transition-all duration-300",
          (isPortfolioPage || isProjectPage) ? "pt-0" : "pt-16"
        )}
        tabIndex={-1}
      >
        {children}
      </main>
      {location.pathname !== '/portfolio' && !location.pathname.startsWith('/project/') && <Footer />}
    </div>
  );
}
