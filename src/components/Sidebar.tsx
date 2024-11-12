import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Layout, 
  Users, 
  Timer,
  Settings,
  LogOut,
  Home
} from 'lucide-react';

export const Sidebar = () => {
  const { currentUser, setCurrentUser } = useStore();
  const [activeView, setActiveView] = useState<'home' | 'projects' | 'sprints'>('home');

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-500 p-2 rounded-lg">
          <Layout className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold">Agile PM</h1>
      </div>

      <nav className="space-y-2 flex-1">
        <NavItem 
          icon={<Home className="w-5 h-5" />} 
          label="Inicio" 
          active={activeView === 'home'}
          onClick={() => setActiveView('home')}
        />
        <NavItem 
          icon={<Users className="w-5 h-5" />} 
          label="Proyectos" 
          active={activeView === 'projects'}
          onClick={() => setActiveView('projects')}
        />
        <NavItem 
          icon={<Timer className="w-5 h-5" />} 
          label="Sprints" 
          active={activeView === 'sprints'}
          onClick={() => setActiveView('sprints')}
        />
        {currentUser?.role === 'admin' && (
          <NavItem icon={<Settings className="w-5 h-5" />} label="Configuración" />
        )}
      </nav>

      <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-800">
          <img
            src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=User'}
            alt="User avatar"
            className="w-10 h-10 rounded-full border-2 border-gray-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{currentUser?.role.replace('_', ' ')}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ 
  icon, 
  label, 
  active = false,
  onClick
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${
      active 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-300 hover:bg-gray-800'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);