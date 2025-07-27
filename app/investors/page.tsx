import Link from 'next/link';
import Navbar from '@/components/Navbar';

const investorTypes = [
  {
    slug: 'angel',
    name: 'Angel Investors',
    description: 'Early-stage investors who provide capital and mentorship to help startups grow and succeed.',
    icon: '👼',
    color: 'from-purple-500 to-pink-500'
  },
  {
    slug: 'venture-capital',
    name: 'Venture Capitalists',
    description: 'Professional investors who provide significant capital for high-growth potential businesses.',
    icon: '💼',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    slug: 'institutional',
    name: 'Institutional Investors',
    description: 'Large organizations like banks, funds, and corporations seeking strategic investment opportunities.',
    icon: '🏢',
    color: 'from-green-500 to-emerald-500'
  }
];

export default function InvestorsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Invest with Cynosure Ventures</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join our journey of innovation and growth. Discover how you can be part of our success story 
              and contribute to building the future of integrated business solutions.
            </p>
          </div>
        </div>

        {/* Investor Types */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Choose Your Investment Path
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {investorTypes.map((type) => (
              <Link 
                key={type.slug} 
                href={`/investors/${type.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-gray-200 group-hover:-translate-y-2">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                    {type.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">{type.name}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{type.description}</p>
                  <div className="mt-6 text-center">
                    <span className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Learn More →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Invest?</h3>
              <p className="text-lg mb-6 opacity-90">
                Get in touch with our finance team to discuss investment opportunities and partnership possibilities.
              </p>
              <Link 
                href="/investors/contact" 
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 