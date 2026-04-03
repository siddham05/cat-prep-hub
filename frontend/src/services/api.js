import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 35000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  r => r.data,
  err => {
    const msg = err.response?.data?.error || err.message || 'Something went wrong';
    return Promise.reject(new Error(msg));
  }
);

export const healthCheck = () => api.get('/health');

export const generateRoadmap = (data) => api.post('/roadmap', data);

export const generateTasks = (data) => api.post('/tasks', data);

export const getMotivation = (data) => api.post('/motivation', data);

export const getPIPrep = (data) => api.post('/pi-prep', data);

export const solveDoubt = (data) => api.post('/doubt', data);

export const getResources = (weakArea) => api.get(`/resources/${weakArea}`);

export const saveProgress = (data) => api.post('/progress', data);

export const getProgress = (userId = 'default') => api.get(`/progress/${userId}`);
