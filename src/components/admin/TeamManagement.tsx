import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Plus,
  Edit2,
  Trash2,
  Shield,
  Mail,
  User
} from 'lucide-react';
import { User as UserType } from '../../types';

export const TeamManagement = () => {
  const { selectedProject, updateProject } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  if (!selectedProject) return null;

  const handleAddUser = (user: UserType) => {
    updateProject({
      ...selectedProject,
      team: [...selectedProject.team, user]
    });
    setIsCreating(false);
  };

  const handleUpdateUser = (updatedUser: UserType) => {
    updateProject({
      ...selectedProject,
      team: selectedProject.team.map(user =>
        user.id === updatedUser.id ? updatedUser : user
      )
    });
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    updateProject({
      ...selectedProject,
      team: selectedProject.team.filter(user => user.id !== userId)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión del Equipo</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Añadir Miembro
        </button>
      </div>

      <div className="grid gap-4">
        {selectedProject.team.map(user => (
          <div
            key={user.id}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm capitalize">{user.role.replace('_', ' ')}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(isCreating || editingUser) && (
        <UserForm
          user={editingUser}
          onSubmit={(user) => {
            if (editingUser) {
              handleUpdateUser(user);
            } else {
              handleAddUser(user);
            }
          }}
          onCancel={() => {
            setIsCreating(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

const UserForm = ({
  user,
  onSubmit,
  onCancel
}: {
  user?: UserType | null;
  onSubmit: (user: UserType) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState<UserType['role']>(user?.role || 'developer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: user?.id || crypto.randomUUID(),
      name,
      email,
      role,
      avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">
          {user ? 'Editar Miembro' : 'Añadir Miembro'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserType['role'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="admin">Administrador</option>
              <option value="scrum_master">Scrum Master</option>
              <option value="developer">Desarrollador</option>
              <option value="client">Cliente</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-6">
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
              {user ? 'Actualizar' : 'Añadir'} Miembro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};