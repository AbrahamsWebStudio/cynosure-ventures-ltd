import Link from 'next/link';

const investorTypes = [
  {
    slug: 'angel',
    name: 'Angel Investor',
    description: 'Angel investors provide early-stage capital and mentorship to help startups grow. Learn how you can support innovation and benefit from our growth.',
  },
  {
    slug: 'venture-capital',
    name: 'Venture Capitalist',
    description: 'Venture capitalists invest in scalable businesses with high growth potential. Discover our vision and how your investment can make an impact.',
  },
  {
    slug: 'institutional',
    name: 'Institutional Investor',
    description: 'Institutions such as funds, banks, and corporations can diversify their portfolio by investing in our company. See our track record and partnership opportunities.',
  },
];

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Invest with Cynosure Ventures</h1>
        <p className="text-lg text-blue-700 mb-6">Choose the investor type that fits you best and discover how you can be part of our journey.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
        {investorTypes.map((type) => (
          <Link key={type.slug} href={`/finance/investors/${type.slug}`}
            className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-6 border border-blue-100 hover:border-blue-400 group cursor-pointer">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2 group-hover:text-blue-900 transition-colors">{type.name}</h2>
            <p className="text-blue-600 mb-4 text-sm">{type.description}</p>
            <span className="inline-block mt-2 text-blue-600 group-hover:text-blue-800 underline font-medium">Learn More &rarr;</span>
          </Link>
        ))}
      </div>
      <div className="mt-12 text-center">
        <div className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition">
          <Link href="/finance/investors/contact" className="font-bold text-lg">Contact Our Team</Link>
        </div>
      </div>
    </div>
  );
} 