// src/pages/Patients.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClientes, addCliente } from '../features/clientes/clientesSlice';
import { User, ChevronLeft, ChevronRight, Search, Plus, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';

const Patients = () => {
  const dispatch = useDispatch();
  const { items: clientes, status } = useSelector((state) => state.clientes);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchClientes());
    }
  }, [status, dispatch]);

  const filteredClientes = clientes.filter(cliente => 
    cliente.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.Teléfono?.includes(searchTerm)
  );

  // Paginación
  const pageCount = Math.ceil(filteredClientes.length / itemsPerPage);
  const paginatedClientes = filteredClientes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNewPatient = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pacientes</h1>
        <button 
          onClick={handleNewPatient}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          <Plus className="h-5 w-5 mr-1" />
          Nuevo Paciente
        </button>
      </div>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Buscar paciente..."
          />
        </div>
      </div>
      
      {status === 'loading' ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-pink-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedClientes.length > 0 ? (
                  paginatedClientes.map((cliente) => (
                    <tr key={cliente.ID}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{cliente.Nombre}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-300">{cliente.Teléfono}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-300">{cliente.Email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{cliente.ID}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">Ver</button>
                          <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">Editar</button>
                          <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'No se encontraron pacientes con esa búsqueda' : 'No hay pacientes registrados'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <nav className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-700'
                      : 'text-gray-700 bg-white hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700'
                  }`}
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                  disabled={currentPage === pageCount || pageCount === 0}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                    currentPage === pageCount || pageCount === 0
                      ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-700'
                      : 'text-gray-700 bg-white hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700'
                  }`}
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrando <span className="font-medium">{filteredClientes.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredClientes.length)}</span> de <span className="font-medium">{filteredClientes.length}</span> pacientes
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 ${
                        currentPage === 1
                          ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-700'
                          : 'text-gray-500 bg-white hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="sr-only">Anterior</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {/* Generación dinámica de números de página */}
                    {Array.from({ length: Math.min(5, pageCount) }).map((_, index) => {
                      let pageNumber;
                      if (pageCount <= 5) {
                        // Si hay 5 páginas o menos, mostrar todas
                        pageNumber = index + 1;
                      } else if (currentPage <= 3) {
                        // Si estamos en las primeras páginas
                        pageNumber = index + 1;
                      } else if (currentPage >= pageCount - 2) {
                        // Si estamos en las últimas páginas
                        pageNumber = pageCount - 4 + index;
                      } else {
                        // Si estamos en páginas intermedias
                        pageNumber = currentPage - 2 + index;
                      }
                      
                      return (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === pageNumber
                              ? 'z-10 bg-pink-600 border-pink-600 text-white'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                      disabled={currentPage === pageCount || pageCount === 0}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 ${
                        currentPage === pageCount || pageCount === 0
                          ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-700'
                          : 'text-gray-500 bg-white hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="sr-only">Siguiente</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </nav>
          </div>
        </>
      )}
      
      {/* Modal para Nuevo Paciente */}
      <PatientModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

const PatientModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    Nombre: '',
    Teléfono: '',
    Email: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error cuando se modifica el campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Nombre.trim()) newErrors.Nombre = 'El nombre es obligatorio';
    if (!formData.Teléfono.trim()) newErrors.Teléfono = 'El teléfono es obligatorio';
    if (!formData.Email.trim()) {
      newErrors.Email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = 'El formato del email no es válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(addCliente(formData)).unwrap();
      toast.success('Paciente creado correctamente');
      onClose();
      setFormData({ Nombre: '', Teléfono: '', Email: '' });
    } catch (error) {
      toast.error(`Error al crear el paciente: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                    Nuevo Paciente
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
                      <label htmlFor="Nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        name="Nombre"
                        id="Nombre"
                        value={formData.Nombre}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.Nombre ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                        } shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
                      />
                      {errors.Nombre && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Nombre}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="Teléfono" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="Teléfono"
                        id="Teléfono"
                        value={formData.Teléfono}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.Teléfono ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                        } shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
                      />
                      {errors.Teléfono && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Teléfono}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="Email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        name="Email"
                        id="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.Email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                        } shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
                      />
                      {errors.Email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Email}</p>
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
                      ) : 'Guardar'}
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

export default Patients;