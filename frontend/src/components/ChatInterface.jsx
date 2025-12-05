import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, MessageSquare, FileText } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatInterface() {
  const { messages, sendMessage, isTyping, resumeName } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const hasStarted = messages.length > 1;
  const isPortfolio = resumeName === "Keshav Tejra";

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

  // Helper to parse message and extract follow-ups
  const parseMessage = (text) => {
    const followUpMarker = "FOLLOW_UPS:";
    if (text.includes(followUpMarker)) {
      const [mainText, followUpsString] = text.split(followUpMarker);
      try {
        const followUps = JSON.parse(followUpsString.trim());
        return { mainText: mainText.trim(), followUps };
      } catch (e) {
        console.error("Failed to parse follow-ups", e);
        return { mainText: text, followUps: [] };
      }
    }
    return { mainText: text, followUps: [] };
  };

  const suggestions = isPortfolio ? [
    "What are your core skills?",
    "Tell me about your projects",
    "What is your experience?",
    "Download Resume"
  ] : [
    "Summarize this resume",
    "What are the key skills?",
    "Experience highlights",
    "Education details"
  ];

  return (
    <div className="flex flex-col h-full relative">
      
      {/* Hero Section (Centered) */}
      {!hasStarted && (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-8 animate-in fade-in duration-500">
          <div className="space-y-4 max-w-2xl">
            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-sm ${isPortfolio ? 'bg-white dark:bg-[#2f2f2f]' : 'bg-white dark:bg-[#2f2f2f]'}`}>
              <span className="text-4xl">{isPortfolio ? '👨‍💻' : '📄'}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">
              {isPortfolio ? "Keshav Tejra" : `Chat with ${resumeName}`}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
              {isPortfolio 
                ? "Chat with my resume to learn about my experience, skills, and projects."
                : "Ask questions to extract insights from this resume."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-4 text-left rounded-xl bg-white dark:bg-[#2f2f2f] border border-black/5 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-[#3f3f3f] transition-all group"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                  {suggestion}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat History (Standard View) */}
      {hasStarted && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((msg, index) => {
              const { mainText, followUps } = msg.isBot ? parseMessage(msg.text) : { mainText: msg.text, followUps: [] };

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col gap-2 ${msg.isBot ? 'items-start' : 'items-end'}`}
                >
                  <div className={`flex items-start ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-[95%] p-4 rounded-2xl ${
                        msg.isBot
                          ? 'bg-white dark:bg-[#2f2f2f] text-gray-800 dark:text-gray-100 rounded-tl-none shadow-sm'
                          : 'bg-white dark:bg-[#2f2f2f] text-gray-800 dark:text-gray-100 rounded-tr-none shadow-sm'
                      } ${msg.isError ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : ''}`}
                    >
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{mainText}</p>
                    </div>
                  </div>

                  {/* Follow-up Chips */}
                  {msg.isBot && followUps && followUps.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2 w-full">
                      {followUps.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(q)}
                          className="text-left px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-[#2f2f2f] border border-black/5 dark:border-white/5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#3f3f3f] transition-colors flex items-center gap-2 w-fit max-w-full"
                        >
                          <Sparkles className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{q}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm ml-12"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input Area (Fixed at bottom) */}
      <div className="p-4 md:p-6 bg-gray-200/90 dark:bg-[#212121]/80 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
            <form onSubmit={handleSubmit} className="relative flex-1 flex items-center">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={hasStarted ? "Ask a follow-up question..." : `Ask anything about ${isPortfolio ? "Keshav" : "this resume"}...`}
                className="w-full p-4 pr-14 rounded-2xl bg-white dark:bg-[#2f2f2f] border-transparent focus:bg-white dark:focus:bg-[#2f2f2f] border border-black/5 dark:border-white/5 focus:border-gray-300 dark:focus:border-gray-600 focus:ring-0 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
                <Send className="w-5 h-5" />
            </button>
            </form>
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
            AI can make mistakes. Please verify important information from the resume.
        </p>
      </div>
    </div>
  );
}
