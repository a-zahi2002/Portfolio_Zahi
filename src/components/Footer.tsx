import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-gray-400">Made with</span>
            <Heart className="w-4 h-4 text-red-500 mx-2 animate-pulse" />
            <span className="text-gray-400">using React & TailwindCSS</span>
          </div>
          
          <p className="text-gray-400 text-sm">
            © 2025 A. Zahi Faleel. All rights reserved.
          </p>
          
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Designed and developed with modern web technologies
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;