'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Button } from '@/components/ui/button';
import exportToCSV from '@/lib/utils/exportToCSV';
import exportToExcel from '@/lib/utils/exportToExcel';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  category: string | null;
  stock: number | null;
  barcode: string | null;
  created_at: string;
  [key: string]: string | number | boolean | null | undefined;
}

export default function ProductsListPage() {
  const supabase = createClientComponentClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) console.error('Error fetching products:', error.message);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();

    // Realtime subscription
    const channel = supabase
      .channel('products_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleEditProduct = async (updatedProduct: Product) => {
    const { error } = await supabase
      .from('products')
      .update({
        title: updatedProduct.title,
        description: updatedProduct.description,
        price: updatedProduct.price ?? null,
        category: updatedProduct.category,
        stock: updatedProduct.stock ?? null,
      })
      .eq('id', updatedProduct.id);

    if (error) {
      alert('Error updating product: ' + error.message);
    } else {
      setEditingProduct(null);
      await fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
      // First check if product exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id, title')
        .eq('id', id)
        .single();

      if (!existingProduct) {
        alert('Product not found. It may have already been deleted.');
        await fetchProducts();
        return;
      }

      // Check if product has associated orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id')
        .eq('product_id', id)
        .limit(1);

      if (orders && orders.length > 0) {
        alert('Cannot delete product. It has associated orders. Please remove the orders first.');
        return;
      }

      // Delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        alert('Error deleting product: ' + error.message);
      } else {
        alert('Product deleted successfully!');
        await fetchProducts();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  return (
    <>
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Product List</h1>
        {/* Export Buttons */}
        <div className="flex space-x-4">
          <Button onClick={() => exportToCSV(products, 'products_export')}>Export CSV</Button>
          <Button onClick={() => exportToExcel(products, 'products_export')}>Export Excel</Button>
        </div>
        {/* Product List */}
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="space-y-2">
            {products.map((product) => (
              <div key={product.id} className="space-y-2">
                <div className="border rounded p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <div>
                    <h2 className="font-semibold">{product.title || 'Untitled'}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {product.category || 'Uncategorized'} | Stock: {product.stock ?? 'N/A'}
                    </p>
                    {product.barcode && (
                      <p className="text-xs text-gray-500 font-mono">
                        Barcode: {product.barcode}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">KES {product.price ?? 0}</p>
                    <p className="text-xs text-gray-500">{new Date(product.created_at).toLocaleDateString()}</p>
                    <div className="flex space-x-2 mt-2">
                      <Button size="sm" onClick={() => setEditingProduct(product)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                    </div>
                  </div>
                </div>
                {/* Edit Form */}
                {editingProduct?.id === product.id && (
                  <div className="bg-white dark:bg-gray-900 rounded p-4 shadow space-y-4">
                    <h2 className="font-semibold text-lg">Edit Product</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input placeholder="Title" value={editingProduct.title} onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })} />
                      <Input placeholder="Price" type="number" value={editingProduct.price?.toString() ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value === '' ? null : parseFloat(e.target.value) })} />
                      <Input placeholder="Category" value={editingProduct.category ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} />
                      <Input placeholder="Stock" type="number" value={editingProduct.stock?.toString() ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value === '' ? null : parseInt(e.target.value) })} />
                    </div>
                    <Input placeholder="Description (optional)" value={editingProduct.description ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
                    <div className="flex space-x-2">
                      <Button onClick={() => handleEditProduct(editingProduct)}>Save Changes</Button>
                      <Button variant="secondary" onClick={() => setEditingProduct(null)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}