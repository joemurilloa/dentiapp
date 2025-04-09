// src/pages/Prices.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPrecios } from '../features/precios/preciosSlice';
import { Plus, X, Edit, Trash } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';

const Prices = () => {
  const dispatch = useDispatch();
  const { items: precios, status } = useSelector((state) => state.precios);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrecio, setEditingPrecio] = useState(null);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPrecios());
    }
  }, [status, dispatch]);
  
  const handleNewPrice = () => {
    setEditingPrecio(null);
    setIsModalOpen(true);
  };
  
  const handleEditPrice = (precio) => {
    setEditingPrecio(precio);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPrecio(null);
  };
  
  // Datos de ejemplo adicionales para mostrar en la tabla
  const preciosEjemplo = [
    { ID_servicio: 'SRV001', Descripción: 'Consulta General', Precio: '50.00' },
    { ID_servicio: 'SRV002', Descripción: 'Limpieza Dental', Precio: '80.00' },
    { ID_servicio: 'SRV003', Descripción: 'Extracción Simple', Precio: '120.00' },
    { ID_servicio: 'SRV004', Descripción: 'Empaste', Precio: '100.00' },
    { ID_servicio: 'SRV005', Descripción: 'Blanqueamiento', Precio: '250.00' },
    { ID_servicio: 'SRV006', Descripción: 'Radiografía', Precio: '70.00' }
  ];
  
  // Usar precios reales si hay, de lo contrario los de ejemplo
  const preciosParaMostrar = precios.length > 0 ? precios : preciosEjemplo;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lista de Precios</h1>
        <button 
          onClick={handleNewPrice}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          <Plus className="h-5 w-5 mr-1" />
          Nuevo Servicio
        </button>
      </div>
      
      {status === 'loading' ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-pink-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {preciosParaMostrar.map((precio) => (
                <tr key={precio.ID_servicio}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {precio.ID_servicio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {precio.Descripción.split(' ')[0]}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-300">{precio.Descripción}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">${precio.Precio}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditPrice(precio)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal para Nuevo/Editar Precio */}
      <PriceModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        precio={editingPrecio} 
      />
    </div>
  );
};

const PriceModal = ({ isOpen, onClose, precio }) => {
  const [formData, setFormData] = useState({
    Descripción: '',
    Precio: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (precio) {
      setFormData({
        Descripción: precio.Descripción,
        Precio: precio.Precio
      });
    } else {
      setFormData({
        Descripción: '',
        Precio: ''
      });
    }
  }, [precio]);

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
    if (!formData.Descripción.trim()) newErrors.Descripción = 'La descripción es obligatoria';
    if (!formData.Precio.trim()) {
      newErrors.Precio = 'El precio es obligatorio';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.Precio)) {
      newErrors.Precio = 'El precio debe ser un número válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Aquí se implementaría la lógica para guardar/actualizar el precio
      // Por ahora solo mostrar un mensaje de éxito
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular tiempo de petición
      
      toast.success(precio ? 'Servicio actualizado correctamente' : 'Servicio creado correctamente');
      onClose();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
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
                    {precio ? 'Editar Servicio' : 'Nuevo Servicio'}
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
                      <label htmlFor="Descripción" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Descripción
                      </label>
                      <input
                        type="text"
                        name="Descripción"
                        id="Descripción"
                        value={formData.Descripción}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.Descripción ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                        } shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
                      />
                      {errors.Descripción && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Descripción}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="Precio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Precio
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                        </div>
                        <input
                          type="text"
                          name="Precio"
                          id="Precio"
                          value={formData.Precio}
                          onChange={handleChange}
                          className={`block w-full rounded-md border ${
                            errors.Precio ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                          } pl-7 pr-12 focus:border-pink-500 focus:ring-pink-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
                          placeholder="0.00"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400 sm:text-sm">MXN</span>
                        </div>
                      </div>
                      {errors.Precio && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.Precio}</p>
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

export default Prices;
