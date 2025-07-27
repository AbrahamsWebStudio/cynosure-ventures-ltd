"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, ShoppingCart, User, Home, Package, Truck, Car, CreditCard, Briefcase } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const cart = useCartStore((state) => state.cart);
  const [ridesDropdownOpen, setRidesDropdownOpen] = useState(false);
  const [investorsDropdownOpen, setInvestorsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const investorsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRidesDropdownOpen(false);
      }
      if (investorsDropdownRef.current && !investorsDropdownRef.current.contains(event.target as Node)) {
        setInvestorsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-[100] relative">
      {/* Brand and Hamburger */}
      <div className="flex items-center gap-4">
        {/* Hamburger - Mobile only */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="focus:outline-none cursor-pointer">
              <Menu className="h-6 w-6 text-blue-600" />
            </SheetTrigger>
            <SheetContent side="left" className="p-6 w-80">
              <div className="flex flex-col gap-6 mt-8">
                {/* Mobile Navigation */}
                <div className="space-y-4">
                  <Link href="/" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-50">
                    <Home className="h-5 w-5" />
                    <span className="font-medium">Home</span>
                  </Link>
                  
                  <Link href="/products" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-50">
                    <Package className="h-5 w-5" />
                    <span className="font-medium">Marketplace</span>
                  </Link>
                  
                  <Link href="/deliveries" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-50">
                    <Truck className="h-5 w-5" />
                    <span className="font-medium">Logistics</span>
                  </Link>
                  
                  {/* Mobile Rides Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-700 font-medium p-2">
                      <Car className="h-5 w-5" />
                      <span>Transport Services</span>
                    </div>
                    <div className="ml-8 space-y-2">
                      <Link href="/rides" className="block text-gray-600 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-50">
                        🚗 Book a Ride
                      </Link>
                    </div>
                  </div>
                  
                  {/* Mobile Investors Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-700 font-medium p-2">
                      <Briefcase className="h-5 w-5" />
                      <span>Investors</span>
                    </div>
                    <div className="ml-8 space-y-2">
                      <Link href="/investors/angel" className="block text-gray-600 hover:text-purple-600 transition p-2 rounded-lg hover:bg-gray-50">
                        👼 Angel Investors
                      </Link>
                      <Link href="/investors/venture-capital" className="block text-gray-600 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-50">
                        💼 Venture Capitalists
                      </Link>
                      <Link href="/investors/institutional" className="block text-gray-600 hover:text-green-600 transition p-2 rounded-lg hover:bg-gray-50">
                        🏢 Institutional Investors
                      </Link>
                      <div className="border-t my-2"></div>
                      <Link href="/investors/contact" className="block text-gray-600 hover:text-blue-700 transition p-2 rounded-lg hover:bg-gray-50">
                        📞 Contact Finance Team
                      </Link>
                    </div>
                  </div>
                  
                  <Link href="/dashboard" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-50">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">My Wallet</span>
                  </Link>
                  
                  <Link href="/login" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-50">
                    <User className="h-5 w-5" />
                    <span className="font-medium">Login/Register</span>
                  </Link>
                </div>
                
                {/* Mobile Cart */}
                <div className="border-t pt-4">
                  <Link href="/checkout" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-50">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="font-medium">Cart ({cart.length})</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Brand Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer">
          CYNOSURE VENTURES LTD
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-gray-700 hover:text-blue-600 transition font-medium cursor-pointer">Home</Link>
        <Link href="/products" className="text-gray-700 hover:text-blue-600 transition font-medium cursor-pointer">Marketplace</Link>
        <Link href="/deliveries" className="text-gray-700 hover:text-blue-600 transition font-medium cursor-pointer">Logistics</Link>
        
        {/* Desktop Rides Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setRidesDropdownOpen(!ridesDropdownOpen)}
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition font-medium cursor-pointer"
          >
            <Car className="h-4 w-4" />
            Transport
            <ChevronDown className={`h-4 w-4 transition-transform ${ridesDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {ridesDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-[200]">
              <div className="p-2">
                <Link 
                  href="/rides" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition rounded-lg cursor-pointer"
                  onClick={() => setRidesDropdownOpen(false)}
                >
                  <span className="text-xl">🚗</span>
                  <div>
                    <div className="font-medium">Book a Ride</div>
                    <div className="text-xs text-gray-500">All vehicle types</div>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Desktop Investors Dropdown */}
        <div className="relative" ref={investorsDropdownRef}>
          <button
            onClick={() => setInvestorsDropdownOpen(!investorsDropdownOpen)}
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition font-medium cursor-pointer"
          >
            <Briefcase className="h-4 w-4" />
            Investors
            <ChevronDown className={`h-4 w-4 transition-transform ${investorsDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {investorsDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-[200]">
              <div className="p-2">
                <Link 
                  href="/investors/angel" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-purple-600 transition rounded-lg cursor-pointer"
                  onClick={() => setInvestorsDropdownOpen(false)}
                >
                  <span className="text-xl">👼</span>
                  <div>
                    <div className="font-medium">Angel Investors</div>
                    <div className="text-xs text-gray-500">Early-stage capital & mentorship</div>
                  </div>
                </Link>
                <Link 
                  href="/investors/venture-capital" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition rounded-lg cursor-pointer"
                  onClick={() => setInvestorsDropdownOpen(false)}
                >
                  <span className="text-xl">💼</span>
                  <div>
                    <div className="font-medium">Venture Capitalists</div>
                    <div className="text-xs text-gray-500">Growth funding & strategy</div>
                  </div>
                </Link>
                <Link 
                  href="/investors/institutional" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-green-600 transition rounded-lg cursor-pointer"
                  onClick={() => setInvestorsDropdownOpen(false)}
                >
                  <span className="text-xl">🏢</span>
                  <div>
                    <div className="font-medium">Institutional Investors</div>
                    <div className="text-xs text-gray-500">Large-scale & strategic</div>
                  </div>
                </Link>
                <div className="border-t my-2"></div>
                <Link 
                  href="/investors/contact" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition rounded-lg cursor-pointer"
                  onClick={() => setInvestorsDropdownOpen(false)}
                >
                  <span className="text-xl">📞</span>
                  <div>
                    <div className="font-medium">Contact Finance Team</div>
                    <div className="text-xs text-gray-500">Get in touch with us</div>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
        
        <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition font-medium cursor-pointer">My Wallet</Link>
        <Link href="/login" className="text-gray-700 hover:text-blue-600 transition font-medium cursor-pointer">Login</Link>

        {/* Cart */}
        <Link href="/checkout" className="relative text-gray-700 hover:text-blue-600 transition flex items-center cursor-pointer">
          <ShoppingCart className="h-6 w-6" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </Link>

        {/* CTA Button */}
        <Link
          href="/products"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer"
        >
          Start Shopping
        </Link>
      </div>
    </nav>
  );
}
