import Link from 'next/link';

export default function VentureCapitalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 flex flex-col items-center">
      <div className="max-w-2xl bg-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">Venture Capitalists</h1>
        <p className="text-blue-700 mb-4">Venture capitalists invest in scalable businesses with high growth potential. At Cynosure Ventures, we offer a robust pipeline of opportunities and a transparent investment process.</p>
        <h2 className="text-xl font-semibold text-blue-700 mb-2">How to Invest</h2>
        <ul className="list-disc list-inside text-blue-600 mb-4">
          <li>Participate in Series A and later funding rounds</li>
          <li>Access detailed business plans and financials</li>
          <li>Engage with our leadership team for due diligence</li>
        </ul>
        <div className="mt-6">
          <Link href="/finance/investors/contact" className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold">Contact Us to Invest</Link>
        </div>
      </div>
    </div>
  );
} 