// @ts-expect-error - json2csv types not available
import { parse } from 'json2csv';

interface ExportData {
  [key: string]: string | number | boolean | null | undefined;
}

export default function exportToCSV(data: ExportData[], filename: string) {
  const csv = parse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
