import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Auth
export const login = async (username, password) => {
    const response = await api.post('/login', { username, password });
    return response.data;
};

// Cliente
export const createRequest = async (request) => {
    const response = await api.post('/requests', request);
    return response.data;
};

export const getCustomerRequests = async (clientId) => {
    try {
        if (!clientId) throw new Error('Client ID is required');
        const response = await api.get(`/requests/customer/${clientId}`);
        console.log('Service response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Service error:', error.response?.data || error.message);
        throw error;
    }
};

// Soporte
export const getSupportRequests = async (supportId) => {
    const response = await api.get(`/requests/support/${supportId}`);
    return response.data;
};

export const updateRequest = async (id, data) => {
    console.log('Service updateRequest called with id:', id, 'and data:', data);
    const response = await api.put(`/requests/${id}`, data);
    return response.data;
};

// Admin
export const getAllRequests = async (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();
    const response = await api.get(`/requests?${params}`);
    console.log('Service getAllRequests response:', response.data);
    return response.data;
};

export const getStatistics = async () => {
    const response = await api.get('/statistics');
    return response.data;
};

export const getCustomers = async () => {
    const response = await api.get('/customers');
    return response.data;
};
