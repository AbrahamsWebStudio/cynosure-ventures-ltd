"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CompleteProfilePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      // Optionally, fetch current profile data:
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, phone_number")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.log("Profile fetch error:", profileError.message);
      } else if (profileData) {
        setUsername(profileData.full_name || "");
        setPhone(profileData.phone_number || "");
        // setLocation(""); // or remove this if not needed
      }
    };

    fetchUser();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!userId) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: username,
        phone_number: phone,
        role: "user",
      })
      .eq("id", userId);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[85vh] bg-black text-white p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold mb-2 text-center">Complete Your Profile</h1>
          <p className="text-gray-400 text-center mb-6">
            Add your details to get the best personalized experience.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-700 bg-gray-900 rounded p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-700 bg-gray-900 rounded p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-gray-700 bg-gray-900 rounded p-3 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              required
            />

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded p-3 text-lg font-semibold hover:bg-white hover:text-blue-600 border border-blue-600 transition transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
