import { create } from 'zustand';
import { User, Project, Task, Sprint } from '../types';

interface Store {
  currentUser: User | null;
  projects: Project[];
  selectedProject: Project | null;
  selectedSprint: Sprint | null;
  notifications: Notification[];

  setCurrentUser: (user: User | null) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  setSelectedProject: (project: Project | null) => void;
  setSelectedSprint: (sprint: Sprint | null) => void;
  updateTask: (projectId: string, sprintId: string, task: Task) => void;
  addNotification: (notification: Notification) => void;
}

const sampleProject: Project = {
  id: '1',
  name: 'Proyecto Demo',
  description: 'Un proyecto de demostración para Agile PM',
  status: 'active',
  team: [],
  sprints: [
    {
      id: '1',
      name: 'Sprint 1',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-15'),
      status: 'active',
      tasks: [
        {
          id: '1',
          title: 'Implementar autenticación',
          description: 'Agregar login y registro de usuarios',
          status: 'in_progress',
          storyPoints: 5,
          priority: 'high',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Diseñar dashboard',
          description: 'Crear diseño responsive del dashboard',
          status: 'todo',
          storyPoints: 3,
          priority: 'medium',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    },
    {
      id: '2',
      name: 'Sprint 2',
      startDate: new Date('2024-03-16'),
      endDate: new Date('2024-03-30'),
      status: 'planning',
      tasks: [
        {
          id: '3',
          title: 'API REST',
          description: 'Desarrollar endpoints de la API',
          status: 'backlog',
          storyPoints: 8,
          priority: 'high',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

export const useStore = create<Store>((set) => ({
  currentUser: null,
  projects: [sampleProject],
  selectedProject: sampleProject,
  selectedSprint: sampleProject.sprints[0],
  notifications: [],

  setCurrentUser: (user) => set({ currentUser: user }),
  
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  
  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === project.id ? project : p
      ),
      selectedProject: state.selectedProject?.id === project.id ? project : state.selectedProject,
    })),
  
  deleteProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
      selectedProject: state.selectedProject?.id === projectId ? null : state.selectedProject,
    })),
  
  setSelectedProject: (project) => set({ 
    selectedProject: project,
    selectedSprint: project?.sprints[0] || null
  }),

  setSelectedSprint: (sprint) => set({ selectedSprint: sprint }),
  
  updateTask: (projectId, sprintId, task) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              sprints: project.sprints.map((sprint) =>
                sprint.id === sprintId
                  ? {
                      ...sprint,
                      tasks: sprint.tasks.map((t) =>
                        t.id === task.id ? task : t
                      ),
                    }
                  : sprint
              ),
            }
          : project
      ),
      selectedProject: state.selectedProject?.id === projectId
        ? {
            ...state.selectedProject,
            sprints: state.selectedProject.sprints.map((sprint) =>
              sprint.id === sprintId
                ? {
                    ...sprint,
                    tasks: sprint.tasks.map((t) =>
                      t.id === task.id ? task : t
                    ),
                  }
                : sprint
            ),
          }
        : state.selectedProject,
    })),
  
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
}));