'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';

export default function AngelInvestorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.from('investor_messages').insert([
      {
        name: formData.name,
        email: formData.email,
        investment_type: 'angel',
        message: formData.message,
      }
    ]);
    if (error) {
      setError('Failed to send message. Please try again.');
    } else {
      setSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-6xl mb-4">👼</div>
            <h1 className="text-4xl font-bold mb-6">Angel Investors</h1>
            <p className="text-xl opacity-90">
              Early-stage investors who provide capital and mentorship to help startups grow and succeed
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Information Section */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">How Angel Investors Help Us</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Seed Funding</h3>
                      <p className="text-gray-600">Provide initial capital to help us launch new products, expand operations, and enter new markets.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Strategic Mentorship</h3>
                      <p className="text-gray-600">Share valuable industry experience, business insights, and strategic guidance to help us make better decisions.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Network Access</h3>
                      <p className="text-gray-600">Connect us with potential customers, partners, and other investors to accelerate our growth.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">4</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Market Validation</h3>
                      <p className="text-gray-600">Help validate our business model and provide feedback on product-market fit.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Investment Opportunities</h2>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Minimum investment: $10,000 - $100,000</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Equity stake: 5% - 20%</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Board advisory role available</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Regular updates and transparency</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Exit strategy discussions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Tell us about your investment interests and how you&apos;d like to help..."
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                    >
                      Send Message
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Thank You!</h3>
                    <p className="text-gray-600">We've received your message and will get back to you within 24 hours.</p>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Finance Team Contacts</h3>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Finance Manager</h4>
                    <p className="text-gray-700 mb-1">Jane Doe</p>
                    <p className="text-sm text-gray-600">📧 jane.doe@cynosureventures.co.ke</p>
                    <p className="text-sm text-gray-600">📞 +254 700 111 222</p>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Director</h4>
                    <p className="text-gray-700 mb-1">John Smith</p>
                    <p className="text-sm text-gray-600">📧 john.smith@cynosureventures.co.ke</p>
                    <p className="text-sm text-gray-600">📞 +254 700 333 444</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Investors */}
          <div className="mt-12 text-center">
            <Link 
              href="/investors" 
              className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold"
            >
              <span>←</span>
              <span>Back to Investor Types</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 