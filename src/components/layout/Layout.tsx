import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
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
  const isHomepage = location.pathname === '/';
  // Check if it's a project detail or portfolio page to remove the black strip padding
  const isNoPaddingPage = isHomepage || location.pathname.startsWith('/project/') || location.pathname === '/portfolio';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main
        id="main-content"
        className={`flex-1 ${isNoPaddingPage ? '' : 'pt-16'}`}
        tabIndex={-1}
      >
        {children}
      </main>
      {location.pathname !== '/portfolio' && !location.pathname.startsWith('/project/') && <Footer />}
    </div>
  );
}
