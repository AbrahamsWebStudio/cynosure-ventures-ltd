-- Fix for Duplicate Navbar/Footer in Finance Pages
-- This script helps identify which pages have duplicate Navbar/Footer

-- Pages that need Navbar/Footer removed (they're already in finance/layout.tsx):
-- 1. app/finance/dashboard/DashboardClient.tsx ✅ (Fixed)
-- 2. app/finance/reports/ReportsClient.tsx ✅ (Fixed)
-- 3. app/finance/transactions/TransactionsClient.tsx ✅ (Fixed)
-- 4. app/finance/vendors/list/page.tsx
-- 5. app/finance/vendors/add/page.tsx
-- 6. app/finance/vehicles/list/page.tsx
-- 7. app/finance/vehicles/add/page.tsx
-- 8. app/finance/roles/list/page.tsx
-- 9. app/finance/roles/add/page.tsx
-- 10. app/finance/products/list/page.tsx
-- 11. app/finance/products/add/page.tsx
-- 12. app/finance/payroll/pending/page.tsx
-- 13. app/finance/payroll/approved/page.tsx
-- 14. app/finance/employees/list/page.tsx
-- 15. app/finance/employees/add/page.tsx
-- 16. app/finance/orders/completed/page.tsx
-- 17. app/finance/orders/pending/page.tsx

-- Instructions:
-- For each page above, remove:
-- 1. import Navbar from '@/components/Navbar';
-- 2. import Footer from '@/components/Footer';
-- 3. <Navbar /> component usage
-- 4. <Footer /> component usage

-- The finance layout already includes these components, so they don't need to be in individual pages. 