// src/pages/Appointments.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClientes } from '../features/clientes/clientesSlice';
import { fetchPrecios } from '../features/precios/preciosSlice';
import { addCita } from '../features/citas/citasSlice';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Dialog, Listbox, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const Appointments = () => {
  const dispatch = useDispatch();
  const { items: clientes, status: clientesStatus } = useSelector((state) => state.clientes);
  const { items: precios, status: preciosStatus } = useSelector((state) => state.precios);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (clientesStatus === 'idle') {
      dispatch(fetchClientes());
    }
    if (preciosStatus === 'idle') {
      dispatch(fetchPrecios());
    }
  }, [clientesStatus, preciosStatus, dispatch]);
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setCurrentDate(date);
  };
  
  const handleNewAppointment = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // Generar días del mes
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Día de la semana del primer día (0-6, donde 0 es domingo)
    let firstDayOfWeek = firstDay.getDay();
    // Convertir de formato domingo-sábado (0-6) a lunes-domingo (0-6)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Días del mes anterior para completar la primera semana
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonthDays = [];
    if (daysFromPrevMonth > 0) {
      const prevMonth = new Date(year, month - 1, 0);
      const prevMonthDaysCount = prevMonth.getDate();
      for (let i = prevMonthDaysCount - daysFromPrevMonth + 1; i <= prevMonthDaysCount; i++) {
        prevMonthDays.push({
          date: new Date(year, month - 1, i),
          isCurrentMonth: false,
          isToday: false
        });
      }
    }
    
    // Días del mes actual
    const currentMonthDays = [];
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = 
        date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear();
      
      currentMonthDays.push({
        date,
        isCurrentMonth: true,
        isToday
      });
    }
    
    // Días del mes siguiente para completar la última semana
    const totalDaysShown = 42; // 6 semanas * 7 días
    const daysFromNextMonth = totalDaysShown - prevMonthDays.length - currentMonthDays.length;
    const nextMonthDays = [];
    for (let i = 1; i <= daysFromNextMonth; i++) {
      nextMonthDays.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  // Datos de ejemplo para las citas
  const citasEjemplo = [
    { 
      fecha: new Date(2025, 3, 8), 
      citas: [
        { hora: '09:00', nombre: 'María González', servicio: 'Limpieza dental', estado: 'confirmada' },
        { hora: '10:30', nombre: 'Carlos Rodríguez', servicio: 'Revisión + Radiografía', estado: 'confirmada' },
        { hora: '12:00', nombre: 'Ana Martínez', servicio: 'Extracción', estado: 'confirmada' },
        { hora: '16:00', nombre: 'Pedro Sánchez', servicio: 'Blanqueamiento', estado: 'pendiente' },
        { hora: '17:30', nombre: 'Laura Fernández', servicio: 'Consulta inicial', estado: 'confirmada' }
      ]
    },
    { 
      fecha: new Date(2025, 3, 9), 
      citas: [
        { hora: '10:00', nombre: 'Juan Pérez', servicio: 'Revisión general', estado: 'confirmada' },
        { hora: '15:30', nombre: 'Elena Torres', servicio: 'Limpieza dental', estado: 'confirmada' }
      ]
    },
    { 
      fecha: new Date(2025, 3, 11), 
      citas: [
        { hora: '09:30', nombre: 'Roberto García', servicio: 'Empaste', estado: 'confirmada' }
      ]
    }
  ];
  
  // Obtener citas del día seleccionado
  const getCitasDelDia = (fecha) => {
    if (!fecha) return [];
    
    const citasDia = citasEjemplo.find(c => 
      c.fecha.getDate() === fecha.getDate() && 
      c.fecha.getMonth() === fecha.getMonth() && 
      c.fecha.getFullYear() === fecha.getFullYear()
    );
    
    return citasDia ? citasDia.citas : [];
  };
  
  // Verificar si un día tiene citas
  const verificarCitasEnDia = (fecha) => {
    return citasEjemplo.some(c => 
      c.fecha.getDate() === fecha.getDate() && 
      c.fecha.getMonth() === fecha.getMonth() && 
      c.fecha.getFullYear() === fecha.getFullYear()
    );
  };
  
  const diasDelMes = generateCalendarDays();
  const citasDelDiaSeleccionado = getCitasDelDia(currentDate);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agenda de Citas</h1>
        <button 
          onClick={handleNewAppointment}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          <Plus className="h-5 w-5 mr-1" />
          Nueva Cita
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={prevMonth}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {diasSemana.map((dia) => (
            <div key={dia} className="bg-white dark:bg-gray-800 py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {dia}
            </div>
          ))}
          {diasDelMes.map((dia, i) => {
            const tieneCitas = verificarCitasEnDia(dia.date);
            const isSelected = selectedDate && 
              selectedDate.getDate() === dia.date.getDate() && 
              selectedDate.getMonth() === dia.date.getMonth() && 
              selectedDate.getFullYear() === dia.date.getFullYear();
            
            return (
              <div 
                key={i} 
                className={`bg-white dark:bg-gray-800 p-3 text-center text-sm relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  !dia.isCurrentMonth ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
                } ${dia.isToday ? 'font-bold' : ''} ${isSelected ? 'ring-2 ring-pink-600 z-10' : ''}`}
                style={{ 
                  backgroundColor: dia.isToday ? 'rgba(232, 62, 140, 0.1)' : ''
                }}
                onClick={() => handleDateClick(dia.date)}
              >
                {dia.date.getDate()}
                {tieneCitas && (
                  <div 
                    className="h-1.5 w-1.5 rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2"
                    style={{ backgroundColor: '#e83e8c' }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Citas del día: {currentDate ? currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {citasDelDiaSeleccionado.length > 0 ? (
            citasDelDiaSeleccionado.map((cita, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 text-sm font-medium text-gray-900 dark:text-white">{cita.hora}</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{cita.nombre}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{cita.servicio}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cita.estado === 'confirmada' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    }`}
                  >
                    {cita.estado === 'confirmada' ? 'Confirmada' : 'Pendiente'}
                  </span>
                  <button className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              No hay citas programadas para este día
            </div>
          )}
        </div>
      </div>
      
      {/* Modal para Nueva Cita */}
      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        clientes={clientes} 
        precios={precios} 
        initialDate={selectedDate || new Date()}
      />
    </div>
  );
};

const AppointmentModal = ({ isOpen, onClose, clientes, precios, initialDate }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    ID_cliente: '',
    Fecha: initialDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    Hora: '09:00',
    Servicios: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Actualizar la fecha cuando cambia initialDate
    setFormData(prev => ({
      ...prev,
      Fecha: initialDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }));
  }, [initialDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error cuando se modifica el campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleServiciosChange = (serviciosSeleccionados) => {
    setFormData(prev => ({ ...prev, Servicios: serviciosSeleccionados }));
    // Limpiar error cuando se modifica el campo
    if (errors.Servicios) {
      setErrors(prev => ({ ...prev, Servicios: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.ID_cliente) newErrors.ID_cliente = 'Debe seleccionar un paciente';
    if (!formData.Fecha) newErrors.Fecha = 'La fecha es obligatoria';
    if (!formData.Hora) newErrors.Hora = 'La hora es obligatoria';
    if (!formData.Servicios || formData.Servicios.length === 0) {
      newErrors.Servicios = 'Debe seleccionar al menos un servicio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Convertir el array de servicios a string para guardar en Sheets
      const serviciosString = formData.Servicios.join(', ');
      
      await dispatch(addCita({
        ...formData,
        Servicios: serviciosString
      })).unwrap();
      
      toast.success('Cita creada correctamente');
      onClose();
      
      // Resetear formulario
      setFormData({
        ID_cliente: '',
        Fecha: initialDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        Hora: '09:00',
        Servicios: []
      });
    } catch (error) {
      toast.error(`Error al crear la cita: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generar opciones de horarios
  const horariosDisponibles = [];
  for (let hora = 9; hora <= 19; hora++) {
    for (let minutos of ['00', '30']) {
      if (hora === 19 && minutos === '30') continue; // No incluir 19:30
      horariosDisponibles.push(`${hora.toString().padStart(2, '0')}:${minutos}`);
    }
  }

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Nueva Cita
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="ID_cliente" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Paciente
                      </label>
                      <select
                        id="ID_cliente"
                        name="ID_cliente"
                        value={formData.ID_cliente}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.ID_cliente ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-gray-900 dark:text-white shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm`}
                      >
                        <option value="">Seleccionar paciente</option>
                        {clientes.map((cliente) => (
                          <option key={cliente.ID} value={cliente.ID}>
                            {cliente.Nombre}
                          </option>
                        ))}
                      </select>
                      {errors.ID_cliente && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.ID_cliente}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="Fecha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Fecha
                        </label>
                        <input
                          type="text"
                          name="Fecha"
                          id="Fecha"
                          value={formData.Fecha}
                          onChange={handleChange}
                          placeholder="DD/MM/AAAA"
                          className={`mt-1 block w-full rounded-md border ${
                            errors.Fecha ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                          } shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
                        />
                        {errors.Fecha && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Fecha}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="Hora" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Hora
                        </label>
                        <select
                          id="Hora"
                          name="Hora"
                          value={formData.Hora}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md border ${
                            errors.Hora ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                          } bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-gray-900 dark:text-white shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm`}
                        >
                          {horariosDisponibles.map((hora) => (
                            <option key={hora} value={hora}>
                              {hora}
                            </option>
                          ))}
                        </select>
                        {errors.Hora && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Hora}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Servicios
                      </label>
                      <ServiciosSelector 
                        servicios={precios} 
                        selectedServicios={formData.Servicios} 
                        onChange={handleServiciosChange}
                        hasError={!!errors.Servicios}
                      />
                      {errors.Servicios && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Servicios}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                      onClick={onClose}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                        isSubmitting 
                          ? 'bg-pink-400 cursor-not-allowed' 
                          : 'bg-pink-600 hover:bg-pink-700'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Guardando...
                        </>
                      ) : 'Guardar Cita'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const ServiciosSelector = ({ servicios, selectedServicios, onChange, hasError }) => {
  return (
    <div className={`mt-1 p-2 border ${
      hasError ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
    } rounded-md max-h-48 overflow-y-auto dark:bg-gray-700`}>
      {servicios.length > 0 ? (
        servicios.map((servicio) => (
          <div key={servicio.ID_servicio} className="flex items-center py-1">
            <input
              id={`servicio-${servicio.ID_servicio}`}
              name={`servicio-${servicio.ID_servicio}`}
              type="checkbox"
              checked={selectedServicios.includes(servicio.ID_servicio)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...selectedServicios, servicio.ID_servicio]);
                } else {
                  onChange(selectedServicios.filter(id => id !== servicio.ID_servicio));
                }
              }}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded dark:border-gray-600"
            />
            <label htmlFor={`servicio-${servicio.ID_servicio}`} className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {servicio.Descripción} - ${servicio.Precio}
            </label>
          </div>
        ))
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400 py-2 text-center">
          No hay servicios disponibles
        </div>
      )}
    </div>
  );
};

export default Appointments;