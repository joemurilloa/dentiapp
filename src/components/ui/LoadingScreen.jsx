// src/components/ui/LoadingScreen.jsx
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-600"></div>
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mt-4">Cargando DentiApp...</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Conectando con Google Workspace</p>
      </div>
    </div>
  );
};

export default LoadingScreen;