import axios from 'axios';

export const API_BASE_URL = 'https://resume-chat-backend-8ccp.onrender.com/api';

export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/pdf',
    });

    try {
        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendChatMessage = async (message, sessionId = null, fileUri = null) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat`, {
            message,
            session_id: sessionId,
            file_uri: fileUri
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};