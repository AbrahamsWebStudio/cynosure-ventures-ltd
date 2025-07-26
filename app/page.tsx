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
              From shopping to shipping, transport to payments - we've got you covered with integrated services.
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
      <section
        className="bg-blue-50 py-12 px-6 flex justify-center transition-transform duration-500 hover:-translate-y-1 hover:scale-105"
      >
        <div
          className="bg-white rounded-lg shadow-xl p-8 w-full max-w-6xl text-center
                    transform transition-transform transition-shadow duration-300 ease-in-out
                    hover:shadow-2xl hover:-translate-y-1"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-800">
            Integrated eWallet with MPESA
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Deposit funds easily using MPESA and use your Cynosure Ventures LTD eWallet to pay for products and services across the platform, making transactions seamless and secure for everyone.
          </p>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded border border-transparent 
                      hover:bg-white hover:text-blue-600 hover:border-blue-600 transition"
          >
            Access Your Wallet
          </Link>
        </div>
      </section>

     {/* Testimonials Section */}
    <section
      className="py-12 px-6 text-center bg-gray-50 transition-transform duration-500 hover:-translate-y-1 hover:scale-105"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-800">
        What Our Users Say
      </h2>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Real stories from businesses and travelers who use Cynosure Ventures LTD to simplify their logistics, commerce, and transport needs.
      </p>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {/* Testimonial Card */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col items-center text-center">
          <img 
            src="/user1.jpg" 
            alt="User 1" 
            className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-blue-600"
          />
          <p className="text-gray-700 italic relative">
            <span className="text-4xl text-blue-600 absolute -left-6 -top-4">“</span>
            Cynosure Ventures LTD has transformed how we manage our deliveries and product sales. Super seamless and reliable!
          </p>
          <h3 className="mt-4 font-semibold text-blue-800">Jane Mwangi</h3>
          <p className="text-gray-500 text-sm">Nairobi Business Owner</p>
        </div>

        {/* Testimonial Card */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col items-center text-center">
          <img 
            src="/user2.jpg" 
            alt="User 2" 
            className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-blue-600"
          />
          <p className="text-gray-700 italic relative">
            <span className="text-4xl text-blue-600 absolute -left-6 -top-4">“</span>
            Booking rides and moving goods has never been easier. Highly recommend Cynosure Ventures LTD for any entrepreneur.
          </p>
          <h3 className="mt-4 font-semibold text-blue-800">David Otieno</h3>
          <p className="text-gray-500 text-sm">Eldoret Retailer</p>
        </div>

        {/* Testimonial Card */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col items-center text-center">
          <img 
            src="/user3.jpg" 
            alt="User 3" 
            className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-blue-600"
          />
          <p className="text-gray-700 italic relative">
            <span className="text-4xl text-blue-600 absolute -left-6 -top-4">“</span>
            A game-changer for my tours and transport needs, all while managing payments with the eWallet efficiently.
          </p>
          <h3 className="mt-4 font-semibold text-blue-800">Fatma Hassan</h3>
          <p className="text-gray-500 text-sm">Mombasa Tour Operator</p>
        </div>

      </div>
    </section>


      {/* Footer */}
      <footer className="bg-white shadow mt-auto p-6 text-center text-gray-600">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
          <p>&copy; {new Date().getFullYear()} Cynosure Ventures LTD. All rights reserved.</p>
          
          <div className="flex gap-2 mt-2 md:mt-0 text-blue-600">
            <Link href="/" className="hover:text-black transition">Home</Link>
            <span>|</span>
            <Link href="/products" className="hover:text-black transition">Products</Link>
            <span>|</span>
            <Link href="/deliveries" className="hover:text-black transition">Logistics</Link>
            <span>|</span>
            <Link href="/rides" className="hover:text-black transition">Rides</Link>
            <span>|</span>
            <Link href="/dashboard" className="hover:text-black transition">Dashboard</Link>
          </div>
        </div>

        {/* Social & Contact Icons */}
        <div className="flex justify-center gap-6 mt-4 text-blue-600">
          {/* Facebook */}
          <a href="#" aria-label="Facebook" className="hover:text-black transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22,12A10,10,0,1,0,12,22V14.5H9.5v-3H12V9.75A2.75,2.75,0,0,1,14.75,7h2v3H14.75V11.5H16.5l-.5,3H14.75V22A10,10,0,0,0,22,12Z"/>
            </svg>
          </a>

          {/* Phone */}
          <a href="tel:+254700000000" aria-label="Phone" className="hover:text-black transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62,10.79a15.07,15.07,0,0,0,6.59,6.59l2.2-2.2a1,1,0,0,1,1-.24,11.72,11.72,0,0,0,3.69.59,1,1,0,0,1,1,1V20a1,1,0,0,1-1,1A16,16,0,0,1,3,5a1,1,0,0,1,1-1H6.5a1,1,0,0,1,1,1,11.72,11.72,0,0,0,.59,3.69,1,1,0,0,1-.24,1Z"/>
            </svg>
          </a>

          {/* Email */}
          <a href="mailto:info@cynosureventures.com" aria-label="Email" className="hover:text-black transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20,4H4A2,2,0,0,0,2,6V18a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V6A2,2,0,0,0,20,4Zm0,4-8,5L4,8V6l8,5,8-5Z"/>
            </svg>
          </a>
        </div>
      </footer>

    </div>
  );
}
