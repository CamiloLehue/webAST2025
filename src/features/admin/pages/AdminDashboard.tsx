import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useUserManagement } from "../user-management/hooks/useUserManagement";
import { useBlogManagement } from "../blog-management/hooks/useBlogManagement";
import { useMenuManagement } from "../menu-management/hooks/useMenuManagement";
import { usePageManagement } from "../page-management/hooks/usePageManagement";
import { useMultimediaManagement } from "../multimedia-management/hooks/useMultimediaManagement";
import { useActivity } from "../../../hooks/useActivity";
import {
  FiMenu,
  FiFileText,
  FiUsers,
  FiEye,
  FiGrid,
  FiTrendingUp,
  FiRefreshCw,
  FiImage,
} from "react-icons/fi";

const AdminDashboard: React.FC = () => {
  const { hasPermission, user } = useAuth();
  const { users, fetchUsers } = useUserManagement();
  const { getBlogStats, loading: blogLoading } = useBlogManagement();
  const { menuItems, loading: menuLoading } = useMenuManagement();
  const { customPages, loading: pageLoading } = usePageManagement();
  const { stats: multimediaStats, loadStats: loadMultimediaStats } = useMultimediaManagement();
  const {
    activities,
    formatTimeAgo,
    logSystemAction,
    logBlogAction,
    logPageAction,
    logMenuAction,
  } = useActivity();

  const [userStats, setUserStats] = useState({
    total: 0,
    admins: 0,
    editors: 0,
  });

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (hasPermission("canViewUsers")) {
      fetchUsers({ limit: 100 });
    }
    // Cargar estadísticas multimedia
    loadMultimediaStats();
  }, [hasPermission, fetchUsers, loadMultimediaStats]);

  useEffect(() => {
    if (users.length > 0) {
      const admins = users.filter((user) => user.role === "admin").length;
      const editors = users.filter((user) => user.role === "editor").length;
      setUserStats({ total: users.length, admins, editors });
    }
  }, [users]);

  useEffect(() => {
    if (activities.length === 0 && user) {
      logSystemAction("Dashboard cargado");
      logSystemAction("Sistema iniciado");
      logSystemAction("Configuración actualizada");
      logBlogAction("creado", "Nuevas características de la plataforma");
      logPageAction("actualizada", "Página de servicios");
      logMenuAction("reorganizado");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities.length, user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (hasPermission("canViewUsers")) {
        await fetchUsers({ limit: 100 });
      }
      await loadMultimediaStats();
      logSystemAction("Dashboard actualizado");
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const blogStats = getBlogStats();
  const publishedPagesCount = customPages.filter(
    (page) => page.isPublished
  ).length;
  const stats = [
    {
      label: "Páginas Activas",
      value: pageLoading ? "..." : publishedPagesCount.toString(),
      icon: FiGrid,
      color: "bg-blue-500",
    },
    {
      label: "Posts del Blog",
      value: blogLoading ? "..." : blogStats.publishedPosts.toString(),
      icon: FiFileText,
      color: "bg-green-500",
    },
    {
      label: "Items del Menú",
      value: menuLoading ? "..." : menuItems.length.toString(),
      icon: FiMenu,
      color: "bg-purple-500",
    },
    {
      label: "Archivos Multimedia",
      value: multimediaStats ? multimediaStats.totalFiles.toString() : "...",
      icon: FiImage,
      color: "bg-pink-500",
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
    {
      title: "Gestionar Multimedia",
      description: "Subir y administrar archivos multimedia",
      icon: FiImage,
      link: "/admin/multimedia",
      color: "bg-pink-600",
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

  return (
    <div className="space-y-1 p-5 bg-bg-200 h-full">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">
            <span className="text-primary-100">AST</span>Dashboard
          </h2>
          <p className="mt-2 text-bg-200">
            Gestiona el contenido de tu sitio web desde aquí
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-white rounded-2xl hover:bg-primary-200 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Actualizando..." : "Actualizar"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6  border border-bg-300/10  rounded-xl">
        {stats.map((stat, index) => (
          <div key={index} className="bg-bg-300 rounded-2xl  p-2 ">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-2xl p-3`}>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-300 rounded-2xl shadow p-6">
          <h3 className="text-lg font-medium text-white mb-4">
            Estadísticas del Blog
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white-100">Total de posts:</span>
              <span className="text-white font-medium">
                {blogStats.totalPosts}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white-100">Publicados:</span>
              <span className="text-green-400 font-medium">
                {blogStats.publishedPosts}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white-100">Borradores:</span>
              <span className="text-yellow-400 font-medium">
                {blogStats.draftPosts}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white-100">Categorías:</span>
              <span className="text-blue-400 font-medium">
                {blogStats.totalCategories}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-bg-300 rounded-2xl shadow p-6">
          <h3 className="text-lg font-medium text-white mb-4">Páginas</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white-100">Total de páginas:</span>
              <span className="text-white font-medium">
                {customPages.length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white-100">Publicadas:</span>
              <span className="text-green-400 font-medium">
                {publishedPagesCount}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white-100">Borrador:</span>
              <span className="text-yellow-400 font-medium">
                {customPages.length - publishedPagesCount}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-bg-300 rounded-2xl shadow p-6">
          <h3 className="text-lg font-medium text-white mb-4">Sistema</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white-100">Elementos del menú:</span>
              <span className="text-white font-medium">{menuItems.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white-100">Administradores:</span>
              <span className="text-purple-400 font-medium">
                {userStats.admins}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white-100">Editores:</span>
              <span className="text-blue-400 font-medium">
                {userStats.editors}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white-100">Actividades hoy:</span>
              <span className="text-green-400 font-medium">
                {activities.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nueva sección de estadísticas multimedia */}
      {multimediaStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-bg-300 rounded-2xl shadow p-6">
            <h3 className="text-lg font-medium text-white mb-4">Multimedia</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white-100">Total archivos:</span>
                <span className="text-white font-medium">{multimediaStats.totalFiles}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white-100">Imágenes:</span>
                <span className="text-blue-400 font-medium">
                  {multimediaStats.byCategory.image || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white-100">Videos:</span>
                <span className="text-purple-400 font-medium">
                  {multimediaStats.byCategory.video || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white-100">Documentos:</span>
                <span className="text-green-400 font-medium">
                  {multimediaStats.byCategory.document || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-bg">
        <h3 className="text-lg font-medium text-white py-2 px-5">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              target={action.external ? "_blank" : undefined}
              className="bg-bg-300 rounded-2xl shadow p-6 hover:shadow-md transition-shadow"
            >
              <div
                className={`${action.color} rounded-2xl p-3 w-12 h-12 flex items-center justify-center mb-4`}
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

      <div className=" rounded-2xl shadow">
        <div className="px-6 py-2 ">
          <h3 className="text-lg font-medium text-white">Actividad Reciente</h3>
        </div>
        <div className="divide-y bg-bg-300 rounded-2xl divide-white/10 h-48 overflow-y-scroll">
          {activities.length > 0 ? (
            activities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <FiTrendingUp className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-white-100">
                      por {activity.userName}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-white-100">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-white-100">
              <p>No hay actividad reciente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
