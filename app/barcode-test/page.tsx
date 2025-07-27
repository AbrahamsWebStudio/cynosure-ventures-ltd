'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Barcode, CheckCircle, AlertCircle, Keyboard } from 'lucide-react';

export default function BarcodeTestPage() {
  const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const barcodeBuffer = useRef('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsScanning(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyPress = (event: KeyboardEvent) => {
    if (!isScanning) return;

    console.log('Key pressed:', event.key, 'KeyCode:', event.keyCode);

    if (event.key === 'Enter') {
      // End of barcode scan
      if (barcodeBuffer.current.length > 0) {
        const barcode = barcodeBuffer.current;
        console.log('Barcode scanned:', barcode);
        setLastScanned(barcode);
        setScannedBarcodes(prev => [...prev, barcode]);
        barcodeBuffer.current = '';
      }
    } else if (event.key.length === 1) {
      // Add character to buffer
      barcodeBuffer.current += event.key;
      console.log('Buffer updated:', barcodeBuffer.current);
      
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
      const barcode = manualBarcode.trim();
      setLastScanned(barcode);
      setScannedBarcodes(prev => [...prev, barcode]);
    }
  };

  const simulateBarcodeScan = () => {
    const testBarcode = '1234567890123';
    setLastScanned(testBarcode);
    setScannedBarcodes(prev => [...prev, testBarcode]);
  };

  const clearHistory = () => {
    setScannedBarcodes([]);
    setLastScanned(null);
  };

  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [isScanning]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Barcode Scanner Test</h1>
            <p className="text-gray-600">Test your Syble barcode scanner functionality</p>
          </div>

          {/* Hidden input to capture barcode scanner input */}
          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 pointer-events-none"
            autoFocus
          />

          {/* Scanner Status */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Barcode className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Scanner Status</span>
            </div>
            <p className="text-blue-700 text-sm">
              {isScanning ? '✅ Scanner is active and listening for input' : '❌ Scanner is not active'}
            </p>
            <p className="text-blue-700 text-sm mt-1">
              Point your Syble barcode scanner at a product barcode and scan.
            </p>
          </div>

          {/* Last Scanned Display */}
          {lastScanned && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-700 font-medium">Barcode Detected!</span>
              </div>
              <p className="text-green-600 font-mono text-lg">
                {lastScanned}
              </p>
              <p className="text-green-600 text-sm mt-1">
                Length: {lastScanned.length} characters
              </p>
            </div>
          )}

          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={handleManualInput}
              className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
            >
              <Keyboard className="h-4 w-4" />
              <span>Manual Input</span>
            </button>
            
            <button
              onClick={simulateBarcodeScan}
              className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition"
            >
              Simulate Scan
            </button>

            <button
              onClick={clearHistory}
              className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition"
            >
              Clear History
            </button>
          </div>

          {/* Scan History */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Scan History</h3>
            {scannedBarcodes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No barcodes scanned yet</p>
            ) : (
              <div className="space-y-2">
                {scannedBarcodes.map((barcode, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm">{barcode}</span>
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Testing Instructions</h3>
            <ol className="text-yellow-700 text-sm space-y-1">
              <li>1. Connect your Syble barcode scanner via USB</li>
              <li>2. Click anywhere on this page to ensure focus</li>
              <li>3. Point scanner at any product barcode</li>
              <li>4. Press the scanner trigger button</li>
              <li>5. The barcode should appear in &quot;Last Scanned&quot; above</li>
              <li>6. If it doesn&apos;t work, try the &quot;Manual Input&quot; button</li>
              <li>7. Check the browser console for debugging info</li>
            </ol>
          </div>

          {/* Troubleshooting */}
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">Troubleshooting</h3>
            <ul className="text-red-700 text-sm space-y-1">
              <li>• If scanner doesn't work, check USB connection</li>
              <li>• Try different USB ports</li>
              <li>• Ensure scanner is in keyboard mode (not USB HID)</li>
              <li>• Test scanner in Notepad first</li>
              <li>• Check browser console for error messages</li>
              <li>• Try refreshing the page if scanner stops responding</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 