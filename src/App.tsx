import React from 'react';
import { Navigation } from './components/Navigation';
import { KanbanBoard } from './components/KanbanBoard';
import { SprintPlanning } from './components/SprintPlanning';
import { SprintList } from './components/SprintList';
import { Login } from './components/Login';
import { HomePage } from './components/HomePage';
import { Reports } from './components/Reports';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeamManagement } from './components/admin/TeamManagement';
import { Calendar } from './components/Calendar';
import { useStore } from './store/useStore';

/**
 * Main Application Component
 * Handles routing and view management based on user authentication and role
 */
function App() {
  const { currentUser } = useStore();
  const [activeView, setActiveView] = React.useState('dashboard');

  // Redirect to login if user is not authenticated
  if (!currentUser) {
    return <Login />;
  }

  /**
   * Renders the appropriate content based on the active view
   * and user role permissions
   */
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <HomePage setActiveView={setActiveView} />;
      case 'projects':
        return (
          <div className="space-y-8">
            <KanbanBoard />
            {currentUser.role === 'scrum_master' && <SprintPlanning />}
          </div>
        );
      case 'sprints':
        return <SprintList />;
      case 'team':
        return <TeamManagement />;
      case 'calendar':
        return <Calendar />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return currentUser.role === 'admin' ? <AdminDashboard /> : null;
      default:
        return <HomePage setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fadeIn">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;