import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { SprintSelector } from './SprintSelector';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar as CalendarIcon,
  Plus,
  X
} from 'lucide-react';

interface DaySchedule {
  id: string;
  title: string;
  time: string;
  description: string;
}

interface SchedulesByDate {
  [key: string]: DaySchedule[];
}

export const Calendar = () => {
  const { selectedProject, selectedSprint } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [schedules, setSchedules] = useState<SchedulesByDate>({});
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  if (!selectedProject || !selectedSprint) return null;

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getTasksForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return selectedSprint.tasks.filter(task => {
      const taskDate = new Date(task.updatedAt);
      return taskDate.getDate() === day &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'todo':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + (direction === 'next' ? 1 : -1),
      1
    ));
  };

  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDay(selectedDate);
  };

  const handleAddSchedule = (schedule: DaySchedule) => {
    if (!selectedDay) return;
    
    const dateKey = formatDateKey(selectedDay);
    setSchedules(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), schedule]
    }));
    setShowScheduleForm(false);
  };

  const handleDeleteSchedule = (dateKey: string, scheduleId: string) => {
    setSchedules(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(schedule => schedule.id !== scheduleId)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <SprintSelector />
          
          {/* Mini Calendar */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Vista Rápida</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CalendarIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <div className="font-medium text-gray-900 mb-1">
                {selectedSprint.name}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(selectedSprint.startDate).toLocaleDateString()} - 
                  {new Date(selectedSprint.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Calendar Area */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                Hoy
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {/* Week days header */}
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                <div
                  key={day}
                  className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-600"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {Array.from({ length: 42 }, (_, i) => {
                const dayNumber = i - firstDayOfMonth + 1;
                const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
                const tasks = isCurrentMonth ? getTasksForDay(dayNumber) : [];
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
                const dateKey = formatDateKey(date);
                const daySchedules = isCurrentMonth ? schedules[dateKey] || [] : [];

                return (
                  <div
                    key={i}
                    onClick={() => isCurrentMonth && handleDayClick(dayNumber)}
                    className={`bg-white min-h-[120px] p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !isCurrentMonth ? 'text-gray-300' : ''
                    } ${isToday(dayNumber) ? 'bg-primary-50' : ''}`}
                  >
                    <div className={`font-medium mb-1 ${
                      isToday(dayNumber) ? 'text-primary-600' : ''
                    }`}>
                      {isCurrentMonth ? dayNumber : ''}
                    </div>
                    <div className="space-y-1">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 rounded ${getStatusColor(task.status)} truncate`}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                      {daySchedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="text-xs p-1 rounded bg-purple-100 text-purple-800 truncate"
                          title={schedule.title}
                        >
                          {schedule.time} - {schedule.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Day Schedule Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Agenda del {selectedDay.getDate()} de {monthNames[selectedDay.getMonth()]}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-4">
              {schedules[formatDateKey(selectedDay)]?.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{schedule.title}</div>
                    <div className="text-sm text-gray-600">{schedule.time}</div>
                    <div className="text-sm text-gray-500">{schedule.description}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteSchedule(formatDateKey(selectedDay), schedule.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {showScheduleForm ? (
              <ScheduleForm
                onSubmit={handleAddSchedule}
                onCancel={() => setShowScheduleForm(false)}
              />
            ) : (
              <button
                onClick={() => setShowScheduleForm(true)}
                className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar Evento
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ScheduleForm = ({
  onSubmit,
  onCancel
}: {
  onSubmit: (schedule: DaySchedule) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: crypto.randomUUID(),
      title,
      time,
      description
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hora
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={3}
        />
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
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};