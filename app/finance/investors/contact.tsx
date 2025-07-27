import { useState } from 'react';

export default function InvestorContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 flex flex-col items-center">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">Contact Our Finance Team</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold">Send Message</button>
        </form>
        {submitted && <p className="mt-4 text-green-600 font-semibold">Thank you for contacting us! We will get back to you soon.</p>}
      </div>
      <div className="max-w-lg w-full bg-blue-50 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Finance Contacts</h2>
        <div className="mb-3">
          <p className="font-semibold text-blue-800">Finance Manager</p>
          <p className="text-blue-700">Jane Doe</p>
          <p className="text-blue-600 text-sm">jane.doe@cynosureventures.co.ke</p>
          <p className="text-blue-600 text-sm">+254 700 111 222</p>
        </div>
        <div>
          <p className="font-semibold text-blue-800">Director</p>
          <p className="text-blue-700">John Smith</p>
          <p className="text-blue-600 text-sm">john.smith@cynosureventures.co.ke</p>
          <p className="text-blue-600 text-sm">+254 700 333 444</p>
        </div>
      </div>
    </div>
  );
} 