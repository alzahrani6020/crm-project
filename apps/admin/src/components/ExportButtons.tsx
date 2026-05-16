'use client';
import { Button } from './Button';

export function ExportButtons({ tableId, filename = 'export' }: { tableId: string; filename?: string }) {
  const exportExcel = () => {
    const table = document.getElementById(tableId);
    if (!table) return;
    import('xlsx').then(XLSX => {
      const wb = XLSX.utils.table_to_book(table, { sheet: 'Sheet1' });
      XLSX.writeFile(wb, `${filename}.xlsx`);
    });
  };

  const exportPDF = () => {
    const table = document.getElementById(tableId);
    if (!table) return;
    import('html2canvas').then(html2canvas => {
      import('jspdf').then(({ jsPDF }) => {
        html2canvas.default(table).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('l', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${filename}.pdf`);
        });
      });
    });
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button variant="secondary" onClick={exportExcel}>📊 Excel</Button>
      <Button variant="secondary" onClick={exportPDF}>📄 PDF</Button>
    </div>
  );
}
