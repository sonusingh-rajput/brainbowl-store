'use client';

import { useState } from 'react';

export default function OrderLookupPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      // Endpoint logic for order status fetching
      const res = await fetch(`/api/orders?phone=${phone}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
      <div className="mx-auto max-w-xl py-12">
        <a href="/" className="text-xs text-green-500 font-bold hover:underline">
          ← Back to BrainBowl Store
        </a>
        <h1 className="mt-4 text-2xl font-black">Track Your Order Status</h1>
        <p className="text-xs text-neutral-400">Enter your 10-digit phone number to check current shipping updates.</p>

        <form onSubmit={handleSearch} className="mt-6 flex gap-2">
          <input
            type="tel"
            required
            pattern="[6-9][0-9]{9}"
            placeholder="Enter Phone Number"
            className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-sm text-white focus:border-green-500 focus:outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-500 transition"
          >
            Search
          </button>
        </form>

        {loading && <p className="mt-6 text-sm text-neutral-400">Searching order history...</p>}

        {searched && !loading && orders.length === 0 && (
          <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-center text-sm text-neutral-400">
            No orders found matching phone number `{phone}`.
          </div>
        )}
      </div>
    </main>
  );
}