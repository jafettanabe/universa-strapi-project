import type { StrapiApp } from '@strapi/strapi/admin';
import React, { useRef, useState } from 'react';

const ExcelImportComponent = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const pathname = window.location.pathname;
  const isScheduledClass = pathname.includes('api::scheduled-class.scheduled-class');

  if (!isScheduledClass) return null;

  // Handle template download
  const handleDownloadTemplate = () => {
    const csvContent = 
      "title,level,day,schedule,teacher,isFull,whatsappNumber,program\n" +
      "Virtual Coffee,Intermedio Alto,Miércoles 12 Agosto,1:00 PM - 2:00 PM,John Doe,false,+51945311934,Conversational Club\n" +
      "Grammar Review,Básico,Lunes 10 Agosto,7:00 PM - 8:00 PM,Jane Smith,false,,Conversational Club\n";
    
    // Create blob and trigger download
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "plantilla_clases_programadas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle file select and parse
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const text = evt.target?.result as string;
          if (!text) throw new Error("No se pudo leer el archivo.");

          // If it's a CSV, we can parse it directly
          let rows: any[] = [];
          if (file.name.endsWith('.csv')) {
            rows = parseCSV(text);
          } else {
            // Excel file parsing via dynamic sheetjs load
            const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs');
            const workbook = XLSX.read(text, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            rows = XLSX.utils.sheet_to_json(sheet);
          }

          if (rows.length === 0) {
            alert("El archivo está vacío o no tiene el formato correcto.");
            setLoading(false);
            return;
          }

          // Map headers to properties (lowercasing, trimming, matching columns)
          const classes = rows.map((row: any) => {
            return {
              title: row.title || row.titulo || row.Título || row.Title || null,
              level: row.level || row.nivel || row.Nivel || row.Level || null,
              day: row.day || row.dia || row.Día || row.Day || null,
              schedule: row.schedule || row.horario || row.Horario || row.Schedule || null,
              teacher: row.teacher || row.profesor || row.Profesor || row.Teacher || null,
              isFull: String(row.isFull || row.lleno || row.Lleno || row.IsFull || 'false'),
              whatsappNumber: row.whatsappNumber || row.whatsapp || row.WhatsApp || row.whatsappNumber || null,
              program: row.program || row.programa || row.Programa || row.Program || null,
            };
          });

          // Send to API
          const response = await fetch('/api/scheduled-classes/import', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ classes }),
          });

          const resData = await response.json();
          if (response.ok) {
            let msg = `¡Importación exitosa!\n${resData.createdCount} clases creadas.`;
            if (resData.errors && resData.errors.length > 0) {
              msg += `\n\nErrores encontrados:\n` + resData.errors.join('\n');
            }
            alert(msg);
            // Reload the page to refresh list view
            window.location.reload();
          } else {
            alert(`Error: ${resData.error || 'No se pudo completar la importación.'}`);
          }
        } catch (err: any) {
          alert(`Error al procesar el archivo: ${err.message}`);
        } finally {
          setLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };

      if (file.name.endsWith('.csv')) {
        reader.readAsText(file, 'utf-8');
      } else {
        reader.readAsBinaryString(file);
      }

    } catch (err: any) {
      alert(`Error al cargar el archivo: ${err.message}`);
      setLoading(false);
    }
  };

  // Tiny CSV parser helper
  const parseCSV = (text: string): any[] => {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length <= 1) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Basic comma splitting
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      if (values.length === 0 || (values.length === 1 && !values[0])) continue;

      const obj: any = {};
      headers.forEach((header, idx) => {
        obj[header] = values[idx] || null;
      });
      rows.push(obj);
    }
    return rows;
  };

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '4px',
    border: '1px solid #dcdce4',
    background: '#ffffff',
    color: '#32325d',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: '#4945ff',
    borderColor: '#4945ff',
    color: '#ffffff',
  };

  return (
    <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
      <button 
        type="button" 
        onClick={handleDownloadTemplate} 
        style={buttonStyle}
        onMouseOver={(e) => { e.currentTarget.style.background = '#f6f6f9'; }}
        onMouseOut={(e) => { e.currentTarget.style.background = '#ffffff'; }}
      >
        📥 Descargar Plantilla
      </button>

      <button 
        type="button" 
        onClick={() => fileInputRef.current?.click()} 
        style={primaryButtonStyle}
        disabled={loading}
        onMouseOver={(e) => { if (!loading) e.currentTarget.style.background = '#3e3bff'; }}
        onMouseOut={(e) => { if (!loading) e.currentTarget.style.background = '#4945ff'; }}
      >
        {loading ? '⏳ Procesando...' : '📤 Cargar Excel / CSV'}
      </button>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        accept=".xlsx,.xls,.csv"
      />
    </div>
  );
};

export default {
  config: {
    locales: [],
  },
  bootstrap(app: StrapiApp) {
    app.getPlugin('content-manager').injectComponent('listView', 'actions', {
      name: 'ImportExcelButton',
      Component: ExcelImportComponent,
    });
  },
};
