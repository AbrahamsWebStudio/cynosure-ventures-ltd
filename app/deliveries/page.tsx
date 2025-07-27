// ✅ /app/deliveries/page.tsx

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Package, Truck, Scale, AlertTriangle, Calculator, MapPin, Clock, Shield } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface WeightClass {
  id: string;
  name: string;
  min_weight: number;
  max_weight: number;
  base_price: number;
  price_per_km: number;
  tax_rate: number;
  fragile_surcharge: number;
  description: string;
}

interface Product {
  id: string;
  title: string;
  weight_kg: number;
  is_fragile: boolean;
  weight_class_id: string;
}

interface PricingBreakdown {
  weight_class_name: string;
  base_price: number;
  distance_cost: number;
  subtotal: number;
  tax_amount: number;
  fragile_surcharge: number;
  total_amount: number;
}

export default function DeliveriesPage() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [distance, setDistance] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [weightClasses, setWeightClasses] = useState<WeightClass[]>([]);
  const [pricingBreakdown, setPricingBreakdown] = useState<PricingBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    fetchWeightClasses();
    fetchProducts();
  }, []);

  const fetchWeightClasses = async () => {
    const { data, error } = await supabase
      .from('weight_classes')
      .select('*')
      .order('min_weight');

    if (error) {
      console.error('Error fetching weight classes:', error);
    } else {
      setWeightClasses(data || []);
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, title, weight_kg, is_fragile, weight_class_id')
      .not('weight_kg', 'is', null)
      .order('title');

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setAvailableProducts(data || []);
    }
  };

  const calculatePricing = async () => {
    if (!pickup || !dropoff || !distance || selectedProducts.length === 0) {
      setPricingBreakdown(null);
      return;
    }

    const distanceKm = parseFloat(distance);
    const totalWeight = selectedProducts.reduce((sum, product) => sum + product.weight_kg, 0);
    const hasFragileItems = selectedProducts.some(product => product.is_fragile);

    try {
      const { data, error } = await supabase
        .rpc('calculate_logistics_price', {
          p_distance_km: distanceKm,
          p_weight_kg: totalWeight,
          p_has_fragile_items: hasFragileItems
        });

      if (error) {
        console.error('Error calculating pricing:', error);
        setMessage('Error calculating pricing. Please try again.');
      } else if (data && data.length > 0) {
        setPricingBreakdown(data[0]);
        setMessage("");
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error calculating pricing. Please try again.');
    }
  };

  useEffect(() => {
    calculatePricing();
  }, [pickup, dropoff, distance, selectedProducts]);

  const addProduct = (product: Product) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handleBooking = async () => {
    if (!pickup || !dropoff || !distance || selectedProducts.length === 0 || !pricingBreakdown) {
      setMessage("Please fill in all required fields and select at least one product.");
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setMessage("You must be logged in to book a delivery.");
      setLoading(false);
      return;
    }

    try {
      // Create logistics order
      const { data: orderData, error: orderError } = await supabase
        .from('logistics_orders')
        .insert({
          user_id: user.id,
          pickup_location: pickup,
          dropoff_location: dropoff,
          distance_km: parseFloat(distance),
          weight_class_id: weightClasses.find(wc => wc.name === pricingBreakdown.weight_class_name)?.id,
          total_weight_kg: selectedProducts.reduce((sum, product) => sum + product.weight_kg, 0),
          subtotal_amount: pricingBreakdown.subtotal,
          tax_amount: pricingBreakdown.tax_amount,
          fragile_surcharge: pricingBreakdown.fragile_surcharge,
          total_amount: pricingBreakdown.total_amount,
          status: 'pending',
          tracking_number: `CVL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          special_instructions: specialInstructions,
          estimated_delivery_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create logistics order items
      const orderItems = selectedProducts.map(product => ({
        logistics_order_id: orderData.id,
        product_id: product.id,
        product_name: product.title,
        quantity: 1,
        weight_kg: product.weight_kg,
        is_fragile: product.is_fragile,
        unit_price: pricingBreakdown.subtotal / selectedProducts.length,
        total_price: pricingBreakdown.subtotal / selectedProducts.length
      }));

      const { error: itemsError } = await supabase
        .from('logistics_order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      setMessage(`✅ Delivery booked successfully! Tracking Number: ${orderData.tracking_number}`);
      setPickup("");
      setDropoff("");
      setDistance("");
      setSelectedProducts([]);
      setPricingBreakdown(null);
      setSpecialInstructions("");
    } catch (error) {
      console.error('Booking error:', error);
      setMessage("Booking failed. Please try again.");
    }

    setLoading(false);
  };

  const getWeightClassForWeight = (weight: number) => {
    return weightClasses.find(wc => weight >= wc.min_weight && weight <= wc.max_weight);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Logistics & Delivery</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional delivery services with weight-based pricing, tax calculations, and special handling for fragile items.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Truck className="h-6 w-6 text-blue-600" />
                  Book Your Delivery
                </h2>

                {/* Location Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Location *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter pickup address"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dropoff Location *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter dropoff address"
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Distance */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance (KM) *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter distance in kilometers"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Product Selection */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Products to Deliver *
                    </label>
                    <button
                      onClick={() => setShowProductSelector(!showProductSelector)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {showProductSelector ? 'Hide Products' : 'Add Products'}
                    </button>
                  </div>

                  {showProductSelector && (
                    <div className="border border-gray-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium mb-3">Available Products</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                        {availableProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-sm">{product.title}</div>
                              <div className="text-xs text-gray-500">
                                {product.weight_kg}kg • {product.is_fragile ? 'Fragile' : 'Standard'}
                              </div>
                            </div>
                            <button
                              onClick={() => addProduct(product)}
                              className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected Products */}
                  {selectedProducts.length > 0 && (
                    <div className="space-y-2">
                      {selectedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Package className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="font-medium text-sm">{product.title}</div>
                              <div className="text-xs text-gray-500">
                                {product.weight_kg}kg • {product.is_fragile ? 'Fragile' : 'Standard'}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Special Instructions */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    placeholder="Any special handling instructions..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Booking Button */}
                <button
                  onClick={handleBooking}
                  disabled={loading || !pickup || !dropoff || !distance || selectedProducts.length === 0}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Processing..." : "Book Delivery"}
                </button>

                {message && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${
                    message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {message}
                  </div>
                )}
              </div>
            </div>

            {/* Pricing & Weight Classes */}
            <div className="space-y-6">
              {/* Pricing Breakdown */}
              {pricingBreakdown && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Pricing Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight Class:</span>
                      <span className="font-medium">{pricingBreakdown.weight_class_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price:</span>
                      <span>KES {pricingBreakdown.base_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance Cost:</span>
                      <span>KES {pricingBreakdown.distance_cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">KES {pricingBreakdown.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (16% VAT):</span>
                      <span>KES {pricingBreakdown.tax_amount.toFixed(2)}</span>
                    </div>
                    {pricingBreakdown.fragile_surcharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fragile Surcharge:</span>
                        <span className="text-orange-600">KES {pricingBreakdown.fragile_surcharge.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">KES {pricingBreakdown.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weight Classes Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-purple-600" />
                  Weight Classes
                </h3>
                <div className="space-y-3">
                  {weightClasses.map((wc) => (
                    <div key={wc.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">{wc.name}</span>
                        <span className="text-xs text-gray-500">
                          {wc.min_weight}-{wc.max_weight}kg
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Base: KES {wc.base_price}</div>
                        <div>Per KM: KES {wc.price_per_km}</div>
                        <div>Tax: {wc.tax_rate}% VAT</div>
                        <div>Fragile: KES {wc.fragile_surcharge}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Service Features
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Real-time tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Insurance coverage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Fragile item handling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Same-day delivery available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Professional packaging</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
