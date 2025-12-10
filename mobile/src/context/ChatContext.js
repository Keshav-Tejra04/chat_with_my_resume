import React, { createContext, useContext, useState } from 'react';
import { sendChatMessage, uploadResume } from '../api';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([{ text: "Hello! I'm ready to answer questions.", isBot: true }]);
    const [sessionId, setSessionId] = useState(null);
    const [fileUri, setFileUri] = useState(null); // Backend file reference
    const [resumeName, setResumeName] = useState("Keshav Tejra");
    const [isTyping, setIsTyping] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (file) => {
        setIsUploading(true);
        try {
            const data = await uploadResume(file);
            setSessionId(data.session_id);
            setFileUri(data.file_uri);
            setResumeName(file.name);

            setMessages([{ text: `I've analyzed ${file.name}. Ask me anything!`, isBot: true }]);
            return data;
        } catch (error) {
            console.error("Upload failed:", error);
            setMessages(prev => [...prev, { text: "Failed to upload resume.", isBot: true, isError: true }]);
        } finally {
            setIsUploading(false);
        }
    };

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        setMessages(prev => [...prev, { text, isBot: false }]);
        setIsTyping(true);

        try {
            const data = await sendChatMessage(text, sessionId, fileUri);
            if (data.session_id && data.session_id !== sessionId) {
                setSessionId(data.session_id);
            }
            setMessages(prev => [...prev, { text: data.response, isBot: true }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Error connecting to server.", isBot: true, isError: true }]);
        } finally {
            setIsTyping(false);
        }
    };

    const resetChat = () => {
        setMessages([{ text: "Hello! I'm ready to answer questions.", isBot: true }]);
        setSessionId(null);
    };

    return (
        <ChatContext.Provider value={{ messages, sendMessage, isTyping, handleUpload, isUploading, resumeName, resetChat }}>
            {children}
        </ChatContext.Provider>
    );
};