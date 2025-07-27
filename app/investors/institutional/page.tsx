'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabaseClient';

export default function InstitutionalInvestorPage() {
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
        investment_type: 'institutional',
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
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h1 className="text-4xl font-bold mb-6">Institutional Investors</h1>
            <p className="text-xl opacity-90">
              Large organizations like banks, funds, and corporations seeking strategic investment opportunities
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Information Section */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">How Institutional Investors Help Us</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Large-Scale Funding</h3>
                      <p className="text-gray-600">Provide substantial capital for major expansion projects, acquisitions, and market dominance strategies.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Strategic Partnerships</h3>
                      <p className="text-gray-600">Create long-term partnerships that provide access to markets, customers, and operational synergies.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Corporate Governance</h3>
                      <p className="text-gray-600">Implement best practices in corporate governance, compliance, and risk management.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">4</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Market Access</h3>
                      <p className="text-gray-600">Provide access to new markets, distribution channels, and customer segments.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Investment Opportunities</h2>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Investment range: $1,000,000 - $10,000,000+</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Equity stake: 20% - 60%</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Board representation and governance</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Strategic partnership opportunities</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Long-term growth planning</span>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Tell us about your investment interests and how you&apos;d like to help..."
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
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
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8">
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
              className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold"
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