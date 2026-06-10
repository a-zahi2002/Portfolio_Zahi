// CYBER TERMINAL THEME
// App.tsx — Clean layout with 3D hero, audio system, and HUD frame.
// CMS/routing/data: UNTOUCHED.

import React, { useEffect, lazy, Suspense, useState, useCallback } from 'react';
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

// ── Cyber Terminal Animation Layer ──────────────────────────────────────────────
import SmoothScrollProvider from './components/SmoothScrollProvider';
import ScrollProgressBar from './components/ScrollProgressBar';
import CyberGrid from './components/CyberGrid';
import Preloader from './components/Preloader';
import CyberCursor from './components/CyberCursor';
import NeonFrame from './components/NeonFrame';
import HeroScene from './components/three/HeroScene';
import { AudioProvider } from './components/audio/AudioProvider';

/** Portfolio single-page layout */
const Portfolio: React.FC = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      initScrollAnimations();
    }, 100);

    // Track scroll progress for 3D scene transition
    const handleScroll = () => {
      const maxScroll = window.innerHeight;
      const progress = Math.min(1, window.scrollY / maxScroll);
      setScrollProgress(progress);
    };

    // Mouse parallax
    const mediaQuery = window.matchMedia('(hover: hover)');
    let removeMouseListeners: (() => void) | null = null;

    if (mediaQuery.matches) {
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        document.documentElement.style.setProperty('--mouse-x', x.toString());
        document.documentElement.style.setProperty('--mouse-y', y.toString());
      };

      const handleMouseLeave = () => {
        document.documentElement.style.setProperty('--mouse-x', '0');
        document.documentElement.style.setProperty('--mouse-y', '0');
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
      removeMouseListeners = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      removeMouseListeners?.();
    };
  }, []);

  return (
    <div className="min-h-screen text-charcoal-900 dark:text-white selection:bg-accent-cyan/20 selection:text-white">
      {/* ── Ambient Background Grid ── */}
      <CyberGrid />

      {/* ── 3D Hero Scene (transitions to ambient on scroll) ── */}
      <HeroScene scrollProgress={scrollProgress} />

      {/* ── Preloader ── */}
      <Preloader onComplete={handlePreloaderComplete} />

      {/* ── Neon Frame — fades in after preloader ── */}
      <NeonFrame isVisible={preloaderDone} />

      <SEOHead route="/" />
      <Navbar />

      <main className="relative z-10">
        <Hero />

        <div className="section-beam my-8" />
        <About />

        <div className="section-beam my-8" />
        <Journey />

        <div className="section-beam my-8" />
        <Certificates />

        <div className="section-beam my-8" />
        <Projects />

        <div className="section-beam my-8" />
        <Skills />

        <div className="section-beam my-8" />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AudioProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ct-bg)' }}>
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
                <CyberCursor />
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
    </AudioProvider>
  );
};

export default App;