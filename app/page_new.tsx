"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Package, Truck, Car, CreditCard, ShoppingCart, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-900 tracking-tight">
            Powering Seamless Commerce and Transport in Africa
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            Cynosure Ventures LTD connects buyers, sellers, businesses, and travelers with reliable e-commerce, logistics, and transport services, backed by MPESA-powered eWallet for effortless transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              Explore Marketplace
            </Link>
            <Link
              href="/rides/psv"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              <Car className="h-5 w-5" />
              Book Transport
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From shopping to shipping, transport to payments - we&apos;ve got you covered with integrated services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Marketplace Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6 mx-auto">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">E-commerce Marketplace</h3>
              <p className="text-gray-700 mb-6 text-center leading-relaxed">
                Buy and sell products with confidence. Feature your listings and grow your business with our integrated marketplace.
              </p>
              <div className="text-center">
                <Link 
                  href="/products" 
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition"
                >
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Logistics Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6 mx-auto">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Logistics & Delivery</h3>
              <p className="text-gray-700 mb-6 text-center leading-relaxed">
                Book deliveries, moving services, and integrate your store for seamless shipping anywhere in Kenya.
              </p>
              <div className="text-center">
                <Link 
                  href="/deliveries" 
                  className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition"
                >
                  Book Delivery
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Transport Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6 mx-auto">
                <Car className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Passenger Transport</h3>
              <p className="text-gray-700 mb-6 text-center leading-relaxed">
                Book rides, tours, and chauffeur services with premium vehicle options for a smooth, safe experience.
              </p>
              <div className="text-center">
                <Link 
                  href="/rides/psv" 
                  className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition"
                >
                  Book Transport
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* eWallet Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-8 mx-auto">
            <CreditCard className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">
            Integrated eWallet with MPESA
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Deposit funds easily using MPESA and use your Cynosure Ventures LTD eWallet to pay for products and services across the platform, making transactions seamless and secure for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <CreditCard className="h-5 w-5" />
              Access My Wallet
            </Link>
            <Link
              href="/login"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-lg text-gray-600">
              Get started with our most popular services
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/products" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                <Package className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Browse Products</h3>
                <p className="text-sm text-gray-600">Shop from our marketplace</p>
              </div>
            </Link>
            
            <Link href="/rides/psv" className="group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                <Car className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Book Transport</h3>
                <p className="text-sm text-gray-600">PSV, Executive & more</p>
              </div>
            </Link>
            
            <Link href="/deliveries" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                <Truck className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Logistics</h3>
                <p className="text-sm text-gray-600">Delivery & moving services</p>
              </div>
            </Link>
            
            <Link href="/dashboard" className="group">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                <CreditCard className="h-8 w-8 text-orange-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">My Wallet</h3>
                <p className="text-sm text-gray-600">Manage payments & balance</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 