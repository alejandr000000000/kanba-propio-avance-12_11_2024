import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Calendar,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const SprintPlanning = () => {
  const { selectedProject } = useStore();
  const currentSprint = selectedProject?.sprints[0];

  if (!currentSprint) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const daysLeft = Math.ceil(
    (new Date(currentSprint.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalPoints = currentSprint.tasks.reduce((sum, task) => sum + task.storyPoints, 0);
  const completedPoints = currentSprint.tasks
    .filter(task => task.status === 'done')
    .reduce((sum, task) => sum + task.storyPoints, 0);

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Sprint Actual</h2>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Periodo</p>
            <p className="font-medium">
              {formatDate(currentSprint.startDate)} - {formatDate(currentSprint.endDate)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Tiempo Restante</p>
            <p className="font-medium">{daysLeft} días</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Progreso</p>
            <p className="font-medium">{Math.round((completedPoints / totalPoints) * 100)}% completado</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${(completedPoints / totalPoints) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {completedPoints} de {totalPoints} puntos completados
        </div>
      </div>
    </div>
  );
};