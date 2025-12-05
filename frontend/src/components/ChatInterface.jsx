import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatInterface() {
  const { messages, sendMessage, isTyping } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-start gap-3 ${msg.isBot ? 'justify-start' : 'justify-end'}`}
            >
              {msg.isBot && (
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.isBot
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                    : 'bg-blue-600 text-white rounded-tr-none'
                } ${msg.isError ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : ''}`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
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

      {/* Input Area */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the resume..."
            className="flex-1 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
