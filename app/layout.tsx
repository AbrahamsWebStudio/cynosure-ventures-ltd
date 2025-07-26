import './globals.css';
export const metadata = {
  title: "CYNOSURE VENTURES LTD",
  description: "Financial Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
