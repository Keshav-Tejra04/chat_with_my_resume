import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const checkBackendHealth = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/health`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendChatMessage = async (message, sessionId = null) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat`, {
            message,
            session_id: sessionId
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};