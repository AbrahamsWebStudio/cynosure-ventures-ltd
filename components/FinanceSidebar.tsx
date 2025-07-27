'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Menu, 
  BarChart3, 
  Package, 
  Users, 
  Building2, 
  Car, 
  CreditCard, 
  FileText, 
  Settings,
  TrendingUp,
  Briefcase,
  Shield
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

function isActive(pathname: string, href: string) {
  return pathname === href;
}

const sidebarItems = [
  {
    value: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    links: [['/finance/dashboard', 'Overview']],
  },
  {
    value: 'orders',
    label: 'Orders',
    icon: Package,
    links: [
      ['/finance/orders', 'All Orders'],
      ['/finance/orders/pending', 'Pending Orders'],
      ['/finance/orders/completed', 'Completed Orders'],
    ],
  },
  {
    value: 'payroll',
    label: 'Payroll',
    icon: CreditCard,
    links: [
      ['/finance/payroll/pending', 'Pending Approvals'],
      ['/finance/payroll/approved', 'Approved'],
    ],
  },
  {
    value: 'products',
    label: 'Inventory',
    icon: Package,
    links: [
      ['/finance/products/add', 'Add Product'],
      ['/finance/products/list', 'Product List'],
    ],
  },
  {
    value: 'employees',
    label: 'Employees',
    icon: Users,
    links: [
      ['/finance/employees/add', 'Add Employee'],
      ['/finance/employees/list', 'Employee List'],
    ],
  },
  {
    value: 'vendors',
    label: 'Vendors',
    icon: Building2,
    links: [
      ['/finance/vendors/add', 'Add Vendor'],
      ['/finance/vendors/list', 'Vendor List'],
    ],
  },
  {
    value: 'rides',
    label: 'Transport',
    icon: Car,
    links: [
      ['/finance/rides', 'All Rides'],
    ],
  },
  {
    value: 'logistics',
    label: 'Logistics',
    icon: Package,
    links: [
      ['/finance/logistics', 'Logistics Management'],
    ],
  },
  {
    value: 'vehicles',
    label: 'Fleet',
    icon: Car,
    links: [
      ['/finance/vehicles/add', 'Add Vehicle'],
      ['/finance/vehicles/list', 'Vehicle List'],
    ],
  },
  {
    value: 'transactions',
    label: 'Transactions',
    icon: TrendingUp,
    links: [['/finance/transactions', 'View Transactions']],
  },
  {
    value: 'reports',
    label: 'Reports',
    icon: FileText,
    links: [['/finance/reports', 'Download Reports']],
  },
  {
    value: 'roles',
    label: 'Security',
    icon: Shield,
    links: [
      ['/finance/roles/add', 'Add Role'],
      ['/finance/roles/list', 'Roles List'],
    ],
  },
];

export default function FinanceSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const SidebarContent = (
    <div className="p-6 w-72 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Finance Portal</h2>
        </div>
        <p className="text-sm text-gray-600">Cynosure Ventures Ltd</p>
      </div>

      {/* Navigation */}
      <Accordion type="multiple" className="space-y-1">
        {sidebarItems.map((section) => {
          const IconComponent = section.icon;
          const isSectionActive = section.links.some(([href]) => isActive(pathname, href));
          
          return (
            <AccordionItem key={section.value} value={section.value}>
              <AccordionTrigger
                className={cn(
                  "px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors",
                  isSectionActive && "bg-blue-50 text-blue-700 border-blue-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{section.label}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-11">
                <div className="flex flex-col space-y-1">
                  {section.links.map(([href, label]) => (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-50",
                        isActive(pathname, href) 
                          ? "text-blue-700 bg-blue-50 font-medium" 
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Quick Actions */}
      <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Quick Actions
        </h3>
        <div className="space-y-2">
          <Link
            href="/finance/orders"
            className="block text-sm text-blue-700 hover:text-blue-900 transition-colors"
          >
            • View All Orders
          </Link>
          <Link
            href="/finance/products/add"
            className="block text-sm text-blue-700 hover:text-blue-900 transition-colors"
          >
            • Add New Product
          </Link>
          <Link
            href="/finance/employees/add"
            className="block text-sm text-blue-700 hover:text-blue-900 transition-colors"
          >
            • Add Employee
          </Link>
          <Link
            href="/finance/reports"
            className="block text-sm text-blue-700 hover:text-blue-900 transition-colors"
          >
            • Generate Report
          </Link>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">System Online</span>
        </div>
        <p className="text-xs text-green-700">All services operational</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen z-40">
        {SidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="bg-blue-600 p-3 rounded-lg text-white hover:bg-blue-700 transition shadow-lg">
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            {SidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setOpen(false)} />
      )}
    </>
  );
}
