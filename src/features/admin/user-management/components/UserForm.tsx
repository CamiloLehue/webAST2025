import React, { useState, useEffect } from 'react';
import type { User, CreateUserRequest, UpdateUserRequest, UserRole } from '../types/userTypes';
import { UserRole as UserRoleConstants, getRoleDisplayName } from '../types/userTypes';

interface UserFormProps {
  user?: User;
  onSubmit: (userData: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRoleConstants.EDITOR as UserRole,
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        confirmPassword: '',
        role: user.role,
        active: user.active
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es obligatoria';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        const updateData: UpdateUserRequest = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          active: formData.active
        };
        await onSubmit(updateData);
      } else {
        const createData: CreateUserRequest = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        };
        await onSubmit(createData);
      }
    } catch (error) {
      console.error('Error en el formulario:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {!isEditing && (
          <>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </>
        )}

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Rol *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value={UserRoleConstants.EDITOR}>{getRoleDisplayName(UserRoleConstants.EDITOR)}</option>
            <option value={UserRoleConstants.ADMINISTRATOR}>{getRoleDisplayName(UserRoleConstants.ADMINISTRATOR)}</option>
          </select>
        </div>

        {isEditing && (
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  active: e.target.checked
                }))}
                disabled={loading}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Usuario activo
              </span>
            </label>
          </div>
        )}

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Usuario')}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;