"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = supabaseBrowser;
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
      try {
          const { data, error: signUpError } = await supabase.auth.signUp({
              email,
              password,
          });

          if (signUpError) {
              setError(signUpError.message);
              setLoading(false);
              return;
          }

          // 🚀 Optionally, auto-login after registration if email confirmation is OFF
          router.push("/dashboard");

      } catch (err) {
          console.error(err);
          setError("An unexpected error occurred.");
      } finally {
          setLoading(false);
      }
  };



  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[85vh] bg-black text-white p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold mb-2 text-center">Create an Account</h1>
          <p className="text-gray-400 text-center mb-6">
            Register to manage your rides, deliveries, and shop easily.
          </p>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-700 bg-gray-900 rounded p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-700 bg-gray-900 rounded p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              required
            />

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded p-3 text-lg font-semibold hover:bg-white hover:text-blue-600 border border-blue-600 transition transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-500 hover:underline hover:text-blue-300 transition"
            >
              Login here
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
