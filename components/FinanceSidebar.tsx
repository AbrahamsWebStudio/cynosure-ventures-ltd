'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

function isActive(pathname: string, href: string) {
  return pathname === href;
}

export default function FinanceSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const SidebarContent = (
    <div className="p-4 w-64 bg-white border-r border-gray-200 h-full">
      <h2 className="text-lg font-bold mb-4">Finance Dashboard</h2>
      <Accordion type="multiple" className="space-y-2">
        {[
          {
            value: 'payroll',
            label: 'Payroll',
            links: [
              ['/finance/payroll/pending', 'Pending Approvals'],
              ['/finance/payroll/approved', 'Approved'],
            ],
          },
          {
            value: 'products',
            label: 'Stock Management',
            links: [
              ['/finance/products/add', 'Add Product'],
              ['/finance/products/list', 'Product List'],
            ],
          },
          {
            value: 'employees',
            label: 'Employees',
            links: [
              ['/finance/employees/add', 'Add Employee'],
              ['/finance/employees/list', 'Employee List'],
            ],
          },
          {
            value: 'vendors',
            label: 'Vendors',
            links: [
              ['/finance/vendors/add', 'Add Vendor'],
              ['/finance/vendors/list', 'Vendor List'],
            ],
          },
          {
            value: 'transactions',
            label: 'Transactions',
            links: [['/finance/transactions', 'View Transactions']],
          },
          {
            value: 'reports',
            label: 'Reports',
            links: [['/finance/reports', 'Download Reports']],
          },
          {
            value: 'vehicles',
            label: 'Vehicles',
            links: [
              ['/finance/vehicles/add', 'Add Vehicle'],
              ['/finance/vehicles/list', 'Vehicle List'],
            ],
          },
          {
            value: 'orders',
            label: 'Orders',
            links: [
              ['/finance/orders/pending', 'Pending Orders'],
              ['/finance/orders/completed', 'Completed Orders'],
            ],
          },
          {
            value: 'roles',
            label: 'Roles',
            links: [['/finance/roles/list', 'Roles List']],
          },
        ].map((section) => (
          <AccordionItem key={section.value} value={section.value}>
            <AccordionTrigger
              className={cn(
                section.links.some(([href]) => isActive(pathname, href)) &&
                  'text-blue-600 font-semibold'
              )}
            >
              {section.label}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col space-y-1 pl-4">
              {section.links.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'hover:underline text-sm',
                    isActive(pathname, href) && 'text-blue-600 font-semibold'
                  )}
                >
                  {label}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - always visible */}
      <div className="hidden md:block fixed top-16 left-0 h-[calc(100vh-4rem)]">
        {SidebarContent}
      </div>

      {/* Mobile Sidebar - slide out */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="bg-blue-600 p-2 rounded text-white hover:bg-blue-700 transition">
            <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            {SidebarContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
