// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeGoogleAuth } from './services/googleAuth';
import { setUser, setInitializing } from './features/auth/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importar componentes
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Prices from './pages/Prices';
import Records from './pages/Records';
import Login from './pages/Login';
import LoadingScreen from './components/ui/LoadingScreen';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => {
  const dispatch = useDispatch();
  const { user, isInitializing } = useSelector((state) => state.auth);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userInfo = await initializeGoogleAuth();
        dispatch(setUser(userInfo));
      } catch (error) {
        console.error('Error al inicializar la autenticación:', error);
        dispatch(setInitializing(false));
      }
    };

    initAuth();
  }, [dispatch]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Aplicar clase al body
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Aplicar tema inicial
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider value={{ darkMode, toggleDarkMode }}>
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          
          <Route path="/" element={user ? <DashboardLayout /> : <Navigate to="/login" />}>
            <Route index element={<Dashboard />} />
            <Route path="pacientes" element={<Patients />} />
            <Route path="citas" element={<Appointments />} />
            <Route path="precios" element={<Prices />} />
            <Route path="expedientes" element={<Records />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;