import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white shadow mt-auto p-6 text-center text-gray-600">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
        <p>&copy; {new Date().getFullYear()} Cynosure Ventures LTD. All rights reserved.</p>

        <div className="flex gap-2 mt-2 md:mt-0 text-blue-600">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <span>|</span>
          <Link href="/products" className="hover:text-black transition">Products</Link>
          <span>|</span>
          <Link href="/deliveries" className="hover:text-black transition">Logistics</Link>
          <span>|</span>
          <Link href="/rides" className="hover:text-black transition">Rides</Link>
          <span>|</span>
          <Link href="/dashboard" className="hover:text-black transition">Dashboard</Link>
        </div>
      </div>

      {/* Social & Contact Icons */}
      <div className="flex justify-center gap-6 mt-4 text-blue-600">
        {/* Facebook */}
        <a href="#" aria-label="Facebook" className="hover:text-black transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22,12A10,10,0,1,0,12,22V14.5H9.5v-3H12V9.75A2.75,2.75,0,0,1,14.75,7h2v3H14.75V11.5H16.5l-.5,3H14.75V22A10,10,0,0,0,22,12Z" />
          </svg>
        </a>

        {/* Phone */}
        <a href="tel:+254700000000" aria-label="Phone" className="hover:text-black transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62,10.79a15.07,15.07,0,0,0,6.59,6.59l2.2-2.2a1,1,0,0,1,1-.24,11.72,11.72,0,0,0,3.69.59,1,1,0,0,1,1,1V20a1,1,0,0,1-1,1A16,16,0,0,1,3,5a1,1,0,0,1,1-1H6.5a1,1,0,0,1,1,1,11.72,11.72,0,0,0,.59,3.69,1,1,0,0,1-.24,1Z" />
          </svg>
        </a>

        {/* Email */}
        <a href="mailto:info@cynosureventures.com" aria-label="Email" className="hover:text-black transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20,4H4A2,2,0,0,0,2,6V18a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V6A2,2,0,0,0,20,4Zm0,4-8,5L4,8V6l8,5,8-5Z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
