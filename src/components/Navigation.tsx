import React from 'react';
import { useStore } from '../store/useStore';
import {
  LayoutDashboard,
  Users,
  Timer,
  Settings,
  Calendar,
  PieChart,
  Briefcase,
  ChevronDown,
  LogOut
} from 'lucide-react';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Navigation = ({ activeView, onViewChange }: NavigationProps) => {
  const { currentUser, setCurrentUser } = useStore();

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin', 'scrum_master', 'developer', 'client']
    },
    {
      id: 'projects',
      label: 'Proyectos',
      icon: <Briefcase className="w-5 h-5" />,
      roles: ['admin', 'scrum_master', 'developer']
    },
    {
      id: 'sprints',
      label: 'Sprints',
      icon: <Timer className="w-5 h-5" />,
      roles: ['admin', 'scrum_master', 'developer']
    },
    {
      id: 'team',
      label: 'Equipo',
      icon: <Users className="w-5 h-5" />,
      roles: ['admin', 'scrum_master']
    },
    {
      id: 'calendar',
      label: 'Calendario',
      icon: <Calendar className="w-5 h-5" />,
      roles: ['admin', 'scrum_master', 'developer', 'client']
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: <PieChart className="w-5 h-5" />,
      roles: ['admin', 'scrum_master']
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: <Settings className="w-5 h-5" />,
      roles: ['admin']
    }
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Agile PM</span>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems
              .filter(item => item.roles.includes(currentUser?.role || ''))
              .map(item => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeView === item.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
              <span>Menu</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name}`}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser?.role?.replace('_', ' ')}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};