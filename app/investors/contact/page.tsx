'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';

export default function InvestorContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    investmentType: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Insert into Supabase
    const { error } = await supabase.from('investor_messages').insert([
      {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        investment_type: formData.investmentType,
        message: formData.message,
      }
    ]);
    if (error) {
      setError('Failed to send message. Please try again.');
    } else {
      setSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-6">Contact Our Finance Team</h1>
            <p className="text-xl opacity-90">
              Ready to invest? Get in touch with our finance team to discuss opportunities and partnership possibilities.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
              
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Type</label>
                    <select
                      name="investmentType"
                      value={formData.investmentType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select investment type</option>
                      <option value="angel">Angel Investor</option>
                      <option value="venture-capital">Venture Capitalist</option>
                      <option value="institutional">Institutional Investor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your investment interests, questions, or how you&apos;d like to partner with us..."
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
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
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Finance Team Contacts</h3>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Finance Manager</h4>
                    <p className="text-gray-700 mb-2 font-medium">Jane Doe</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📧 jane.doe@cynosureventures.co.ke</p>
                      <p>📞 +254 700 111 222</p>
                      <p>🕒 Available: Mon-Fri, 9AM-5PM EAT</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Director</h4>
                    <p className="text-gray-700 mb-2 font-medium">John Smith</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📧 john.smith@cynosureventures.co.ke</p>
                      <p>📞 +254 700 333 444</p>
                      <p>🕒 Available: Mon-Fri, 9AM-5PM EAT</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Why Invest with Us?</h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <span>Proven track record of growth and innovation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <span>Diversified business portfolio across multiple sectors</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <span>Strong market position and competitive advantages</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <span>Experienced management team with industry expertise</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <span>Transparent communication and regular updates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back to Investors */}
          <div className="mt-12 text-center">
            <Link 
              href="/investors" 
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
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