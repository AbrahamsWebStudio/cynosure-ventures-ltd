"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Package, Scale } from "lucide-react";

interface Product {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  barcode: string;
  weight_kg: string;
  dimensions_cm: string;
  is_fragile: boolean;
  weight_class_id: string | null;
}

interface BarcodeData {
  code: string;
  format: string;
  timestamp: Date;
}

interface WeightClass {
  id: string;
  name: string;
  min_weight: number;
  max_weight: number;
  description: string;
}

export default function AddProductPage() {
  const supabase = createClientComponentClient();
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    barcode: '',
    weight_kg: '',
    dimensions_cm: '',
    is_fragile: false,
    weight_class_id: null,
  });
  const [weightClasses, setWeightClasses] = useState<WeightClass[]>([]);
  const [selectedWeightClass, setSelectedWeightClass] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [barcodeData, setBarcodeData] = useState<BarcodeData | null>(null);

  const fetchWeightClasses = async () => {
    const { data } = await supabase
      .from('weight_classes')
      .select('*')
      .order('min_weight');
    setWeightClasses(data || []);
  };

  useEffect(() => {
    fetchWeightClasses();
  }, []);

  const handleBarcodeScan = (barcode: string) => {
    setNewProduct({ ...newProduct, barcode });
    setBarcodeData({
      code: barcode,
      format: 'CODE128',
      timestamp: new Date(),
    });
  };

  const handleManualBarcodeInput = (value: string) => {
    setNewProduct({ ...newProduct, barcode: value });
  };

  const handleWeightChange = (weight: string) => {
    setNewProduct({ ...newProduct, weight_kg: weight });
    
    // Auto-select weight class based on weight
    const weightNum = parseFloat(weight);
    if (!isNaN(weightNum)) {
      const matchingClass = weightClasses.find(wc => 
        weightNum >= wc.min_weight && weightNum <= wc.max_weight
      );
      if (matchingClass) {
        setSelectedWeightClass(matchingClass.id);
        setNewProduct(prev => ({ ...prev, weight_class_id: matchingClass.id }));
      }
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          category: newProduct.category,
          barcode: newProduct.barcode,
          weight_kg: parseFloat(newProduct.weight_kg) || 0,
          dimensions_cm: newProduct.dimensions_cm,
          is_fragile: newProduct.is_fragile,
          weight_class_id: selectedWeightClass || null,
        });

      if (error) {
        console.error('Error adding product:', error);
        alert('Error adding product: ' + error.message);
      } else {
        alert('Product added successfully!');
        // Reset form
        setNewProduct({
          name: '',
          description: '',
          price: '',
          stock: '',
          category: '',
          barcode: '',
          weight_kg: '',
          dimensions_cm: '',
          is_fragile: false,
          weight_class_id: null,
        });
        setSelectedWeightClass('');
        setBarcodeData(null);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const simulateBarcodeScan = () => {
    const mockBarcode = '1234567890123';
    handleBarcodeScan(mockBarcode);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Add New Product</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Barcode Scanner Section */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Barcode Scanner
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Scan or enter barcode manually"
                    value={newProduct.barcode}
                    onChange={(e) => handleManualBarcodeInput(e.target.value)}
                  />
                  <Button onClick={simulateBarcodeScan} variant="outline">
                    Simulate Scan
                  </Button>
                </div>
              </div>
              
              {barcodeData && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Scanned:</strong> {barcodeData.code} ({barcodeData.format})
                  </p>
                  <p className="text-xs text-green-600">
                    {barcodeData.timestamp.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <Input
                placeholder="Enter product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
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

            {/* Weight and Dimensions Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Scale className="h-4 w-4" />
                Weight (kg) *
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newProduct.weight_kg}
                onChange={(e) => handleWeightChange(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Package className="h-4 w-4" />
                Dimensions (cm)
              </label>
              <Input
                placeholder="LxWxH (e.g., 30x20x10)"
                value={newProduct.dimensions_cm}
                onChange={(e) => setNewProduct({ ...newProduct, dimensions_cm: e.target.value })}
              />
            </div>

            {/* Weight Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight Class
              </label>
              <Select value={selectedWeightClass} onValueChange={setSelectedWeightClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select weight class" />
                </SelectTrigger>
                <SelectContent>
                  {weightClasses.map((wc) => (
                    <SelectItem key={wc.id} value={wc.id}>
                      {wc.name} ({wc.min_weight}-{wc.max_weight}kg)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fragile Handling */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Fragile Item</label>
                  <p className="text-xs text-gray-500">Requires special handling</p>
                </div>
              </div>
              <Switch
                checked={newProduct.is_fragile}
                onCheckedChange={(checked) => setNewProduct({ ...newProduct, is_fragile: checked })}
              />
            </div>
          </div>

          {/* Description and Special Handling */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Product description..."
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleAddProduct} 
              disabled={loading}
              className="px-8 py-2"
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}