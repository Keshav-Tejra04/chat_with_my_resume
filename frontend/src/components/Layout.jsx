import React, { useState } from 'react';
import { MessageSquare, Menu, X, Github, Linkedin } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import FileUpload from './FileUpload';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:relative z-50 w-80 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-2xl md:shadow-none transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Resume Chat
            </h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <div className="px-4 mb-8">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
              Context
            </h2>
            <FileUpload />
          </div>

          <div className="px-6">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">About</h3>
              <p className="text-sm text-blue-600/80 dark:text-blue-300/70">
                This AI assistant is trained on Keshav Tejra's resume. Ask about skills, experience, or projects!
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <a href="#" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative">
        <header className="h-16 md:hidden flex items-center px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-semibold">Chat</span>
        </header>

        <div className="flex-1 p-4 md:p-6 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
