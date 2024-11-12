import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Sprint } from '../types';

export const SprintList = () => {
  const { selectedProject, updateProject } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);

  if (!selectedProject) return null;

  const handleCreateSprint = (sprint: Sprint) => {
    updateProject({
      ...selectedProject,
      sprints: [...selectedProject.sprints, sprint]
    });
    setIsCreating(false);
  };

  const handleUpdateSprint = (updatedSprint: Sprint) => {
    updateProject({
      ...selectedProject,
      sprints: selectedProject.sprints.map(sprint => 
        sprint.id === updatedSprint.id ? updatedSprint : sprint
      )
    });
    setEditingSprint(null);
  };

  const handleDeleteSprint = (sprintId: string) => {
    updateProject({
      ...selectedProject,
      sprints: selectedProject.sprints.filter(sprint => sprint.id !== sprintId)
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Sprints</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Sprint
        </button>
      </div>

      {isCreating && (
        <SprintForm
          onSubmit={handleCreateSprint}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <div className="grid gap-4">
        {selectedProject.sprints.map(sprint => (
          <div
            key={sprint.id}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          >
            {editingSprint?.id === sprint.id ? (
              <SprintForm
                sprint={sprint}
                onSubmit={handleUpdateSprint}
                onCancel={() => setEditingSprint(null)}
              />
            ) : (
              <SprintCard
                sprint={sprint}
                onEdit={() => setEditingSprint(sprint)}
                onDelete={() => handleDeleteSprint(sprint.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SprintCard = ({
  sprint,
  onEdit,
  onDelete
}: {
  sprint: Sprint;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const totalTasks = sprint.tasks.length;
  const completedTasks = sprint.tasks.filter(task => task.status === 'done').length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{sprint.name}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{sprint.status}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="text-gray-600">Progreso</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>{completedTasks} completadas</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-600">
          <AlertCircle className="w-4 h-4" />
          <span>{totalTasks - completedTasks} pendientes</span>
        </div>
      </div>
    </div>
  );
};

const SprintForm = ({
  sprint,
  onSubmit,
  onCancel
}: {
  sprint?: Sprint;
  onSubmit: (sprint: Sprint) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(sprint?.name || '');
  const [startDate, setStartDate] = useState(sprint?.startDate.toString().split('T')[0] || '');
  const [endDate, setEndDate] = useState(sprint?.endDate.toString().split('T')[0] || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: sprint?.id || crypto.randomUUID(),
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: sprint?.status || 'planning',
      tasks: sprint?.tasks || []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Sprint
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de inicio
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de fin
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {sprint ? 'Actualizar' : 'Crear'} Sprint
        </button>
      </div>
    </form>
  );
};