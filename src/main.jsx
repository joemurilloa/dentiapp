// src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Variables globales */
:root {
  --color-primary: #e83e8c;
  --color-secondary: #28a745;
  --color-white: #ffffff;
  --color-black: #212529;
}

/* Estilos personalizados para modo oscuro */
.dark {
  --color-primary: #ff6bac;
  --color-secondary: #3dd162;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Estilos personalizados para selectores, inputs y datepickers */
input:focus, select:focus, textarea:focus {
  @apply ring-2 ring-pink-500 ring-opacity-50 border-pink-500;
}

.dark input:focus, 
.dark select:focus, 
.dark textarea:focus {
  @apply ring-2 ring-pink-400 ring-opacity-50 border-pink-400;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

/* Estilos para enlaces */
a {
  @apply text-pink-600;
}

a:hover {
  @apply text-pink-800;
}

.dark a {
  @apply text-pink-400;
}

.dark a:hover {
  @apply text-pink-300;
}

/* Estilos adicionales */
.tooltip {
  @apply invisible absolute;
}

.has-tooltip:hover .tooltip {
  @apply visible z-50;
}

/* Personalización de scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}

.dark ::-webkit-scrollbar-thumb {
  @apply bg-gray-600;
}

.dark ::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';