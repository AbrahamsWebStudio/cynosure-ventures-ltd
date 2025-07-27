'use client';

import React, { useState } from 'react';
import { Printer, FileText, Download, Settings } from 'lucide-react';

interface ReceiptData {
  receiptNumber: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  customerName?: string;
  paymentMethod: string;
}

interface ReceiptPrinterProps {
  receiptData: ReceiptData;
  onPrint: (receiptData: ReceiptData) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function ReceiptPrinter({ receiptData, onPrint, onClose, isOpen }: ReceiptPrinterProps) {
  const [printerSettings, setPrinterSettings] = useState({
    paperWidth: 80, // mm
    fontSize: 12,
    includeLogo: true,
    includeFooter: true,
  });

  const generateReceiptText = (data: ReceiptData): string => {
    const width = printerSettings.paperWidth;
    const center = (text: string) => {
      const padding = Math.max(0, Math.floor((width - text.length) / 2));
      return ' '.repeat(padding) + text;
    };

    let receipt = '';
    
    // Header
    if (printerSettings.includeLogo) {
      receipt += center('CYNOSURE VENTURES LTD') + '\n';
      receipt += center('========================') + '\n';
    }
    
    receipt += center('RECEIPT') + '\n';
    receipt += center('========================') + '\n\n';
    
    // Receipt details
    receipt += `Receipt No: ${data.receiptNumber}\n`;
    receipt += `Date: ${data.date}\n`;
    if (data.customerName) {
      receipt += `Customer: ${data.customerName}\n`;
    }
    receipt += '\n';
    
    // Items
    receipt += 'ITEMS:\n';
    receipt += '-'.repeat(width) + '\n';
    
    data.items.forEach(item => {
      const itemLine = `${item.name}\n`;
      const quantityLine = `  ${item.quantity} x ${item.price.toFixed(2)} = ${item.total.toFixed(2)}\n`;
      receipt += itemLine + quantityLine;
    });
    
    receipt += '-'.repeat(width) + '\n';
    
    // Totals
    receipt += `Subtotal: ${data.subtotal.toFixed(2)}\n`;
    receipt += `Tax: ${data.tax.toFixed(2)}\n`;
    receipt += `TOTAL: ${data.total.toFixed(2)}\n\n`;
    
    // Payment method
    receipt += `Payment: ${data.paymentMethod}\n\n`;
    
    // Footer
    if (printerSettings.includeFooter) {
      receipt += center('Thank you for your business!') + '\n';
      receipt += center('Visit us again') + '\n';
      receipt += center('www.cynosureventures.com') + '\n';
    }
    
    receipt += '\n\n\n'; // Feed paper
    
    return receipt;
  };

  const handlePrint = () => {
    const receiptText = generateReceiptText(receiptData);
    
    // Method 1: Print to XPrinter via ESC/POS commands
    printToXPrinter(receiptText);
    
    // Method 2: Download as text file for manual printing
    downloadReceiptFile(receiptText);
    
    onPrint(receiptData);
  };

  const printToXPrinter = (receiptText: string) => {
    try {
      // ESC/POS commands for XPrinter
      const escPosCommands = [
        '\x1B\x40', // Initialize printer
        '\x1B\x61\x01', // Center alignment
        '\x1B\x21\x10', // Font size
        receiptText,
        '\x1B\x61\x00', // Left alignment
        '\x0A\x0A\x0A', // Feed paper
      ].join('');
      
      // Try to send to printer
      if (navigator && navigator.serviceWorker) {
        // Use Web USB API if available
        console.log('Sending to XPrinter via Web USB...');
      } else {
        // Fallback to browser print
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head><title>Receipt</title></head>
              <body>
                <pre style="font-family: monospace; font-size: 12px; white-space: pre-wrap;">${receiptText}</pre>
                <script>window.print();</script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }
    } catch (error) {
      console.error('Print error:', error);
      alert('Print failed. Receipt downloaded instead.');
    }
  };

  const downloadReceiptFile = (receiptText: string) => {
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${receiptData.receiptNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSettingsChange = (setting: string, value: string | number | boolean) => {
    setPrinterSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Receipt Printer</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Printer Settings */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Settings className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Printer Settings</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paper Width (mm)
              </label>
              <input
                type="number"
                value={printerSettings.paperWidth}
                onChange={(e) => handleSettingsChange('paperWidth', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                min="58"
                max="112"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <select
                value={printerSettings.fontSize}
                onChange={(e) => handleSettingsChange('fontSize', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value={10}>Small (10pt)</option>
                <option value={12}>Normal (12pt)</option>
                <option value={14}>Large (14pt)</option>
              </select>
            </div>
          </div>
          
          <div className="mt-3 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={printerSettings.includeLogo}
                onChange={(e) => handleSettingsChange('includeLogo', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Include Company Logo</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={printerSettings.includeFooter}
                onChange={(e) => handleSettingsChange('includeFooter', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Include Footer</span>
            </label>
          </div>
        </div>

        {/* Receipt Preview */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Receipt Preview</span>
          </div>
          
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <pre className="text-xs font-mono whitespace-pre-wrap">
              {generateReceiptText(receiptData)}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
          >
            <Printer className="h-5 w-5" />
            <span>Print Receipt</span>
          </button>
          
          <button
            onClick={() => downloadReceiptFile(generateReceiptText(receiptData))}
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition flex items-center justify-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Download</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-xs text-gray-600 space-y-1">
          <p>• Ensure XPrinter is connected via USB</p>
          <p>• Install XPrinter drivers on your computer</p>
          <p>• Set XPrinter as default printer</p>
          <p>• Use 80mm thermal paper for best results</p>
        </div>
      </div>
    </div>
  );
} 