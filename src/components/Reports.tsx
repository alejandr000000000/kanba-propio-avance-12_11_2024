import React from 'react';
import { useStore } from '../store/useStore';
import { SprintSelector } from './SprintSelector';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export const Reports = () => {
  const { selectedProject, selectedSprint } = useStore();

  if (!selectedProject || !selectedSprint) return null;

  // Calculate sprint statistics
  const totalTasks = selectedSprint.tasks.length;
  const completedTasks = selectedSprint.tasks.filter(task => task.status === 'done').length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Task Distribution Chart Data
  const taskDistributionData = {
    labels: ['Completadas', 'En Progreso', 'Pendientes'],
    datasets: [
      {
        data: [
          selectedSprint.tasks.filter(task => task.status === 'done').length,
          selectedSprint.tasks.filter(task => task.status === 'in_progress').length,
          selectedSprint.tasks.filter(task => ['todo', 'backlog'].includes(task.status)).length,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(234, 179, 8, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(234, 179, 8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Story Points Progress Chart Data
  const storyPointsData = {
    labels: ['Completados', 'Restantes'],
    datasets: [
      {
        data: [
          selectedSprint.tasks
            .filter(task => task.status === 'done')
            .reduce((acc, task) => acc + task.storyPoints, 0),
          selectedSprint.tasks
            .filter(task => task.status !== 'done')
            .reduce((acc, task) => acc + task.storyPoints, 0),
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(234, 179, 8, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Priority Distribution Chart Data
  const priorityData = {
    labels: ['Alta', 'Media', 'Baja'],
    datasets: [
      {
        data: [
          selectedSprint.tasks.filter(task => task.priority === 'high').length,
          selectedSprint.tasks.filter(task => task.priority === 'medium').length,
          selectedSprint.tasks.filter(task => task.priority === 'low').length,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(234, 179, 8)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <SprintSelector />

      <header className="bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Reportes y Métricas</h1>
        <p className="text-gray-600 mt-2">
          Visualización del progreso y métricas del sprint actual
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Distribution Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover-card">
          <h2 className="text-lg font-semibold mb-4">Distribución de Tareas</h2>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut
              data={taskDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Story Points Progress Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover-card">
          <h2 className="text-lg font-semibold mb-4">Puntos de Historia</h2>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut
              data={storyPointsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Priority Distribution Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover-card lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Distribución por Prioridad</h2>
          <div className="h-[300px]">
            <Bar
              data={priorityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Sprint Details Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Detalles del Sprint</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Métrica
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Progreso General
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {Math.round(progress)}%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Tareas Completadas
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {completedTasks} de {totalTasks}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Puntos de Historia Totales
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {selectedSprint.tasks.reduce((acc, task) => acc + task.storyPoints, 0)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Puntos de Historia Completados
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {selectedSprint.tasks
                    .filter(task => task.status === 'done')
                    .reduce((acc, task) => acc + task.storyPoints, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};