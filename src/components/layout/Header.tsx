import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/portfolio' },
  { name: 'Certificates', path: '/certificates' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

/**
 * Main header component with scroll-aware styling
 * Transparent on hero section, solid when scrolled
 * Mobile responsive with hamburger menu
 */
// 3 animation variants that cycle every 2 seconds
const pAnimations = [
  // 1: Typewriter expand
  {
    collapsed: { width: 0, opacity: 0 },
    expanded: { width: 'auto', opacity: 1, transition: { duration: 0.35 } },
    exit: { width: 0, opacity: 0, transition: { duration: 0.25 } },
  },
  // 2: Blur reveal
  {
    collapsed: { opacity: 0, filter: 'blur(8px)', width: 0 },
    expanded: { opacity: 1, filter: 'blur(0px)', width: 'auto', transition: { duration: 0.35 } },
    exit: { opacity: 0, filter: 'blur(8px)', width: 0, transition: { duration: 0.25 } },
  },
  // 3: Slide up reveal
  {
    collapsed: { opacity: 0, y: 12, width: 0 },
    expanded: { opacity: 1, y: 0, width: 'auto', transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -12, width: 0, transition: { duration: 0.2 } },
  },
];

function AnimatedName() {
  const [expanded, setExpanded] = useState(false);
  const [animIndex, setAnimIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setExpanded(prev => {
        if (!prev) {
          // expanding — pick next animation style
          setAnimIndex(i => (i + 1) % 3);
        }
        return !prev;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const variant = pAnimations[animIndex];

  return (
    <span className="inline-flex items-baseline whitespace-nowrap">
      ANSHUL{' '}
      <span
        className="relative inline-flex items-baseline cursor-pointer"
        onClick={() => setExpanded(e => !e)}
        onMouseEnter={() => setExpanded(true)}
        onTouchStart={() => setExpanded(true)}
      >
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.span
              key="prakash"
              initial={variant.collapsed as any}
              animate={variant.expanded as any}
              exit={variant.exit as any}
              className="overflow-hidden inline-block"
              style={{ whiteSpace: 'nowrap' }}
            >
              PRAKASH
            </motion.span>
          ) : (
            <motion.span
              key="p"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              P.
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {' '}RATHOD
    </span>
  );
}

export function Header() {
  const location = useLocation();
  const { isScrolled } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Header is transparent only on homepage hero when not scrolled
  const isTransparent = location.pathname === '/' && !isScrolled;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isTransparent
          ? 'bg-transparent'
          : 'bg-background/90 backdrop-blur-lg border-b border-border shadow-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className={cn(
              'text-lg font-light tracking-widest transition-all duration-300',
              'text-foreground hover:text-foreground/80'
            )}
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <AnimatedName />
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Link
                    to={link.path}
                    className={cn(
                      "relative text-lg leading-7 font-light tracking-wide transition-colors duration-300",
                      isTransparent
                        ? "text-foreground hover:text-muted-foreground"
                        : "text-foreground hover:text-muted-foreground"
                    )}
                  >
                    {link.name}
                    {/* Active underline */}
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <ThemeToggle />
            </motion.div>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'size-9',
                    isTransparent && 'text-white hover:bg-white/10'
                  )}
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80">
                <nav className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg leading-7 font-light tracking-wide text-foreground hover:text-foreground/80"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
