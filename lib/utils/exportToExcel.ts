import * as XLSX from 'xlsx';

interface ExportData {
  [key: string]: string | number | boolean | null | undefined;
}

export default function exportToExcel(data: ExportData[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
