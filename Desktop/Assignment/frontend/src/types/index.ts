export interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  status: 'active' | 'completed';
}

export interface TaskFormData {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

// Auth types
export interface User {
  id: string;
  email: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}