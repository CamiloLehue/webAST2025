import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useUserManagement } from "../user-management/hooks/useUserManagement";
import {
  FiMenu,
  FiFileText,
  FiUsers,
  FiEye,
  FiGrid,
  FiTrendingUp,
} from "react-icons/fi";

const AdminDashboard: React.FC = () => {
  const { hasPermission } = useAuth();
  const { users, fetchUsers } = useUserManagement();
  const [userStats, setUserStats] = useState({
    total: 0,
    admins: 0,
    editors: 0,
  });

  useEffect(() => {
    if (hasPermission("canViewUsers")) {
      fetchUsers({ limit: 100 });
    }
  }, [hasPermission, fetchUsers]);

  useEffect(() => {
    if (users.length > 0) {
      const admins = users.filter((user) => user.role === "admin").length;
      const editors = users.filter((user) => user.role === "editor").length;
      setUserStats({ total: users.length, admins, editors });
    }
  }, [users]);
  const stats = [
    {
      label: "Páginas Activas",
      value: "12",
      icon: FiGrid,
      color: "bg-blue-500",
    },
    {
      label: "Posts del Blog",
      value: "8",
      icon: FiFileText,
      color: "bg-green-500",
    },
    {
      label: "Items del Menú",
      value: "6",
      icon: FiMenu,
      color: "bg-purple-500",
    },
    {
      label: "Total Usuarios",
      value: userStats.total.toString(),
      icon: FiUsers,
      color: "bg-orange-500",
    },
  ];

  const quickActions = [
    {
      title: "Gestionar Menú",
      description: "Agregar, editar o eliminar elementos del menú principal",
      icon: FiMenu,
      link: "/admin/menu",
      color: "bg-accent-100",
    },
    {
      title: "Crear Página",
      description: "Crear una nueva página personalizada",
      icon: FiGrid,
      link: "/admin/pages/new",
      color: "bg-blue-600",
    },
    {
      title: "Nuevo Post",
      description: "Escribir un nuevo artículo para el blog",
      icon: FiFileText,
      link: "/admin/blog/new",
      color: "bg-green-600",
    },
    ...(hasPermission("canViewUsers")
      ? [
          {
            title: "Gestionar Usuarios",
            description: "Administrar usuarios y roles del sistema",
            icon: FiUsers,
            link: "/admin/users",
            color: "bg-orange-600",
          },
        ]
      : []),
    {
      title: "Ver Sitio Web",
      description: "Revisar el sitio web público",
      icon: FiEye,
      link: "/",
      color: "bg-bg-200",
      external: true,
    },
  ];

  const recentActivity = [
    {
      action: 'Página "Nuevos Servicios" creada',
      time: "Hace 2 horas",
      user: "Admin",
    },
    {
      action: 'Post "Últimas novedades" publicado',
      time: "Hace 1 día",
      user: "Editor",
    },
    {
      action: "Menú actualizado",
      time: "Hace 2 días",
      user: "Admin",
    },
  ];

  return (
    <div className="space-y-4 p-5 bg-bg-200 h-full">
      <div>
        <h2 className="text-2xl font-bold text-white">
          <span className="text-primary-100">AST</span>Dashboard
        </h2>
        <p className="mt-2 text-bg-200">
          Gestiona el contenido de tu sitio web desde aquí
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  border border-bg-300/10 p-2 rounded-xl">
        {stats.map((stat, index) => (
          <div key={index} className="bg-bg-300 rounded-lg  p-2 ">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-white">
                  {stat.value}
                </p>
                <p className="text-white">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              target={action.external ? "_blank" : undefined}
              className="bg-bg-300 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div
                className={`${action.color} rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4`}
              >
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-medium text-white mb-2">
                {action.title}
              </h4>
              <p className="text-white-100 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-bg-300 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-white/20">
          <h3 className="text-lg font-medium text-white">Actividad Reciente</h3>
        </div>
        <div className="divide-y divide-white/10">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <FiTrendingUp className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-white-100">por {activity.user}</p>
                </div>
              </div>
              <span className="text-sm text-white-100">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
