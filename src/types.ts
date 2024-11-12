export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'scrum_master' | 'developer' | 'client';
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'done';
  storyPoints: number;
  priority: 'low' | 'medium' | 'high';
  assignee?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'active' | 'completed';
  tasks: Task[];
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

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  read: boolean;
  createdAt: Date;
}