import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatInterface() {
  const { messages, sendMessage, isTyping } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Determine if chat has started (more than just the initial bot greeting)
  // Assuming the first message is always the bot greeting.
  const hasStarted = messages.length > 1;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (hasStarted) {
      scrollToBottom();
    }
  }, [messages, isTyping, hasStarted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const suggestions = [
    "What are your core skills?",
    "Tell me about your projects",
    "What is your experience?",
    "Download Resume"
  ];

  return (
    <div className="flex flex-col h-full relative">
      
      {/* Hero Section (Centered) */}
      {!hasStarted && (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-8 animate-in fade-in duration-500">
          <div className="space-y-4 max-w-2xl">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <span className="text-4xl">👨‍💻</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              Keshav Tejra
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto leading-relaxed">
              Chat with my resume to learn about my experience, skills, and projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-4 text-left rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {suggestion}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat History (Standard View) */}
      {hasStarted && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-4 ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                {msg.isBot && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                    msg.isBot
                      ? 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none'
                      : 'bg-blue-600 text-white rounded-tr-none'
                  } ${msg.isError ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-600 dark:text-red-400' : ''}`}
                >
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>

                {!msg.isBot && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-gray-400 text-sm ml-12"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area (Fixed at bottom) */}
      <div className="p-4 md:p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={hasStarted ? "Ask a follow-up question..." : "Ask anything about Keshav..."}
                className="w-full p-4 pr-14 rounded-2xl bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 border focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-500"
            />
            <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
                <Send className="w-5 h-5" />
            </button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-3">
            AI can make mistakes. Please verify important information from the resume.
            </p>
        </div>
      </div>
    </div>
  );
}
