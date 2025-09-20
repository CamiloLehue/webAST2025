import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  FiHome, 
  FiMenu, 
  FiFileText, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiGrid
} from 'react-icons/fi';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      to: '/admin',
      icon: FiHome,
      label: 'Dashboard',
      end: true
    },
    {
      to: '/admin/menu',
      icon: FiMenu,
      label: 'Gestionar Menú'
    },
    {
      to: '/admin/pages',
      icon: FiGrid,
      label: 'Páginas'
    },
    {
      to: '/admin/blog',
      icon: FiFileText,
      label: 'Blog'
    },
    {
      to: '/admin/users',
      icon: FiUsers,
      label: 'Usuarios'
    },
    {
      to: '/admin/settings',
      icon: FiSettings,
      label: 'Configuración'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-white shadow-md">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-indigo-600">
          <img src="/AST-Logo-white.png" alt="AST" className="h-8" />
          <span className="ml-2 text-white font-semibold">Admin Panel</span>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <span className="inline-block px-2 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full mt-1">
            {user?.role}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t">
          <button
            onClick={handleLogout}
            className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <FiLogOut
              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Panel de Administración
            </h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;