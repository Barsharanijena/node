import axios, { AxiosResponse } from 'axios';
import { LoginData, RegisterData, ProjectFormData, TaskFormData } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  // For development, always use mock token if no real token exists
  const token = localStorage.getItem('token') || 'mock-jwt-token';
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log('🔑 Using token:', token);
  return config;
});

// Add response interceptor to log errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data: LoginData): Promise<any> =>
    api.post('/auth/login', data).then((res: AxiosResponse<any>) => {
      // Store the token when login is successful
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        console.log('🔑 Token stored:', res.data.token);
      }
      return res.data;
    }),
    
  register: (data: RegisterData): Promise<any> =>
    api.post('/auth/register', data).then((res: AxiosResponse<any>) => {
      // Store the token when registration is successful
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        console.log('🔑 Token stored:', res.data.token);
      }
      return res.data;
    }),
};

// Project APIs
// Project APIs
export const projectAPI = {
  getProjects: (): Promise<any> =>
    api.get('/projects').then((res) => {
      console.log('🔥 RAW API RESPONSE:', res);
      console.log('🔥 API RESPONSE DATA:', res.data);
      
      // Your controller now returns projects array directly
      if (Array.isArray(res.data)) {
        console.log('🔥 DIRECT ARRAY RESPONSE:', res.data);
        return res.data;
      } else {
        console.log('🔥 UNEXPECTED RESPONSE FORMAT:', res.data);
        return [];
      }
    }),

  getProject: (id: string): Promise<any> =>
    api.get(`/projects/${id}`).then((res: AxiosResponse<any>) => {
      console.log('🔥 GET PROJECT RESPONSE:', res.data);
      return res.data; // Controller returns project directly
    }),

  createProject: (data: ProjectFormData): Promise<any> =>
    api.post('/projects', data).then((res: AxiosResponse<any>) => {
      console.log('🔥 CREATE PROJECT RESPONSE:', res.data);
      return res.data; // Controller returns project directly
    }),

  updateProject: (id: string, data: ProjectFormData): Promise<any> =>
    api.put(`/projects/${id}`, data).then((res: AxiosResponse<any>) => {
      console.log('🔥 UPDATE PROJECT RESPONSE:', res.data);
      return res.data; // Controller returns project directly
    }),

  deleteProject: (id: string): Promise<void> =>
    api.delete(`/projects/${id}`).then((res: AxiosResponse<void>) => res.data),
};
// Task APIs
export const taskAPI = {
  getTasks: (projectId: string, status?: string): Promise<any> =>
    api.get(`/tasks/project/${projectId}${status ? `?status=${status}` : ''}`).then((res: AxiosResponse<any>) => {
      console.log('🔥 GET TASKS RESPONSE:', res.data);
      if (res.data && res.data.tasks) {
        return res.data.tasks;
      } else if (Array.isArray(res.data)) {
        return res.data;
      } else {
        return [];
      }
    }),

  createTask: (projectId: string, data: TaskFormData): Promise<any> =>
    api.post(`/tasks/project/${projectId}`, data).then((res: AxiosResponse<any>) => {
      console.log('🔥 CREATE TASK RESPONSE:', res.data);
      return res.data.task || res.data;
    }),

  updateTask: (taskId: string, data: TaskFormData): Promise<any> =>
    api.put(`/tasks/${taskId}`, data).then((res: AxiosResponse<any>) => {
      console.log('🔥 UPDATE TASK RESPONSE:', res.data);
      return res.data.task || res.data;
    }),

  deleteTask: (taskId: string): Promise<void> =>
    api.delete(`/tasks/${taskId}`).then((res: AxiosResponse<void>) => res.data),
};