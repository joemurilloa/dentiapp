// src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClientes } from '../features/clientes/clientesSlice';
import { fetchPrecios } from '../features/precios/preciosSlice';
import { Calendar, Users, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  //const { user } = useSelector((state) => state.auth);
  const { items: clientes, status: clientesStatus } = useSelector((state) => state.clientes);
  
  useEffect(() => {
    if (clientesStatus === 'idle') {
      dispatch(fetchClientes());
      dispatch(fetchPrecios());
    }
  }, [clientesStatus, dispatch]);

  // Datos de ejemplo para las citas de hoy
  const citasHoy = [
    { time: '09:00', name: 'María González', service: 'Limpieza dental', status: 'confirmed' },
    { time: '10:30', name: 'Carlos Rodríguez', service: 'Revisión + Radiografía', status: 'confirmed' },
    { time: '12:00', name: 'Ana Martínez', service: 'Extracción', status: 'confirmed' },
    { time: '16:00', name: 'Pedro Sánchez', service: 'Blanqueamiento', status: 'pending' },
    { time: '17:30', name: 'Laura Fernández', service: 'Consulta inicial', status: 'confirmed' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
            Conectado con Google
          </span>
        </div>
      </div>
      
      {/* Tarjetas de resumen */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Citas Hoy" value={citasHoy.length.toString()} color="#e83e8c" icon={<Calendar size={24} />} />
        <StatCard title="Pacientes" value={clientes.length.toString()} color="#28a745" icon={<Users size={24} />} />
        <StatCard title="Citas Mañana" value="3" color="#e83e8c" icon={<Calendar size={24} />} />
        <StatCard title="Ingresos Semana" value="$2,450" color="#28a745" icon={<DollarSign size={24} />} />
      </div>
      
      {/* Citas del día */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Citas de Hoy</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {citasHoy.map((cita, index) => (
            <AppointmentItem 
              key={index}
              time={cita.time} 
              name={cita.name} 
              service={cita.service} 
              status={cita.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md p-3" style={{ backgroundColor: `${color}20` }}>
            <div style={{ color }}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
              <dd>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppointmentItem = ({ time, name, service, status }) => {
  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-16 text-sm font-medium text-gray-900 dark:text-gray-100">{time}</div>
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{service}</div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span 
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'confirmed' 
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
          }`}
        >
          {status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
        </span>
        <button className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;