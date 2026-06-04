import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Journey from './components/Journey';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead.tsx';
import ProtectedRoute from './components/admin/guards/ProtectedRoute';
import { initScrollAnimations } from './utils/animations';

// Lazy-load admin pages to keep portfolio bundle lean
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./components/admin/layout/AdminLayout.tsx'));

import AuroraBackground from './components/ui/AuroraBackground';

// ── Animation Layer — additive, no CMS/data changes ──────────────────────────
import SmoothScrollProvider from './providers/SmoothScrollProvider';
import ScrollProgressBar from './components/ScrollProgressBar';
import CustomCursor from './components/CustomCursor';
import UniverseSection from './components/UniverseSection';
import WormholeConnector from './components/WormholeConnector';
import Preloader from './components/Preloader';
import AmbientCanvas from './components/AmbientCanvas';

/** Portfolio single-page layout (unchanged) */
const Portfolio: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      initScrollAnimations();
    }, 100);

    const mediaQuery = window.matchMedia('(hover: hover)');
    if (!mediaQuery.matches) return () => clearTimeout(timer);

    // ✅ PERF: rAF gate — CSS vars written at most once per animation frame,
    // not on every pixel of mouse movement (which triggers cascading style recalcs).
    let rafPending = false;
    let pendingX = 0;
    let pendingY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = (e.clientX / window.innerWidth) - 0.5;
      pendingY = (e.clientY / window.innerHeight) - 0.5;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--mouse-x', pendingX.toString());
          document.documentElement.style.setProperty('--mouse-y', pendingY.toString());
          rafPending = false;
        });
      }
    };

    const handleMouseLeave = () => {
      rafPending = false;
      document.documentElement.style.setProperty('--mouse-x', '0');
      document.documentElement.style.setProperty('--mouse-y', '0');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="min-h-screen text-charcoal-900 dark:text-white selection:bg-accent-cyan selection:text-charcoal-950">
      <AuroraBackground />
      <AmbientCanvas />
      <Preloader onComplete={() => {}} />
      <SEOHead route="/" />
      <Navbar />
      <main className="relative z-10" style={{ visibility: 'hidden' }}>
        <UniverseSection theme="void">
          <Hero />
        </UniverseSection>

        <WormholeConnector />

        <UniverseSection theme="nebula">
          <About />
        </UniverseSection>

        <WormholeConnector />

        <UniverseSection theme="constellation">
          <Journey />
        </UniverseSection>

        <WormholeConnector />

        <UniverseSection theme="artifact">
          <Projects />
        </UniverseSection>

        <WormholeConnector />

        <UniverseSection theme="frequency">
          <Certificates />
        </UniverseSection>

        <WormholeConnector />

        <UniverseSection theme="frequency">
          <Skills />
        </UniverseSection>

        <WormholeConnector />

        <UniverseSection theme="signal">
          <Contact />
        </UniverseSection>
      </main>
      <UniverseSection theme="abyss">
        <Footer />
      </UniverseSection>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-charcoal-950 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <Routes>
        {/* Portfolio — wrapped with animation providers */}
        <Route
          path="/"
          element={
            <SmoothScrollProvider>
              <ScrollProgressBar />
              <CustomCursor />
              <Portfolio />
            </SmoothScrollProvider>
          }
        />

        {/* Admin Login */}
        <Route path="/.admin" element={<Navigate to="/.admin/login" replace />} />
        <Route path="/.admin/login" element={<AdminLogin />} />

        {/* Protected Admin Dashboard — all sub-routes handled inside AdminLayout */}
        <Route
          path="/.admin/dashboard/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;