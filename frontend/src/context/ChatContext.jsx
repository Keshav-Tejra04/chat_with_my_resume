import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendChatMessage, uploadResume } from '../api';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_messages');
    return saved ? JSON.parse(saved) : [{ text: "Hello! I'm ready to answer questions about the resume.", isBot: true }];
  });
  
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('chat_session_id') || null;
  });

  const [resumeName, setResumeName] = useState(() => {
    return localStorage.getItem('chat_resume_name') || "Keshav Tejra";
  });

  const [fileUri, setFileUri] = useState(() => {
    return localStorage.getItem('chat_file_uri') || null;
  });

  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('chat_session_id', sessionId);
    } else {
      localStorage.removeItem('chat_session_id');
    }
  }, [sessionId]);

  useEffect(() => {
    localStorage.setItem('chat_resume_name', resumeName);
  }, [resumeName]);

  useEffect(() => {
    if (fileUri) {
      localStorage.setItem('chat_file_uri', fileUri);
    } else {
      localStorage.removeItem('chat_file_uri');
    }
  }, [fileUri]);


  const handleUpload = async (file) => {
    setIsUploading(true);
    try {
      const data = await uploadResume(file);
      setSessionId(data.session_id);
      setFileUri(data.file_uri);
      setResumeName(file.name); // Update resume name for dynamic UI
      
      // Reset chat with new context
      const newMessages = [{ text: `I've analyzed ${file.name}. Ask me anything about it!`, isBot: true }];
      setMessages(newMessages);
      
      return data;
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMsg = { text: "Failed to upload resume. Please try again.", isBot: true, isError: true };
      setMessages(prev => [...prev, errorMsg]);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Optimistically add user message
    const userMessage = { text, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const data = await sendChatMessage(text, sessionId, fileUri);
      
      // If backend created a new session (e.g. default one), update our state
      if (data.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
      }

      const botMessage = { text: data.response, isBot: true };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat failed:", error);
      const errorMsg = { text: "Sorry, I encountered an error. Please try again.", isBot: true, isError: true };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = () => {
      setMessages([{ text: "Hello! I'm ready to answer questions about the resume.", isBot: true }]);
      setSessionId(null);
      // We DO NOT clear resumeName or fileUri here to preserve context
  };

  const resetToDefault = () => {
      setMessages([{ text: "Hello! I'm ready to answer questions about the resume.", isBot: true }]);
      setSessionId(null);
      setFileUri(null);
      setResumeName("Keshav Tejra");
      localStorage.removeItem('chat_messages');
      localStorage.removeItem('chat_session_id');
      localStorage.removeItem('chat_file_uri');
      localStorage.setItem('chat_resume_name', "Keshav Tejra");
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      sendMessage, 
      isTyping, 
      handleUpload, 
      isUploading,
      resumeName,
      resetChat,
      resetToDefault
    }}>
      {children}
    </ChatContext.Provider>
  );
};
