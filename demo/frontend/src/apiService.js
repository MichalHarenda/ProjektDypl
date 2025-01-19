import axios from 'axios';

const API_URL = 'http://ec2-16-171-161-151.eu-north-1.compute.amazonaws.com:8080/api';

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/authenticate`, credentials);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const makeRequest = async (url, method = 'GET', data = null, token = null) => {
    try {
        const response = await axios({
            method,
            url,
            data,
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};
