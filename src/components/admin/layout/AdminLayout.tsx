import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu, ExternalLink } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import DarkModeToggle from '../../DarkModeToggle';

// Admin pages
import DashboardOverview from '../pages/DashboardOverview';
import HeroEditor from '../pages/HeroEditor';
import AboutEditor from '../pages/AboutEditor';
import ProjectsList from '../pages/ProjectsList';
import ProjectEditor from '../pages/ProjectEditor';
import CertificatesList from '../pages/CertificatesList';
import CertificateEditor from '../pages/CertificateEditor';
import SkillsList from '../pages/SkillsList';
import ContactEditor from '../pages/ContactEditor';
import SocialLinksList from '../pages/SocialLinksList';
import SiteSettingsEditor from '../pages/SiteSettingsEditor';
import SeoManager from '../pages/SeoManager';
import MediaLibrary from '../pages/MediaLibrary';
import ExperiencesList from '../pages/ExperiencesList';
import ExperienceEditor from '../pages/ExperienceEditor';
import EducationList from '../pages/EducationList';
import EducationEditor from '../pages/EducationEditor';

/** Breadcrumb map for page titles */
const breadcrumbMap: Record<string, string> = {
  '': 'Overview',
  'hero': 'Hero Section',
  'about': 'About Section',
  'projects': 'Projects',
  'experiences': 'Experience',
  'education': 'Education',
  'certificates': 'Certificates',
  'skills': 'Skills',
  'contact': 'Contact',
  'social-links': 'Social Links',
  'seo': 'SEO',
  'media': 'Media Library',
  'settings': 'Site Settings',
};

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Derive breadcrumb from path
  const pathSegments = location.pathname.replace('/.admin/dashboard', '').split('/').filter(Boolean);
  const currentPage = breadcrumbMap[pathSegments[0] ?? ''] ?? 'Dashboard';

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-charcoal-950 text-charcoal-900 dark:text-white transition-colors duration-300">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-charcoal-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-600 uppercase tracking-wider">Portfolio CMS</p>
              <h2 className="text-sm font-semibold text-charcoal-900 dark:text-white">{currentPage}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-500 hover:text-blue-600 dark:hover:text-accent-cyan transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Portfolio</span>
            </a>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="hero" element={<HeroEditor />} />
            <Route path="about" element={<AboutEditor />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectEditor />} />
            <Route path="projects/:id" element={<ProjectEditor />} />
            <Route path="experiences" element={<ExperiencesList />} />
            <Route path="experiences/new" element={<ExperienceEditor />} />
            <Route path="experiences/:id" element={<ExperienceEditor />} />
            <Route path="education" element={<EducationList />} />
            <Route path="education/new" element={<EducationEditor />} />
            <Route path="education/:id" element={<EducationEditor />} />
            <Route path="certificates" element={<CertificatesList />} />
            <Route path="certificates/new" element={<CertificateEditor />} />
            <Route path="certificates/:id" element={<CertificateEditor />} />
            <Route path="skills" element={<SkillsList />} />
            <Route path="contact" element={<ContactEditor />} />
            <Route path="social-links" element={<SocialLinksList />} />
            <Route path="seo" element={<SeoManager />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="settings" element={<SiteSettingsEditor />} />
            <Route path="*" element={<Navigate to="/.admin/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
