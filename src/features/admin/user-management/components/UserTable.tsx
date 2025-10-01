import React from "react";
import type { User } from "../types/userTypes";
import { getRoleDisplayName, getStatusDisplayName } from "../types/userTypes";

interface UserTableProps {
  users?: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
  loading?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
  loading = false,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeColor = (active: boolean) => {
    return active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "editor":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white">No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-bg-300 border border-bg-300">
        <thead className="bg-bg-300">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Rol
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Último Acceso
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Creado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-bg-300 divide-y divide-bg-200">
          {(users || []).map((user) => (
            <tr key={user.id} className="hover:bg-bg-100">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-white">
                    {user.name}
                  </div>
                  <div className="text-sm text-white">{user.email}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {getRoleDisplayName(user.role)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                    user.active
                  )}`}
                >
                  {getStatusDisplayName(user.active)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {user.last_login ? formatDate(user.last_login) : "Nunca"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {formatDate(user.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-white hover:text-blue-100 px-2 py-1 rounded border border-bg-100 hover:bg-bg-400"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => onToggleStatus(user)}
                    className={`px-2 py-1 rounded border ${
                      user.active
                        ? "text-red-600 hover:text-red-100 border-bg-100 hover:bg-bg-400"
                        : "text-green-600 hover:text-green-100 border-bg-100 hover:bg-bg-400"
                    }`}
                  >
                    {user.active ? "Desactivar" : "Activar"}
                  </button>

                  <button
                    onClick={() => onDelete(user)}
                    className="text-red-600 hover:text-red-100 px-2 py-1 rounded border border-bg-100 hover:bg-bg-400"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
