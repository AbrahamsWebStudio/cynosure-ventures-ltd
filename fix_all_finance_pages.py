#!/usr/bin/env python3
"""
Script to fix duplicate Navbar/Footer in finance pages
This script removes duplicate Navbar and Footer imports and usage from finance pages
since they're already included in the finance layout.
"""

import os
import re

# List of finance pages that need fixing
finance_pages = [
    "app/finance/roles/list/page.tsx",
    "app/finance/roles/add/page.tsx", 
    "app/finance/products/list/page.tsx",
    "app/finance/products/add/page.tsx",
    "app/finance/payroll/pending/page.tsx",
    "app/finance/payroll/approved/page.tsx",
    "app/finance/employees/list/page.tsx",
    "app/finance/employees/add/page.tsx",
    "app/finance/orders/completed/page.tsx",
    "app/finance/orders/pending/page.tsx"
]

def fix_page(file_path):
    """Fix a single page by removing duplicate Navbar/Footer"""
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove import statements
    content = re.sub(r'import Navbar from \'@/components/Navbar\';?\n?', '', content)
    content = re.sub(r'import Footer from \'@/components/Footer\';?\n?', '', content)
    
    # Remove Navbar component usage
    content = re.sub(r'<Navbar />\n?', '', content)
    
    # Remove Footer component usage
    content = re.sub(r'<Footer />\n?', '', content)
    
    # Clean up extra newlines
    content = re.sub(r'\n\n+', '\n\n', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fixed: {file_path}")

def main():
    """Main function to fix all finance pages"""
    print("Fixing duplicate Navbar/Footer in finance pages...")
    
    for page in finance_pages:
        fix_page(page)
    
    print("Done! All finance pages have been fixed.")

if __name__ == "__main__":
    main() 