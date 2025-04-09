// src/pages/Records.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClientes } from '../features/clientes/clientesSlice';
import { generateExpediente } from '../features/citas/citasSlice';
import { User, FileText, Search, Download, Eye, Plus, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';

const Records = () => {
  const dispatch = useDispatch();
  const { items: clientes, status: clientesStatus } = useSelector((state) => state.clientes);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  
  useEffect(() => {
    if (clientesStatus === 'idle') {
      dispatch(fetchClientes());
    }
  }, [clientesStatus, dispatch]);
  
  const handleNewRecord = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCliente(null);
  };
  
  // Datos de ejemplo para expedientes
  const expedientesEjemplo = [
    { 
      id: 'EXP001', 
      paciente: 'Ana Martínez', 
      fecha: '05/04/2025', 
      tipo: 'Consulta general',
      url: '#'
    },
    { 
      id: 'EXP002', 
      paciente: 'Carlos Rodríguez', 
      fecha: '02/04/2025', 
      tipo: 'Radiografía + Diagnóstico',
      url: '#'
    },
    { 
      id: 'EXP003', 
      paciente: 'Laura Fernández', 
      fecha: '28/03/2025', 
      tipo: 'Tratamiento ortodoncia',
      url: '#'
    },
    { 
      id: 'EXP004', 
      paciente: 'Pedro Sánchez', 
      fecha: '25/03/2025', 
      tipo: 'Empaste',
      url: '#'
    },
    { 
      id: 'EXP005', 
      paciente: 'María González', 
      fecha: '20/03/2025', 
      tipo: 'Revisión periódica',
      url: '#'
    }
  ];
  
  const filteredExpedientes = expedientesEjemplo.filter(expediente => 
    expediente.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expediente.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expedientes</h1>
        <button 
          onClick={handleNewRecord}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          <Plus className="h-5 w-5 mr-1" />
          Nuevo Expediente
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
            placeholder="Buscar expediente..."
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Expedientes Recientes</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredExpedientes.length > 0 ? (
              filteredExpedientes.map((expediente, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{expediente.paciente}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{expediente.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">{expediente.fecha}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">{expediente.tipo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button className="text-pink-600 dark:text-pink-400 hover:text-pink-900 dark:hover:text-pink-300 flex items-center">
                        <Eye className="h-5 w-5 mr-1" />
                        <span>Ver</span>
                      </button>
                      <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 flex items-center">
                        <Download className="h-5 w-5 mr-1" />
                        <span>Descargar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No se encontraron expedientes con esa búsqueda' : 'No hay expedientes disponibles'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal para Nuevo Expediente */}
      <RecordModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        clientes={clientes}
        selectedCliente={selectedCliente}
        setSelectedCliente={setSelectedCliente}
      />
    </div>
  );
};

const RecordModal = ({ isOpen, onClose, clientes, selectedCliente, setSelectedCliente }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    tipoExpediente: 'consulta',
    descripcion: '',
    archivosAdjuntos: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClienteChange = (clienteId) => {
    setSelectedCliente(clienteId);
    // Limpiar error cuando se modifica el campo
    if (errors.clienteId) {
      setErrors(prev => ({ ...prev, clienteId: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error cuando se modifica el campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, archivosAdjuntos: files }));
    // Limpiar error cuando se modifica el campo
    if (errors.archivosAdjuntos) {
      setErrors(prev => ({ ...prev, archivosAdjuntos: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedCliente) newErrors.clienteId = 'Debe seleccionar un paciente';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Buscar el cliente seleccionado
      const cliente = clientes.find(c => c.ID === selectedCliente);
      
      if (!cliente) {
        throw new Error('Cliente no encontrado');
      }
      
      // Generar expediente
      await dispatch(generateExpediente({
        cliente,
        historialCitas: [] // Aquí se podría enviar el historial real de citas
      })).unwrap();
      
      toast.success('Expediente generado correctamente');
      onClose();
      
      // Resetear formulario
      setFormData({
        tipoExpediente: 'consulta',
        descripcion: '',
        archivosAdjuntos: []
      });
      setSelectedCliente(null);
    } catch (error) {
      toast.error(`Error al generar expediente: ${error}`);
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
                    Nuevo Expediente
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
                      <label htmlFor="clienteId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Paciente
                      </label>
                      <select
                        id="clienteId"
                        value={selectedCliente || ''}
                        onChange={(e) => handleClienteChange(e.target.value)}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.clienteId ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-gray-900 dark:text-white shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm`}
                      >
                        <option value="">Seleccionar paciente</option>
                        {clientes.map((cliente) => (
                          <option key={cliente.ID} value={cliente.ID}>
                            {cliente.Nombre}
                          </option>
                        ))}
                      </select>
                      {errors.clienteId && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.clienteId}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="tipoExpediente" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tipo de Expediente
                      </label>
                      <select
                        id="tipoExpediente"
                        name="tipoExpediente"
                        value={formData.tipoExpediente}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-gray-900 dark:text-white shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm`}
                      >
                        <option value="consulta">Consulta general</option>
                        <option value="tratamiento">Tratamiento</option>
                        <option value="radiografia">Radiografía</option>
                        <option value="cirugia">Cirugía</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Descripción
                      </label>
                      <textarea
                        id="descripcion"
                        name="descripcion"
                        rows={3}
                        value={formData.descripcion}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.descripcion ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                        } shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
                        placeholder="Detalles del expediente..."
                      />
                      {errors.descripcion && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.descripcion}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="archivosAdjuntos" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Archivos Adjuntos (opcional)
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="archivosAdjuntos"
                              className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-pink-600 dark:text-pink-400 hover:text-pink-500 dark:hover:text-pink-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500"
                            >
                              <span>Cargar archivos</span>
                              <input
                                id="archivosAdjuntos"
                                name="archivosAdjuntos"
                                type="file"
                                className="sr-only"
                                multiple
                                onChange={handleFileChange}
                              />
                            </label>
                            <p className="pl-1">o arrastrar y soltar</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, PDF hasta 10MB
                          </p>
                        </div>
                      </div>
                      {formData.archivosAdjuntos.length > 0 && (
                        <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
                          {formData.archivosAdjuntos.map((file, index) => (
                            <li key={index} className="py-2 flex items-center">
                              <FileText className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900 dark:text-white truncate">{file.name}</span>
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                {(file.size / 1024).toFixed(1)} KB
                              </span>
                            </li>
                          ))}
                        </ul>
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
                          Generando...
                        </>
                      ) : 'Generar Expediente'}
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

export default Records;