import React from 'react';
import { Code, Database, Wrench, Layers } from 'lucide-react';
import { SkillCategory } from '../types';

const Skills: React.FC = () => {
  const skillCategories: SkillCategory = {
    "Frontend": ["React", "TailwindCSS", "HTML", "CSS", "JavaScript"],
    "Frameworks & Tools": ["Vite", "Angular", "Electron"],
    "Backend & Databases": ["Node.js","php", "SQLite", "MySQL"],
    "Other": ["Git", "GitHub"]
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Frontend':
        return <Code className="w-6 h-6" />;
      case 'Frameworks & Tools':
        return <Wrench className="w-6 h-6" />;
      case 'Backend & Databases':
        return <Database className="w-6 h-6" />;
      default:
        return <Layers className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Frontend':
        return 'from-blue-500 to-blue-600';
      case 'Frameworks & Tools':
        return 'from-indigo-500 to-indigo-600';
      case 'Backend & Databases':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Skills
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(skillCategories).map(([category, skills], categoryIndex) => (
              <div
                key={category}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${getCategoryColor(category)} text-white mr-4`}>
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category}
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {skills.map((skill, skillIndex) => (
                    <div
                      key={skill}
                      className="skill-item bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg text-center hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 cursor-default group"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;