"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("products")
        .select("id, title, description, price, image_url")
        .eq("id", id)
        .single();
      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 animate-pulse">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Product not found.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-lg text-blue-600 hover:text-white hover:underline transition flex items-center mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>


        <div className="flex flex-col md:flex-row items-center gap-8 min-h-[70vh]">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={product.image_url || "/placeholder.png"}
              alt={product.title}
              className="w-full max-w-md h-auto object-cover rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            />
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{product.title}</h1>
            <p className="text-gray-700 text-lg mb-4">{product.description}</p>
            <p className="text-3xl font-bold text-blue-600 mb-6">KES {product.price}</p>

            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() =>
                addToCart({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image_url: product.image_url,
                })
              }
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow hover:shadow-lg"
              >
                Add to Cart
              </button>
              <Link
                href="/checkout"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow hover:shadow-lg text-center"
              >
                Go to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
