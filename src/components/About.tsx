import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            About Me
          </h2>
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/3">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="A. Zahi Faleel"
                  className="w-80 h-80 object-cover rounded-2xl shadow-2xl mx-auto transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-white text-2xl font-bold">👨‍💻</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-2/3">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Student and passionate developer on a journey through clean, responsive, user-focused web experiences. 
                  I'm always learning and excited by modern technologies.
                </p>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  My passion lies in creating beautiful, functional web applications that solve real-world problems. 
                  I believe in the power of clean code, thoughtful design, and continuous learning.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Frontend Focus</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">React, TypeScript, Modern CSS</p>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-2">Always Learning</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">New technologies & best practices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;