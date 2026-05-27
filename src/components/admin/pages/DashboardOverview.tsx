import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Award, Wrench, Settings, ArrowRight, TrendingUp, Briefcase, GraduationCap } from 'lucide-react';
import { useAllProjects } from '../../../hooks/cms/useProjects';
import { useAllCertificates } from '../../../hooks/cms/useCertificates';
import { useAllSkills } from '../../../hooks/cms/useSkills';
import { useAllExperiences } from '../../../hooks/cms/useExperiences';
import { useAllEducation } from '../../../hooks/cms/useEducation';
import { useSiteSettings } from '../../../hooks/cms/useSiteSettings';
import { Skeleton } from '../ui/Skeleton';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  to: string;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="group text-left w-full bg-white dark:bg-charcoal-800/60 border border-gray-200 dark:border-white/5 rounded-2xl p-6 hover:border-gray-300 dark:border-white/10 transition-all duration-200 hover:bg-gray-50 dark:bg-charcoal-800/80"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400 group-hover:translate-x-1 transition-all duration-200" />
    </div>
    <p className="text-3xl font-bold text-charcoal-900 dark:text-white mb-1">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </button>
);

const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const { data: projects, isLoading: projectsLoading } = useAllProjects();
  const { data: certs, isLoading: certsLoading } = useAllCertificates();
  const { data: skills, isLoading: skillsLoading } = useAllSkills();
  const { data: experiences, isLoading: experiencesLoading } = useAllExperiences();
  const { data: education, isLoading: educationLoading } = useAllEducation();
  const { data: settings } = useSiteSettings();

  const isLoading = projectsLoading || certsLoading || skillsLoading || experiencesLoading || educationLoading;

  const stats = [
    {
      label: 'Projects',
      value: projects?.length ?? 0,
      icon: <Code2 className="w-5 h-5" />,
      color: 'bg-blue-500/15 text-blue-400',
      to: '/.admin/dashboard/projects',
    },
    {
      label: 'Experience',
      value: experiences?.length ?? 0,
      icon: <Briefcase className="w-5 h-5" />,
      color: 'bg-green-500/15 text-green-400',
      to: '/.admin/dashboard/experiences',
    },
    {
      label: 'Education',
      value: education?.length ?? 0,
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'bg-orange-500/15 text-orange-400',
      to: '/.admin/dashboard/education',
    },
    {
      label: 'Certificates',
      value: certs?.length ?? 0,
      icon: <Award className="w-5 h-5" />,
      color: 'bg-accent-cyan/15 text-accent-cyan',
      to: '/.admin/dashboard/certificates',
    },
    {
      label: 'Skills',
      value: skills?.length ?? 0,
      icon: <Wrench className="w-5 h-5" />,
      color: 'bg-accent-purple/15 text-accent-purple',
      to: '/.admin/dashboard/skills',
    },
    {
      label: 'Visible Projects',
      value: projects?.filter(p => p.visible).length ?? 0,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-indigo-500/15 text-indigo-400',
      to: '/.admin/dashboard/projects',
    },
  ];

  const quickLinks = [
    { label: 'Edit Hero Section', path: '/.admin/dashboard/hero', icon: <Settings className="w-4 h-4" /> },
    { label: 'Add a Project', path: '/.admin/dashboard/projects/new', icon: <Code2 className="w-4 h-4" /> },
    { label: 'Add Experience', path: '/.admin/dashboard/experiences/new', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Site Settings', path: '/.admin/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900 dark:text-white font-['Space_Grotesk']">
            Welcome back 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {settings?.site_title ?? 'Portfolio'} · Content Manager
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent-cyan hover:underline"
        >
          View live portfolio →
        </a>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-charcoal-800/60 border border-gray-200 dark:border-white/5 rounded-2xl p-6">
                <Skeleton className="h-10 w-10 rounded-xl mb-4" />
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))
          : stats.map(stat => (
              <StatCard
                key={stat.label}
                {...stat}
                onClick={() => navigate(stat.to)}
              />
            ))
        }
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-base font-semibold text-charcoal-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 rounded-xl hover:bg-white dark:bg-charcoal-800/60 hover:border-gray-300 dark:border-white/10 transition-all duration-150 text-left group"
            >
              <span className="text-gray-500 group-hover:text-accent-cyan transition-colors">
                {link.icon}
              </span>
              <span className="text-sm text-gray-300 group-hover:text-charcoal-900 dark:text-white transition-colors">
                {link.label}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-600 ml-auto group-hover:translate-x-1 group-hover:text-gray-500 dark:text-gray-400 transition-all duration-150" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
