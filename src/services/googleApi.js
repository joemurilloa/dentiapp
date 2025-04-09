// src/services/googleApi.js
import { refreshGoogleTokenIfNeeded } from './googleAuth';

// Funciones para Google Drive
export const createGoogleDriveFolders = async () => {
  try {
    const accessToken = await refreshGoogleTokenIfNeeded();
    
    // Crear carpeta raíz si no existe
    const rootFolder = await getOrCreateFolder('ClinicaDental', null, accessToken);
    
    // Crear subcarpetas
    await Promise.all([
      getOrCreateFolder('Clientes', rootFolder.id, accessToken),
      getOrCreateFolder('Expedientes', rootFolder.id, accessToken),
      getOrCreateFolder('Citas', rootFolder.id, accessToken)
    ]);
    
    // Crear hojas de cálculo para la base de datos si no existen
    await initializeGoogleSheets(accessToken);
    
    return true;
  } catch (error) {
    console.error('Error al crear estructura de carpetas en Drive:', error);
    throw error;
  }
};

const getOrCreateFolder = async (folderName, parentId, accessToken) => {
  try {
    // Primero verificar si la carpeta ya existe
    const query = parentId 
      ? `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`
      : `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and 'root' in parents and trashed=false`;
    
    const searchResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    const searchResult = await searchResponse.json();
    
    // Si la carpeta existe, devolverla
    if (searchResult.files && searchResult.files.length > 0) {
      return searchResult.files[0];
    }
    
    // Si no existe, crearla
    const metadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : ['root']
    };
    
    const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metadata)
    });
    
    return await createResponse.json();
  } catch (error) {
    console.error(`Error al obtener/crear carpeta ${folderName}:`, error);
    throw error;
  }
};

// Funciones para Google Sheets
export const initializeGoogleSheets = async (accessToken) => {
  try {
    // Obtener ID de la carpeta raíz
    const query = `name='ClinicaDental' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    const result = await response.json();
    if (!result.files || result.files.length === 0) {
      throw new Error('No se encontró la carpeta ClinicaDental');
    }
    
    const folderId = result.files[0].id;
    
    // Verificar si ya existe la hoja de cálculo de la base de datos
    const dbQuery = `name='ClinicaDentalDB' and mimeType='application/vnd.google-apps.spreadsheet' and '${folderId}' in parents and trashed=false`;
    const dbResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(dbQuery)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    const dbResult = await dbResponse.json();
    
    let spreadsheetId;
    
    // Si no existe, crear la hoja de cálculo
    if (!dbResult.files || dbResult.files.length === 0) {
      const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: { title: 'ClinicaDentalDB' },
          sheets: [
            { properties: { title: 'Clientes' } },
            { properties: { title: 'Precios' } },
            { properties: { title: 'Citas' } }
          ]
        })
      });
      
      const createResult = await createResponse.json();
      spreadsheetId = createResult.spreadsheetId;
      
      // Mover la hoja de cálculo a la carpeta ClinicaDental
      await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}?addParents=${folderId}&removeParents=root`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Inicializar las hojas con encabezados
      await initializeSheetHeaders(spreadsheetId, 'Clientes', ['ID', 'Nombre', 'Teléfono', 'Email', 'DriveFolderID'], accessToken);
      await initializeSheetHeaders(spreadsheetId, 'Precios', ['ID_servicio', 'Descripción', 'Precio'], accessToken);
      await initializeSheetHeaders(spreadsheetId, 'Citas', ['ID_cita', 'ID_cliente', 'Fecha', 'Hora', 'Servicios', 'EventID_Calendar', 'LinkExpedientePDF'], accessToken);
    } else {
      spreadsheetId = dbResult.files[0].id;
    }
    
    // Guardar el ID de la hoja de cálculo para uso futuro
    localStorage.setItem('spreadsheetId', spreadsheetId);
    
    return spreadsheetId;
  } catch (error) {
    console.error('Error al inicializar Google Sheets:', error);
    throw error;
  }
};

const initializeSheetHeaders = async (spreadsheetId, sheetName, headers, accessToken) => {
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:${String.fromCharCode(65 + headers.length - 1)}1?valueInputOption=RAW`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range: `${sheetName}!A1:${String.fromCharCode(65 + headers.length - 1)}1`,
        majorDimension: 'ROWS',
        values: [headers]
      })
    });
  } catch (error) {
    console.error(`Error al inicializar encabezados de la hoja ${sheetName}:`, error);
    throw error;
  }
};

// Funciones para manipular datos en Google Sheets
export const getClientes = async () => {
  try {
    const accessToken = await refreshGoogleTokenIfNeeded();
    const spreadsheetId = localStorage.getItem('spreadsheetId');
    
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Clientes`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    const result = await response.json();
    
    if (!result.values || result.values.length <= 1) {
      return []; // Solo hay encabezados o está vacío
    }
    
    const headers = result.values[0];
    return result.values.slice(1).map(row => {
      const cliente = {};
      headers.forEach((header, index) => {
        cliente[header] = row[index] || '';
      });
      return cliente;
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
};

export const createCliente = async (cliente) => {
  try {
    const accessToken = await refreshGoogleTokenIfNeeded();
    const spreadsheetId = localStorage.getItem('spreadsheetId');
    
    // Generar ID único para el cliente
    cliente.ID = 'CLI' + Date.now().toString().slice(-6);
    
    // Crear carpeta para el cliente en Drive
    const clientesFolderId = await getClientesFolderId(accessToken);
    const clienteFolder = await getOrCreateFolder(cliente.ID, clientesFolderId, accessToken);
    cliente.DriveFolderID = clienteFolder.id;
    
    // Obtener la última fila para insertar
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Clientes!A:A`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    const result = await response.json();
    const nextRow = result.values ? result.values.length + 1 : 2; // +1 porque empezamos en 1, o 2 si está vacío (encabezados)
    
    // Preparar los datos para insertar
    const values = [
      [cliente.ID, cliente.Nombre, cliente.Teléfono, cliente.Email, cliente.DriveFolderID]
    ];
    
    // Insertar el nuevo cliente
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Clientes!A${nextRow}:E${nextRow}?valueInputOption=RAW`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range: `Clientes!A${nextRow}:E${nextRow}`,
        majorDimension: 'ROWS',
        values: values
      })
    });
    
    return cliente;
  } catch (error) {
    console.error('Error al crear cliente:', error);
    throw error;
  }
};

