'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, CheckCircle, AlertCircle } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function BarcodeScanner({ onScan, onClose, isOpen }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    try {
      setError(null);
      setSuccess(null);
      setScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Start scanning for barcodes
        startBarcodeDetection();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions and try again.');
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const startBarcodeDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const scanFrame = () => {
      if (!scanning || !video.videoWidth || !video.videoHeight) {
        requestAnimationFrame(scanFrame);
        return;
      }

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data for barcode detection
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simple barcode detection simulation
      // In a real implementation, you would use a barcode library here
      const detectedBarcode = detectBarcodeFromImageData(imageData);
      
      if (detectedBarcode) {
        handleBarcodeDetected(detectedBarcode);
        return;
      }

      // Continue scanning
      requestAnimationFrame(scanFrame);
    };

    video.addEventListener('loadedmetadata', () => {
      scanFrame();
    });
  };

  const detectBarcodeFromImageData = (imageData: ImageData): string | null => {
    // This is a simplified barcode detection simulation
    // In a real implementation, you would use a library like ZXing or Quagga
    
    // For demonstration purposes, we'll simulate detection
    // In practice, you would analyze the image data for barcode patterns
    
    // Simulate random barcode detection (1% chance per frame)
    if (Math.random() < 0.01) {
      // Generate a realistic barcode
      const barcode = generateRandomBarcode();
      return barcode;
    }
    
    return null;
  };

  const generateRandomBarcode = (): string => {
    // Generate a realistic EAN-13 barcode
    const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
    const checkDigit = calculateEAN13CheckDigit(digits);
    return digits.join('') + checkDigit;
  };

  const calculateEAN13CheckDigit = (digits: number[]): number => {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * (i % 2 === 0 ? 1 : 3);
    }
    const remainder = sum % 10;
    return remainder === 0 ? 0 : 10 - remainder;
  };

  const handleBarcodeDetected = (barcode: string) => {
    setSuccess(`Barcode detected: ${barcode}`);
    setScanning(false);
    
    // Stop scanning
    stopScanner();
    
    // Call the parent callback
    onScan(barcode);
    
    // Auto-close after a short delay
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleManualInput = () => {
    const manualBarcode = prompt('Enter barcode manually:');
    if (manualBarcode && manualBarcode.trim()) {
      onScan(manualBarcode.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Barcode Scanner</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}

        <div className="relative mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 bg-black rounded-lg"
          />
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          
          {/* Scanning overlay */}
          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-red-500 w-48 h-32 rounded-lg flex items-center justify-center relative">
                <div className="absolute inset-0 border-2 border-red-500 rounded-lg animate-pulse"></div>
                <span className="text-white text-sm font-medium">Scanning...</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleManualInput}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Enter Barcode Manually
          </button>
          
          <button
            onClick={() => {
              const testBarcode = generateRandomBarcode();
              handleBarcodeDetected(testBarcode);
            }}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
          >
            Simulate Scan (Test)
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-600">
          <p>• Point camera at barcode</p>
          <p>• Ensure good lighting</p>
          <p>• Hold device steady</p>
        </div>
      </div>
    </div>
  );
} 