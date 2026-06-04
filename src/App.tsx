// JARVIS-OS THEME — animation layer rewired.
// App.tsx: Replaces AuroraBackground→JarvisGrid, CustomCursor→JarvisCursor,
// SectionReveal+SectionConnector→OsModule+SystemHandoff.
// Adds JarvisPreloader and HudFrame. CMS/routing/data: UNTOUCHED.

import React, { useEffect, lazy, Suspense, useState } from 'react';
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

// ── JARVIS-OS Animation Layer ─────────────────────────────────────────────────
import SmoothScrollProvider from './components/SmoothScrollProvider';
import ScrollProgressBar from './components/ScrollProgressBar';
import JarvisGrid from './components/JarvisGrid';
import JarvisPreloader from './components/JarvisPreloader';
import HudFrame from './components/HudFrame';
import JarvisCursor from './components/JarvisCursor';
import OsModule from './components/OsModule';
import SystemHandoff from './components/SystemHandoff';
import { JarvisAudio } from './lib/JarvisAudio';

/** Portfolio single-page layout */
const Portfolio: React.FC = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      initScrollAnimations();
    }, 100);

    const mediaQuery = window.matchMedia('(hover: hover)');
    if (!mediaQuery.matches) return () => clearTimeout(timer);

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

    // Attach JARVIS audio global delegation
    const detachAudio = JarvisAudio.attachGlobalDelegation();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      detachAudio();
    };
  }, []);

  return (
    <div className="min-h-screen text-charcoal-900 dark:text-white selection:bg-accent-cyan selection:text-charcoal-950">
      {/* ── JARVIS Ambient Background (replaces AuroraBackground) ── */}
      <JarvisGrid />

      {/* ── JARVIS Boot Preloader ─────────────────────────────────── */}
      <JarvisPreloader onComplete={() => setPreloaderDone(true)} />

      {/* ── HUD Frame — fades in after preloader ─────────────────── */}
      <HudFrame isVisible={preloaderDone} />

      <SEOHead route="/" />
      <Navbar />

      <main className="relative z-10">
        {/* ── MODULE 01: IDENTITY_SCAN (Hero) ─────────────────────── */}
        <OsModule moduleId="MODULE_01" protocolName="IDENTITY_SCAN">
          <Hero />
        </OsModule>

        <SystemHandoff from="MODULE_01" to="MODULE_02" />

        {/* ── MODULE 02: BIO_ANALYSIS (About) ─────────────────────── */}
        <OsModule moduleId="MODULE_02" protocolName="BIO_ANALYSIS">
          <About />
        </OsModule>

        <SystemHandoff from="MODULE_02" to="MODULE_03" />

        {/* ── MODULE 03: MISSION_LOG (Journey) ────────────────────── */}
        <OsModule moduleId="MODULE_03" protocolName="MISSION_LOG">
          <Journey />
        </OsModule>

        <SystemHandoff from="MODULE_03" to="MODULE_04" />

        {/* ── MODULE 04: CREDENTIAL_MAP (Certificates) ────────────── */}
        <OsModule moduleId="MODULE_04" protocolName="CREDENTIAL_MAP">
          <Certificates />
        </OsModule>

        <SystemHandoff from="MODULE_04" to="MODULE_05" />

        {/* ── MODULE 05: ARTIFACT_REGISTRY (Projects) ─────────────── */}
        <OsModule moduleId="MODULE_05" protocolName="ARTIFACT_REGISTRY">
          <Projects />
        </OsModule>

        <SystemHandoff from="MODULE_05" to="MODULE_06" />

        {/* ── MODULE 06: CAPABILITY_INDEX (Skills) ─────────────────── */}
        <OsModule moduleId="MODULE_06" protocolName="CAPABILITY_INDEX">
          <Skills />
        </OsModule>

        <SystemHandoff from="MODULE_06" to="MODULE_07" />

        {/* ── MODULE 07: COMM_CHANNEL (Contact) ────────────────────── */}
        <OsModule moduleId="MODULE_07" protocolName="COMM_CHANNEL">
          <Contact />
        </OsModule>
      </main>

      <Footer />
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
              <JarvisCursor />
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