const getClientesFolderId = async (accessToken) => {
  try {
    // Primero obtener el ID de la carpeta raíz
    const rootQuery = `name='ClinicaDental' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const rootResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(rootQuery)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    const rootResult = await rootResponse.json();
    if (!rootResult.files || rootResult.files.length === 0) {
      throw new Error('No se encontró la carpeta ClinicaDental');
    }
    
    const rootFolderId = rootResult.files[0].id;
    
    // Obtener el ID de la carpeta Clientes
    const query = `name='Clientes' and mimeType='application/vnd.google-apps.folder' and '${rootFolderId}' in parents and trashed=false`;
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    const result = await response.json();
    if (!result.files || result.files.length === 0) {
      throw new Error('No se encontró la carpeta Clientes');
    }
    
    return result.files[0].id;
  } catch (error) {
    console.error('Error al obtener ID de carpeta Clientes:', error);
    throw error;
  }
};

// Funciones para Google Calendar
export const createCalendarEvent = async (cita) => {
  try {
    const accessToken = await refreshGoogleTokenIfNeeded();
    
    // Obtener detalles del cliente
    const clientes = await getClientes();
    const cliente = clientes.find(c => c.ID === cita.ID_cliente);
    
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    
    // Formatear fecha y hora para Calendar
    const [dia, mes, anio] = cita.Fecha.split('/');
    const [hora, minutos] = cita.Hora.split(':');
    
    const fechaInicio = new Date(anio, mes - 1, dia, hora, minutos);
    const fechaFin = new Date(fechaInicio.getTime() + 60 * 60 * 1000); // 1 hora después
    
    // Preparar servicios para la descripción
    let serviciosTexto = '';
    if (cita.Servicios && cita.Servicios.length > 0) {
      const precios = await getPrecios();
      const serviciosList = cita.Servicios.split(',');
      
      serviciosTexto = serviciosList.map(servId => {
        const servicio = precios.find(p => p.ID_servicio === servId.trim());
        return servicio 
          ? `• ${servicio.Descripción}: $${servicio.Precio}`
          : `• Servicio ${servId}`;
      }).join('\n');
    }
    
    // Crear evento en Calendar
    const event = {
      summary: `Cita: ${cliente.Nombre}`,
      description: `Servicios a realizar:\n${serviciosTexto}`,
      start: {
        dateTime: fechaInicio.toISOString(),
        timeZone: 'America/Mexico_City' // Ajustar según la zona horaria
      },
      end: {
        dateTime: fechaFin.toISOString(),
        timeZone: 'America/Mexico_City' // Ajustar según la zona horaria
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 horas antes
          { method: 'popup', minutes: 60 } // 1 hora antes
        ]
      }
    };
    
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });
    
    const result = await response.json();
    return result.id; // Devolver el ID del evento de Calendar
  } catch (error) {
    console.error('Error al crear evento en Calendar:', error);
    throw error;
  }
};

export const getPrecios = async () => {
  try {
    const accessToken = await refreshGoogleTokenIfNeeded();
    const spreadsheetId = localStorage.getItem('spreadsheetId');
    
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Precios`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    const result = await response.json();
    
    if (!result.values || result.values.length <= 1) {
      return []; // Solo hay encabezados o está vacío
    }
    
    const headers = result.values[0];
    return result.values.slice(1).map(row => {
      const precio = {};
      headers.forEach((header, index) => {
        precio[header] = row[index] || '';
      });
      return precio;
    });
  } catch (error) {
    console.error('Error al obtener precios:', error);
    throw error;
  }
};

// Función para subir PDF a Google Drive
export const uploadPdfToDrive = async (fileName, pdfBlob, folderId) => {
  try {
    const accessToken = await refreshGoogleTokenIfNeeded();
    
    // Crear form data para subir el archivo
    const metadata = {
      name: fileName,
      parents: [folderId]
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', pdfBlob);
    
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: form
    });
    
    const result = await response.json();
    return result.id; // Devolver el ID del archivo
  } catch (error) {
    console.error('Error al subir PDF a Drive:', error);
    throw error;
  }
};