// /app/finance/layout.tsx

import FinanceSidebar from '@/components/FinanceSidebar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar + Main */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block w-64">
          <FinanceSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
