// Define los tipos principales de la aplicación

export type Role = 'admin' | 'scrum_master' | 'developer' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  assignee?: User;
  storyPoints: number;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  tasks: Task[];
  status: 'planning' | 'active' | 'completed';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  team: User[];
  sprints: Sprint[];
  createdAt: Date;
  updatedAt: Date;
}