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
import SEOHead from './components/SEOHead';
import ProtectedRoute from './components/admin/guards/ProtectedRoute';
import { initScrollAnimations, destroyScrollAnimations } from './utils/animations';

// Lazy-load admin pages to keep portfolio bundle lean
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./components/admin/layout/AdminLayout'));

/** Portfolio single-page layout (unchanged) */
const Portfolio: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      initScrollAnimations();
    }, 100);
    return () => {
      clearTimeout(timer);
      destroyScrollAnimations();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-charcoal-950 text-charcoal-900 dark:text-gray-200 selection:bg-accent-gold selection:text-charcoal-950 transition-colors duration-500 relative">
      <div className="noise-overlay pointer-events-none" />
      <SEOHead route="/" />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Certificates />
        <Skills />
        <Contact />
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
        {/* Portfolio */}
        <Route path="/" element={<Portfolio />} />

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