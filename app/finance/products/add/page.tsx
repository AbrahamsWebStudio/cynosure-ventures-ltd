'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera, Barcode, Type, Package, Printer } from 'lucide-react';
import PhysicalBarcodeScanner from '@/components/PhysicalBarcodeScanner';
import ReceiptPrinter from '@/components/ReceiptPrinter';

interface BarcodeData {
  code: string;
  format: string;
  timestamp: Date;
}

export default function AddProductPage() {
  const supabase = createClientComponentClient();
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    barcode: '',
  });
  const [adding, setAdding] = useState(false);
  const [inputMode, setInputMode] = useState<'manual' | 'barcode'>('manual');
  const [scannedBarcodes, setScannedBarcodes] = useState<BarcodeData[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showReceiptPrinter, setShowReceiptPrinter] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const handleBarcodeScan = (barcode: string) => {
    const barcodeData: BarcodeData = {
      code: barcode,
      format: 'EAN-13',
      timestamp: new Date()
    };
    
    setScannedBarcodes(prev => [...prev, barcodeData]);
    setNewProduct(prev => ({ ...prev, barcode: barcode }));
    setShowScanner(false);
  };

  const handleManualBarcodeInput = (value: string) => {
    setNewProduct(prev => ({ ...prev, barcode: value }));
  };

  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.price || !newProduct.category || !newProduct.stock) {
      alert('Please fill in all required fields.');
      return;
    }
    setAdding(true);

    const priceParsed = parseFloat(newProduct.price);
    const stockParsed = parseInt(newProduct.stock);

    if (isNaN(priceParsed) || isNaN(stockParsed)) {
      alert('Price and Stock must be valid numbers.');
      setAdding(false);
      return;
    }

    const { error } = await supabase.from('products').insert([{
      title: newProduct.title,
      description: newProduct.description || null,
      price: priceParsed,
      category: newProduct.category,
      stock: stockParsed,
      barcode: newProduct.barcode || null,
    }]);

    if (error) {
      alert('Error adding product: ' + error.message);
    } else {
      setNewProduct({ title: '', description: '', price: '', category: '', stock: '', barcode: '' });
      setScannedBarcodes([]);
      alert('Product added successfully!');
    }

    setAdding(false);
  };

  const simulateBarcodeScan = () => {
    // Generate a random barcode for demonstration
    const barcode = '1234567890123';
    handleBarcodeScan(barcode);
  };

  return (
    <>
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Product</h1>
          <p className="text-gray-600">Add new products to your inventory with barcode scanning support</p>
        </div>

        {/* Input Mode Toggle */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={() => setInputMode('manual')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                inputMode === 'manual' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Type className="h-5 w-5" />
              <span>Manual Input</span>
            </button>
            <button
              onClick={() => setInputMode('barcode')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                inputMode === 'barcode' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Barcode className="h-5 w-5" />
              <span>Barcode Scanner</span>
            </button>
          </div>

          {/* Barcode Scanner Section */}
          {inputMode === 'barcode' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Syble Barcode Scanner</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Use your Syble USB barcode scanner to scan product barcodes or manually enter the barcode number.
                </p>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowScanner(true)}
                    className="flex items-center space-x-2"
                  >
                    <Barcode className="h-4 w-4" />
                    <span>Start Scanner</span>
                  </Button>
                  
                  <Button
                    onClick={simulateBarcodeScan}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Package className="h-4 w-4" />
                    <span>Simulate Scan</span>
                  </Button>
                </div>
              </div>

              {/* Manual Barcode Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode Number
                </label>
                <Input
                  placeholder="Enter barcode manually or scan above"
                  value={newProduct.barcode}
                  onChange={(e) => handleManualBarcodeInput(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Scanned Barcodes History */}
              {scannedBarcodes.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Recent Scans</h4>
                  <div className="space-y-2">
                    {scannedBarcodes.slice(-3).map((scan, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="font-mono">{scan.code}</span>
                        <span className="text-gray-500">
                          {scan.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title *
              </label>
              <Input
                placeholder="Enter product title"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <Input
                placeholder="e.g., Electronics, Clothing, Food"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (KES) *
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <Input
                type="number"
                placeholder="0"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              placeholder="Enter product description..."
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <Button 
            onClick={handleAddProduct} 
            disabled={adding || !newProduct.title || !newProduct.price || !newProduct.category || !newProduct.stock}
            className="w-full"
          >
            {adding ? 'Adding Product...' : 'Add Product'}
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to Use Syble Barcode Scanner</h3>
          <ol className="text-blue-700 text-sm space-y-1">
            <li>1. Connect Syble scanner via USB to your computer</li>
            <li>2. Click "Barcode Scanner" mode above</li>
            <li>3. Click "Start Scanner" to activate scanner</li>
            <li>4. Point scanner at product barcode and press trigger</li>
            <li>5. Or use "Simulate Scan" for testing</li>
            <li>6. Fill in remaining product details</li>
            <li>7. Click "Add Product" to save</li>
          </ol>
        </div>
      </main>

      {/* Physical Barcode Scanner Modal */}
      <PhysicalBarcodeScanner
        isOpen={showScanner}
        onScan={handleBarcodeScan}
        onClose={() => setShowScanner(false)}
      />

      {/* Receipt Printer Modal */}
      {showReceiptPrinter && receiptData && (
        <ReceiptPrinter
          isOpen={showReceiptPrinter}
          receiptData={receiptData}
          onPrint={(data) => {
            console.log('Receipt printed:', data);
            setShowReceiptPrinter(false);
          }}
          onClose={() => setShowReceiptPrinter(false)}
        />
      )}
    </>
  );
}