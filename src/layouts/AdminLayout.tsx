import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FiHome,
  FiMenu,
  FiFileText,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiGrid,
} from "react-icons/fi";

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      to: "/admin",
      icon: FiHome,
      label: "Dashboard",
      end: true,
    },
    {
      to: "/admin/menu",
      icon: FiMenu,
      label: "Gestionar Menú",
    },
    {
      to: "/admin/pages",
      icon: FiGrid,
      label: "Páginas",
    },
    {
      to: "/admin/blog",
      icon: FiFileText,
      label: "Blog",
    },
    {
      to: "/admin/users",
      icon: FiUsers,
      label: "Usuarios",
    },
    {
      to: "/admin/settings",
      icon: FiSettings,
      label: "Configuración",
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-white-100">
      <div className="flex flex-col w-64 bg-white shadow-md">
        <div className="flex items-center justify-center h-16 bg-bg-400">
          <img src="/AST-Logo-white.png" alt="AST" className="h-8" />
          <span className="ml-2 text-white font-semibold">AST Technology.</span>
        </div>
        <div className="px-4 py-3 bg-bg-400 flex  gap-5 items-center justify-center border-t border-t-bg-100">
          <div>
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-white/50">{user?.email}</p>
          </div>
          <span className="inline-block px-5 py-1 text-xs font-medium text-white-100 border border-bg-300 rounded-full">
            {user?.role}
          </span>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 bg-bg-400">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors text-white ${
                  isActive
                    ? "bg-primary-100 text-white"
                    : " hover:bg-primary-100/50 hover:text-white"
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 " aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t bg-bg-100">
          <button
            onClick={handleLogout}
            className="group flex items-center w-full px-2 py-2 text-sm font-medium text-white-100 rounded-md hover:bg-bg-200 hover:text-white"
          >
            <FiLogOut
              className="mr-3 h-5 w-5 text-white-100 group-hover:text-primary-100 transition-colors duration-300"
              aria-hidden="true"
            />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-bg-400 shadow-sm ">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-white-100">
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
