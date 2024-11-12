import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Layout, 
  Users, 
  Timer,
  GitPullRequest,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Zap,
  Calendar
} from 'lucide-react';

interface HomePageProps {
  setActiveView: (view: string) => void;
}

/**
 * HomePage Component
 * Displays the main dashboard with project statistics and quick actions
 */
export const HomePage = ({ setActiveView }: HomePageProps) => {
  const { selectedProject } = useStore();
  const currentSprint = selectedProject?.sprints[0];

  // Calculate project statistics
  const stats = [
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      label: "Miembros del Equipo",
      value: selectedProject?.team.length || 0,
      bgColor: 'bg-blue-50'
    },
    {
      icon: <Timer className="w-6 h-6 text-emerald-600" />,
      label: "Sprints Totales",
      value: selectedProject?.sprints.length || 0,
      bgColor: 'bg-emerald-50'
    },
    {
      icon: <GitPullRequest className="w-6 h-6 text-purple-600" />,
      label: "Tareas Activas",
      value: currentSprint?.tasks.filter(t => t.status !== 'done').length || 0,
      bgColor: 'bg-purple-50'
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-rose-600" />,
      label: "Tareas Completadas",
      value: currentSprint?.tasks.filter(t => t.status === 'done').length || 0,
      bgColor: 'bg-rose-50'
    }
  ];

  // Quick action buttons configuration
  const quickActions = [
    {
      icon: <GitPullRequest className="w-5 h-5" />,
      label: "Ver Tablero Kanban",
      description: "Gestiona las tareas del sprint actual",
      link: "projects",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Timer className="w-5 h-5" />,
      label: "Planificar Sprint",
      description: "Crea o edita sprints del proyecto",
      link: "sprints",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Calendario",
      description: "Ver y gestionar eventos",
      link: "calendar",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Gestionar Equipo",
      description: "Administra los miembros del proyecto",
      link: "team",
      color: "from-rose-500 to-rose-600"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">¡Bienvenido al Dashboard!</h1>
            <p className="text-primary-100 mt-1">Gestiona tus proyectos ágiles de forma eficiente</p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="glass-effect rounded-xl p-4 hover-card"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  {stat.icon}
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-primary-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => setActiveView(action.link)}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all group hover-card"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`bg-gradient-to-br ${action.color} p-3 rounded-lg text-white`}>
                {action.icon}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">{action.label}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary-600 text-sm font-medium">
              <span>Acceder</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Current Sprint Overview */}
      {currentSprint && (
        <div className="bg-white rounded-xl shadow-lg p-6 hover-card">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            Sprint Actual: {currentSprint.name}
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between text-gray-600">
              <span>Periodo</span>
              <span className="font-medium text-gray-900">
                {new Date(currentSprint.startDate).toLocaleDateString()} - {new Date(currentSprint.endDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progreso del Sprint</span>
                <span className="font-medium text-primary-600">
                  {Math.round((currentSprint.tasks.filter(t => t.status === 'done').length / currentSprint.tasks.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${(currentSprint.tasks.filter(t => t.status === 'done').length / currentSprint.tasks.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};