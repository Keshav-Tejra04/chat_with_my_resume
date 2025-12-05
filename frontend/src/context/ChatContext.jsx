import React, { createContext, useContext, useState } from 'react';
import { uploadResume, sendChatMessage } from '../api';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm ready to answer questions about the resume.", isBot: true }
  ]);
  const [sessionId, setSessionId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleUpload = async (file) => {
    setIsUploading(true);
    try {
      const data = await uploadResume(file);
      setSessionId(data.session_id);
      setMessages([{ text: "Resume uploaded successfully! Ask me anything.", isBot: true }]);
    } catch (error) {
      console.error("Upload failed", error);
      setMessages(prev => [...prev, { text: "Failed to upload resume.", isBot: true, isError: true }]);
    } finally {
      setIsUploading(false);
    }
  };

  const sendMessage = async (text) => {
    setMessages(prev => [...prev, { text, isBot: false }]);
    setIsTyping(true);
    try {
      const data = await sendChatMessage(text, sessionId);
      if (data.session_id && !sessionId) {
          setSessionId(data.session_id);
      }
      setMessages(prev => [...prev, { text: data.response, isBot: true }]);
    } catch (error) {
      console.error("Chat failed", error);
      setMessages(prev => [...prev, { text: "Sorry, I encountered an error.", isBot: true, isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      sendMessage, 
      handleUpload, 
      isUploading, 
      isTyping 
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
