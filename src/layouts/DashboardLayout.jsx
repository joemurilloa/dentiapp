import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../features/auth/authSlice';
import { logoutFromGoogle } from '../services/googleAuth';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Home, 
  Users, 
  Calendar, 
  DollarSign, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon 
} from 'lucide-react';

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Definición de colores de la clínica
  const colors = {
    primary: '#e83e8c', // Rosa
    secondary: '#28a745', // Verde
    light: '#ffffff',    // Blanco
    dark: '#212529',     // Negro
  };

  const handleLogout = async () => {
    try {
      await logoutFromGoogle();
      dispatch(signOut());
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Redirigir a login si no hay usuario autenticado
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/pacientes', icon: <Users size={20} />, label: 'Pacientes' },
    { path: '/citas', icon: <Calendar size={20} />, label: 'Citas' },
    { path: '/precios', icon: <DollarSign size={20} />, label: 'Precios' },
    { path: '/expedientes', icon: <FileText size={20} />, label: 'Expedientes' },
  ];

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Cabecera */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm" style={{ backgroundColor: colors.primary }}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              className="md:hidden text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <span className="text-2xl text-white font-bold">DentiApp</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-10"
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="text-white">
              <span className="hidden md:inline mr-2">{user?.name || 'Usuario'}</span>
            </div>
            <button 
              className="text-white hover:text-pink-200 flex items-center"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span className="hidden md:inline ml-1">Salir</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Barra lateral */}
        <nav className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0`}>
          <div className="flex flex-col h-full p-4">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    style={{ backgroundColor: isActive ? colors.primary : 'transparent' }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
        
        {/* Área de contenido */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
