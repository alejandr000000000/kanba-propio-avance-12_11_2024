import React from 'react';
import { useStore } from '../store/useStore';
import { Calendar } from 'lucide-react';

export const SprintSelector = () => {
  const { selectedProject, selectedSprint, setSelectedSprint } = useStore();

  if (!selectedProject) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary-100 p-2 rounded-lg">
          <Calendar className="w-5 h-5 text-primary-600" />
        </div>
        <select
          value={selectedSprint?.id}
          onChange={(e) => {
            const sprint = selectedProject.sprints.find(s => s.id === e.target.value);
            setSelectedSprint(sprint || null);
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {selectedProject.sprints.map((sprint) => (
            <option key={sprint.id} value={sprint.id}>
              {sprint.name} ({new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};