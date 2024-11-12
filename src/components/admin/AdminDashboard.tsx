import React from 'react';
import { ProjectManagement } from './ProjectManagement';
import { TeamManagement } from './TeamManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { 
  LayoutGrid, 
  Users, 
  Settings,
  Briefcase,
  Timer
} from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600 mt-2">
          Gestiona proyectos, equipos y configuraciones del sistema
        </p>
      </header>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-lg shadow-sm">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Proyectos
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Equipo
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ProjectManagement />
        </TabsContent>
        
        <TabsContent value="team">
          <TeamManagement />
        </TabsContent>

        <TabsContent value="settings">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Configuración del Sistema</h2>
            {/* Add system settings here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};