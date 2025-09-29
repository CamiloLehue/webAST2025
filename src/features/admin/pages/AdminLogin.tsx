import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);
  const { login, isLoading, error: authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login({ email, password });
    if (success) {
      navigate("/admin");
    }
  };

  const testCredentials = [
    { email: "admin@ast.com", role: "Administrador (administrador)", password: "Ver en BD" },
    { email: "javier@ast.com", role: "Editor (editor)", password: "Ver en BD" },
    { email: "nay@ast.com", role: "Administrador (admin)", password: "Ver en BD" }
  ];

  const fillCredentials = (email: string) => {
    setEmail(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-bg-400 to-bg-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xs w-full space-y-8">
        <div>
          <img
            className="mx-auto h-20 w-auto"
            src="/AST-Logo-white.png"
            alt="AST Logo"
          />
          <h2 className="mt-6 text-center text-xl font-extrabold text-white-100">
            Panel Administrativo
          </h2>
          <p className="mt-2 text-center text-sm text-white-100/50">
            Ingresa tus credenciales para acceder
          </p>
        </div>
        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-bg-200 placeholder-white-100/50 text-white focus:outline-none focus:ring-primary-100 focus:border-primary-100 focus:z-10 sm:text-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-bg-200 placeholder-white-100/50 text-white focus:outline-none focus:ring-primary-100 focus:border-primary-100 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {authError && (
            <div className="text-red-300 text-sm text-center bg-red-900/20 p-3 rounded-md">
              {authError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-100 hover:bg-primary-100/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </div>

          {/* Botón para mostrar credenciales de prueba */}
          <div>
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="w-full text-xs text-white-100/70 hover:text-white-100 transition-colors"
            >
              {showCredentials ? "Ocultar" : "Ver"} usuarios de prueba
            </button>
          </div>

          {/* Lista de credenciales de prueba */}
          {showCredentials && (
            <div className="space-y-2">
              <div className="text-xs text-white-100/80 text-center mb-2">
                Usuarios disponibles:
              </div>
              {testCredentials.map((cred, index) => (
                <div key={index} className="bg-bg-300/30 p-2 rounded text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{cred.email}</div>
                      <div className="text-white-100/60">{cred.role}</div>
                      <div className="text-white-100/50 text-xs mt-1">
                        Contraseña: {cred.password}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillCredentials(cred.email)}
                      className="text-xs text-primary-100 hover:text-primary-100/80 border border-primary-100/30 hover:border-primary-100/60 px-2 py-1 rounded transition-colors"
                    >
                      Usar
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-xs text-white-100/50 text-center mt-2">
                Las contraseñas están hasheadas en la BD. Usa las credenciales originales.
              </div>
            </div>
          )}

          <div className="text-xs text-white-100/50 mt-4 flex flex-col justify-center items-center">
            <p>
              <strong>Credenciales de prueba:</strong>
            </p>
            <p>Admin: admin@ast.com / admin123</p>
            <p>Editor: editor@ast.com / editor123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
