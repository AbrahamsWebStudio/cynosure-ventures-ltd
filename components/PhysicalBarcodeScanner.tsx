'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Barcode, CheckCircle, AlertCircle, Keyboard } from 'lucide-react';

interface PhysicalBarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function PhysicalBarcodeScanner({ onScan, onClose, isOpen }: PhysicalBarcodeScannerProps) {
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const barcodeBuffer = useRef('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      // Focus on hidden input to capture barcode scanner input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setIsScanning(false);
      setScannedBarcode('');
      setLastScanned(null);
    }
  }, [isOpen]);

  const handleKeyPress = (event: KeyboardEvent) => {
    if (!isScanning) return;

    // Barcode scanners typically send characters rapidly
    // We need to buffer them and detect when scanning is complete
    if (event.key === 'Enter') {
      // End of barcode scan
      if (barcodeBuffer.current.length > 0) {
        const barcode = barcodeBuffer.current;
        setLastScanned(barcode);
        onScan(barcode);
        barcodeBuffer.current = '';
        
        // Auto-close after successful scan
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } else if (event.key.length === 1) {
      // Add character to buffer
      barcodeBuffer.current += event.key;
      
      // Clear buffer after a delay (in case of manual typing)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        barcodeBuffer.current = '';
      }, 100);
    }
  };

  const handleManualInput = () => {
    const manualBarcode = prompt('Enter barcode manually:');
    if (manualBarcode && manualBarcode.trim()) {
      setLastScanned(manualBarcode.trim());
      onScan(manualBarcode.trim());
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const simulateBarcodeScan = () => {
    const testBarcode = '1234567890123';
    setLastScanned(testBarcode);
    onScan(testBarcode);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keypress', handleKeyPress);
      return () => {
        document.removeEventListener('keypress', handleKeyPress);
      };
    }
  }, [isOpen, isScanning]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Physical Barcode Scanner</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Hidden input to capture barcode scanner input */}
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none"
          autoFocus
        />

        {/* Scanner Status */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Barcode className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">Scanner Ready</span>
          </div>
          <p className="text-blue-700 text-sm">
            Point your Syble barcode scanner at a product barcode and scan.
          </p>
        </div>

        {/* Last Scanned Display */}
        {lastScanned && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700 font-medium">Barcode Detected!</span>
            </div>
            <p className="text-green-600 font-mono text-sm mt-1">
              {lastScanned}
            </p>
          </div>
        )}

        {/* Manual Options */}
        <div className="space-y-3">
          <button
            onClick={handleManualInput}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
          >
            <Keyboard className="h-4 w-4" />
            <span>Enter Barcode Manually</span>
          </button>
          
          <button
            onClick={simulateBarcodeScan}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
          >
            Simulate Scan (Test)
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-xs text-gray-600 space-y-1">
          <p>• Connect your Syble barcode scanner via USB</p>
          <p>• Ensure scanner is in keyboard mode</p>
          <p>• Point scanner at product barcode</p>
          <p>• Press trigger to scan</p>
          <p>• Or use manual input option</p>
        </div>
      </div>
    </div>
  );
} 