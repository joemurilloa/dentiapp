// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-extrabold text-pink-600 dark:text-pink-500">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Página no encontrada</h2>
        <p className="mt-6 text-base text-gray-600 dark:text-gray-400">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;