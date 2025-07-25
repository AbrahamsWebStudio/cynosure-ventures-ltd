"use client";

import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
        <div className="text-xl font-bold text-blue-600">Quantum Leap Tech</div>
        <div className="hidden md:flex gap-4 items-center">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <Link href="/deliveries" className="hover:text-blue-600">Logistics</Link>
          <Link href="/rides" className="hover:text-blue-600">Rides</Link>
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <Link href="/login" className="hover:text-blue-600">Login/Register</Link>
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-20 bg-blue-50">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Powering Seamless Commerce and Transport in Africa</h1>
        <p className="text-gray-600 max-w-2xl mb-6">
          Quantum Leap Tech connects buyers, sellers, businesses, and travelers with reliable e-commerce, logistics, and transport services, backed by MPESA-powered eWallet for effortless transactions.
        </p>
        <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">Explore Marketplace</Link>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 px-6 py-12 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-2">E-commerce Marketplace</h2>
          <p className="text-gray-600 mb-4">Buy and sell products, feature your listings, and grow your business with ease while customers shop confidently.</p>
          <Link href="/products" className="text-blue-600 hover:underline">Start Selling</Link>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Logistics & Delivery</h2>
          <p className="text-gray-600 mb-4">Book deliveries, moving services, and integrate your store for seamless product shipping anywhere in Kenya.</p>
          <Link href="/deliveries" className="text-blue-600 hover:underline">Book Delivery</Link>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Passenger Transport</h2>
          <p className="text-gray-600 mb-4">Book rides, tours, and chauffeur services with premium vehicle options for a smooth, safe experience.</p>
          <Link href="/rides" className="text-blue-600 hover:underline">Book a Ride</Link>
        </div>
      </section>

      {/* eWallet Section */}
      <section className="bg-blue-50 py-12 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Integrated eWallet with MPESA</h2>
        <p className="text-gray-700 max-w-xl mx-auto mb-6">Deposit funds easily using MPESA and use your Quantum Leap Tech eWallet to pay for products and services across the platform, making transactions seamless and secure for everyone.</p>
        <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">Access Your Wallet</Link>
      </section>

      {/* Testimonials Placeholder */}
      <section className="py-12 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">What Our Users Say</h2>
        <p className="text-gray-600 mb-6">Real stories from businesses and travelers who use Quantum Leap Tech to simplify their logistics, commerce, and transport needs.</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-4 rounded shadow">Testimonial 1 Placeholder</div>
          <div className="bg-white p-4 rounded shadow">Testimonial 2 Placeholder</div>
          <div className="bg-white p-4 rounded shadow">Testimonial 3 Placeholder</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white shadow mt-auto p-6 text-center text-gray-600">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
          <p>&copy; {new Date().getFullYear()} Quantum Leap Tech. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <Link href="/deliveries" className="hover:text-blue-600">Logistics</Link>
            <Link href="/rides" className="hover:text-blue-600">Rides</Link>
            <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
