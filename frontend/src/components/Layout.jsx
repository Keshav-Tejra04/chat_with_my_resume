import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, Menu, X, Github, Linkedin, FileText, Info, Upload, RotateCcw, Download, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../api';
import ThemeToggle from './ThemeToggle';
import FileUpload from './FileUpload';
import { useChat } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { resumeName, resetToDefault } = useChat();

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${API_BASE_URL}/download-resume`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Keshav_Tejra_Resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-200 dark:bg-[#212121] text-gray-800 dark:text-gray-100 transition-colors duration-300 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:relative z-50 w-80 h-full bg-gray-100 dark:bg-[#171717] border-r border-black/5 dark:border-white/5 flex flex-col shadow-2xl md:shadow-none transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#2f2f2f] flex items-center justify-center shadow-sm border border-black/5 dark:border-white/5">
              <MessageSquare className="w-6 h-6 text-gray-800 dark:text-gray-100" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                Resume Chat
              </h1>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-[#2f2f2f] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-8">
          
          <div className="px-6">    
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>About Me</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#2f2f2f] border border-black/5 dark:border-white/5 shadow-sm">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                I am a passionate developer. This AI assistant is trained on my resume to answer your questions about my skills, experience, and projects.
              </p>
            </div>
          </div>

          {resumeName !== "Keshav Tejra" && (
            <div className="px-6">
               <button
                  onClick={resetToDefault}
                  className="flex items-center gap-2 w-full p-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-[#2f2f2f] hover:bg-gray-50 dark:hover:bg-[#3f3f3f] transition-colors border border-black/5 dark:border-white/5"
               >
                  <RotateCcw className="w-4 h-4" />
                  Back to Keshav's Resume
               </button>
            </div>
          )}



        </div>

        <div className="p-6 border-t border-black/5 dark:border-white/5 space-y-4">
            {/* Upload Section */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#2f2f2f] border border-black/5 dark:border-white/5">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Want to test on your own resume?
                </h3>
                <div className="mt-2">
                    <FileUpload />
                </div>
            </div>



          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <a href="https://github.com/Keshav-Tejra04/" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-200 dark:hover:bg-[#2f2f2f] rounded-xl transition-colors text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/keshav-tejra/" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-200 dark:hover:bg-[#2f2f2f] rounded-xl transition-colors text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#"
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 dark:hover:bg-[#2f2f2f] rounded-xl transition-colors text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400" 
                title="Download Resume"
              >
                <Download className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">Download My Resume</span>
              </a>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative bg-gray-200 dark:bg-[#212121]">
        <header className="h-16 md:hidden flex items-center px-4 border-b border-black/5 dark:border-white/5 bg-gray-100 dark:bg-[#171717] sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-stone-200 dark:hover:bg-zinc-900 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-semibold">Chat</span>
        </header>

        {/* Desktop Reset Chat & Theme Toggle Button (Top Right) */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
            <ThemeToggle />
            <button 
                onClick={resetToDefault}
                className="p-2 flex items-center gap-2 bg-white/80 dark:bg-[#2f2f2f]/80 backdrop-blur-sm border border-black/5 dark:border-white/5 shadow-sm rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#3f3f3f] transition-all"
                title="Reset Chat"
            >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden lg:inline">Reset</span>
            </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </main>
    </div>
  );
}
