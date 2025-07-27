import Link from 'next/link';

export default function InstitutionalInvestorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 flex flex-col items-center">
      <div className="max-w-2xl bg-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">Institutional Investors</h1>
        <p className="text-blue-700 mb-4">Institutions such as funds, banks, and corporations can diversify their portfolio by investing in Cynosure Ventures. We offer partnership opportunities and a proven track record of growth.</p>
        <h2 className="text-xl font-semibold text-blue-700 mb-2">How to Invest</h2>
        <ul className="list-disc list-inside text-blue-600 mb-4">
          <li>Engage in strategic partnerships</li>
          <li>Participate in large-scale funding rounds</li>
          <li>Access regular performance reports and updates</li>
        </ul>
        <div className="mt-6">
          <Link href="/finance/investors/contact" className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold">Contact Us for Details</Link>
        </div>
      </div>
    </div>
  );
} 