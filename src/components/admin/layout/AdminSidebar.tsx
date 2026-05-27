import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, Code2, Award, Wrench, Mail, Link2,
  Settings, Search, Image, LogOut, ChevronRight,
  Briefcase, GraduationCap
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  end?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Overview',     path: '/.admin/dashboard',               icon: <LayoutDashboard className="w-4 h-4" />, end: true },
  { label: 'Hero',         path: '/.admin/dashboard/hero',          icon: <User className="w-4 h-4" /> },
  { label: 'About',        path: '/.admin/dashboard/about',         icon: <User className="w-4 h-4" /> },
  { label: 'Projects',     path: '/.admin/dashboard/projects',      icon: <Code2 className="w-4 h-4" /> },
  { label: 'Experience',   path: '/.admin/dashboard/experiences',   icon: <Briefcase className="w-4 h-4" /> },
  { label: 'Education',    path: '/.admin/dashboard/education',     icon: <GraduationCap className="w-4 h-4" /> },
  { label: 'Certificates', path: '/.admin/dashboard/certificates',  icon: <Award className="w-4 h-4" /> },
  { label: 'Skills',       path: '/.admin/dashboard/skills',        icon: <Wrench className="w-4 h-4" /> },
  { label: 'Contact',      path: '/.admin/dashboard/contact',       icon: <Mail className="w-4 h-4" /> },
  { label: 'Social Links', path: '/.admin/dashboard/social-links',  icon: <Link2 className="w-4 h-4" /> },
  { label: 'SEO',          path: '/.admin/dashboard/seo',           icon: <Search className="w-4 h-4" /> },
  { label: 'Media',        path: '/.admin/dashboard/media',         icon: <Image className="w-4 h-4" /> },
  { label: 'Settings',     path: '/.admin/dashboard/settings',      icon: <Settings className="w-4 h-4" /> },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/.admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-accent-cyan/15 border border-blue-200 dark:border-accent-cyan/30 flex items-center justify-center">
            <span className="text-blue-600 dark:text-accent-cyan font-bold text-xs">A</span>
          </div>
          <div>
            <p className="text-charcoal-900 dark:text-white font-semibold text-sm font-['Space_Grotesk']">Portfolio CMS</p>
            <p className="text-gray-500 dark:text-gray-600 text-xs">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-150 group relative
              ${isActive
                ? 'text-blue-600 dark:text-accent-cyan bg-blue-50 dark:bg-accent-cyan/10 border border-blue-100 dark:border-accent-cyan/15'
                : 'text-gray-500 dark:text-gray-400 hover:text-charcoal-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
              }
            `}
          >
            {item.icon}
            <span>{item.label}</span>
            <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-accent-purple/20 border border-purple-200 dark:border-accent-purple/30 flex items-center justify-center shrink-0">
            <span className="text-purple-600 dark:text-accent-cyan text-xs font-bold">
              {user?.email?.[0]?.toUpperCase() ?? 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-charcoal-900 dark:text-white text-xs font-medium truncate">{user?.email ?? 'Admin'}</p>
            <p className="text-gray-500 dark:text-gray-600 text-xs">Administrator</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 h-screen sticky top-0 bg-white/90 dark:bg-charcoal-900/90 border-r border-gray-200 dark:border-white/5 backdrop-blur-xl transition-colors duration-300">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 z-50 w-56 h-full bg-white dark:bg-charcoal-900 border-r border-gray-200 dark:border-white/5 flex flex-col lg:hidden transition-colors duration-300"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
