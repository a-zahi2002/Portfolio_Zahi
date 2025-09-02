import React from 'react';
import { Mail, Github, Linkedin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const contactLinks = {
    email: "a.zahi2002@gmail.com",
    github: "https://github.com/a-zahi2002",
    linkedin: "https://linkedin.com/in/a-zahi-faleel-a929411aa"
  };

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Contact Me
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-16 max-w-2xl mx-auto">
            I'd love to connect—feel free to reach out or follow me on these platforms.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <a
              href={`mailto:${contactLinks.email}`}
              className="group flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Mail className="w-5 h-5 mr-3 group-hover:animate-bounce" />
              <span className="font-medium">Send Email</span>
            </a>
            
            <div className="flex items-center gap-6">
              <a
                href={contactLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <Github className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
              </a>
              
              <a
                href={contactLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <Linkedin className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
              </a>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full">
              <Send className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Available for opportunities</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;