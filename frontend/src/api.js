import axios from 'axios';

const API_URL = 'http://localhost:8000'; // FastAPI default URL

export const checkBackendHealth = async () => {
    try {
        const response = await axios.get(`${API_URL}/`);
        return response.data;
    } catch (error) {
        console.error("Backend health check failed", error);
        throw error;
    }
};

export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_URL}/upload-resume`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Upload failed", error);
        throw error;
    }
};

export const sendChatMessage = async (message) => {
    try {
        const response = await axios.post(`${API_URL}/chat`, { message });
        return response.data;
    } catch (error) {
        console.error("Chat failed", error);
        throw error;
    }
};