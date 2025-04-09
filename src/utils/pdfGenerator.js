import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { uploadPdfToDrive } from '../services/googleApi';

export const generateExpedientePdf = async (cliente, historialCitas) => {
  try {
    // Crear PDF
    const doc = new jsPDF();
    
    // Añadir título
    doc.setFontSize(22);
    doc.setTextColor(232, 62, 140); // Color rosa
    doc.text('Expediente Dental', 105, 20, { align: 'center' });
    
    // Añadir información del cliente
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Información del Paciente', 20, 40);
    
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`ID: ${cliente.ID}`, 20, 50);
    doc.text(`Nombre: ${cliente.Nombre}`, 20, 58);
    doc.text(`Teléfono: ${cliente.Teléfono}`, 20, 66);
    doc.text(`Email: ${cliente.Email}`, 20, 74);
    
    // Añadir historial de citas si existe
    if (historialCitas && historialCitas.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('Historial de Citas', 20, 90);
      
      const tableData = historialCitas.map(cita => [
        cita.Fecha,
        cita.Hora,
        cita.Servicios.split(',').map(s => s.trim()).join(', ')
      ]);
      
      doc.autoTable({
        startY: 100,
        head: [['Fecha', 'Hora', 'Servicios Realizados']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [232, 62, 140], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });
    } else {
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.text('No hay citas registradas para este paciente.', 20, 100);
    }
    
    // Añadir pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `DentiApp - Expediente generado: ${new Date().toLocaleDateString()}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    // Convertir a Blob
    const pdfBlob = doc.output('blob');
    
    // Obtener el ID de la carpeta Expedientes
    const expedientesFolderId = await getExpedientesFolderId();
    
    // Subir a Drive
    const fileName = `${cliente.ID}_${new Date().toISOString().substring(0, 10)}.pdf`;
    const fileId = await uploadPdfToDrive(fileName, pdfBlob, expedientesFolderId);
    
    return {
      fileId,
      fileName,
      url: `https://drive.google.com/file/d/${fileId}/view`
    };
  } catch (error) {
    console.error('Error al generar expediente PDF:', error);
    throw error;
  }
};

const getExpedientesFolderId = async () => {
  try {
    const accessToken = await refreshGoogleTokenIfNeeded();
    
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
    
    // Obtener el ID de la carpeta Expedientes
    const query = `name='Expedientes' and mimeType='application/vnd.google-apps.folder' and '${rootFolderId}' in parents and trashed=false`;
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    const result = await response.json();
    if (!result.files || result.files.length === 0) {
      throw new Error('No se encontró la carpeta Expedientes');
    }
    
    return result.files[0].id;
  } catch (error) {
    console.error('Error al obtener ID de carpeta Expedientes:', error);
    throw error;
  }
};