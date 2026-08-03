"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  IndianRupee,
  Users,
  ShoppingBag,
  Package,
  RefreshCw,
  ArrowLeft,
  Lock,
  LogOut,
} from "lucide-react";

interface OrderItem {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: string;
  awbNumber?: string | null;
  createdAt: string;
}

interface DashboardStats {
  totalSales: number;
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  products: Array<{ id: string; name: string; price: number; stock: number }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
  }>;
  recentOrders: OrderItem[];
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingAwb, setUpdatingAwb] = useState<string | null>(null);

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Check admin authentication state on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/me");
        const data = await res.json();
        if (data.authenticated) {
          setAuthenticated(true);
          fetchStats();
        } else {
          setAuthenticated(false);
        }
      } catch {
        setAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch {
      toast.error("Failed to load metrics");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Invalid credentials");
      }

      toast.success("Admin login successful 👋");
      setAuthenticated(true);
      fetchStats();
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setStats(null);
    toast.success("Admin logged out");
  };

  const handleSaveAwb = async (orderId: string, awbNumber: string) => {
    setUpdatingAwb(orderId);
    try {
      const res = await fetch("/api/admin/orders/update-awb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, awbNumber }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("AWB Tracking Number Updated! 🚚");
        fetchStats();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update AWB");
    } finally {
      setUpdatingAwb(null);
    }
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center text-sm text-gray-400">
        Verifying security credentials...
      </div>
    );
  }

  // 1. RENDER LOGIN FORM IF NOT AUTHENTICATED
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md rounded-3xl border border-[#262626] bg-[#141414] p-8 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-green-950/50 text-[#22c55e] border border-green-800/40">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-black">Admin Access Control</h1>
            <p className="mt-1 text-xs text-gray-400">
              Enter your administrator username and password.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400">
                Username
              </label>
              <input
                type="text"
                required
                placeholder="admin"
                className="mt-1 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] p-3 text-sm text-white focus:border-[#22c55e] focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] p-3 text-sm text-white focus:border-[#22c55e] focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="mt-6 w-full rounded-xl bg-[#16a34a] py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 hover:bg-[#15803d] transition disabled:opacity-50"
            >
              {loginLoading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. RENDER DASHBOARD METRICS IF AUTHENTICATED
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#262626]">
          <div>
            <a
              href="/"
              className="flex items-center gap-1 text-xs font-bold text-[#22c55e] hover:underline mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Store
            </a>
            <h1 className="text-3xl font-black tracking-tight">
              Admin Control Panel
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Real-time metrics for sales, inventory, and registered users.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-2 bg-[#141414] border border-[#262626] px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#1f1f1f] transition"
            >
              <RefreshCw
                className={`h-4 w-4 text-[#22c55e] ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-950/20 border border-red-900/40 text-red-400 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-900/30 transition"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-400">
                Total Sales
              </span>
              <div className="rounded-lg bg-green-950/50 p-2 text-[#22c55e] border border-green-800/40">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-white">
              ₹{stats ? stats.totalSales.toLocaleString("en-IN") : "0.00"}
            </p>
            <span className="text-[10px] text-gray-500">
              From verified paid orders
            </span>
          </div>

          <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-400">
                Total Users
              </span>
              <div className="rounded-lg bg-blue-950/50 p-2 text-blue-400 border border-blue-800/40">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-white">
              {stats ? stats.totalUsers : 0}
            </p>
            <span className="text-[10px] text-gray-500">
              Registered PostgreSQL accounts
            </span>
          </div>

          <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-400">
                Total Orders
              </span>
              <div className="rounded-lg bg-purple-950/50 p-2 text-purple-400 border border-purple-800/40">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-white">
              {stats ? stats.totalOrders : 0}
            </p>
            <span className="text-[10px] text-gray-500">
              {stats ? stats.pendingOrders : 0} Pending Checkouts
            </span>
          </div>

          <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-400">
                Products Stock
              </span>
              <div className="rounded-lg bg-amber-950/50 p-2 text-amber-400 border border-amber-800/40">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-white">
              {stats && stats.products.length > 0 ? stats.products[0].stock : 0}{" "}
              units
            </p>
            <span className="text-[10px] text-gray-500">
              Active inventory available
            </span>
          </div>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          {/* Recent Users Table */}
          <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              Recent Registered Users
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="border-b border-[#262626] text-gray-400 uppercase">
                  <tr>
                    <th className="py-3 px-2">Name</th>
                    <th className="py-3 px-2">Email</th>
                    <th className="py-3 px-2">Phone</th>
                    <th className="py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {stats && stats.recentUsers.length > 0 ? (
                    stats.recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-[#1a1a1a]">
                        <td className="py-3 px-2 font-semibold text-white">
                          {user.name}
                        </td>
                        <td className="py-3 px-2">{user.email}</td>
                        <td className="py-3 px-2">{user.phone}</td>
                        <td className="py-3 px-2 text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-6 text-center text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders Table with AWB Input */}
          <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6">
            <h2 className="text-lg font-bold text-white mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="border-b border-[#262626] text-gray-400 uppercase">
                  <tr>
                    <th className="py-3 px-2">Customer</th>
                    <th className="py-3 px-2">Amount</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">AWB Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {stats && stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#1a1a1a]">
                        <td className="py-3 px-2 font-semibold text-white">
                          {order.customerName}
                        </td>
                        <td className="py-3 px-2">
                          ₹{(order.amount / 100).toFixed(2)}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              order.status === "PAID"
                                ? "bg-green-950 text-green-400 border border-green-800"
                                : "bg-amber-950 text-amber-400 border border-amber-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Enter AWB #"
                              defaultValue={order.awbNumber || ""}
                              onBlur={(e) => {
                                if (
                                  e.target.value !== (order.awbNumber || "")
                                ) {
                                  handleSaveAwb(order.id, e.target.value);
                                }
                              }}
                              className="w-32 rounded-lg border border-[#262626] bg-[#0a0a0a] px-2 py-1 text-xs text-white focus:border-[#22c55e] focus:outline-none"
                            />
                            {updatingAwb === order.id && (
                              <span className="text-[10px] text-[#22c55e] animate-pulse">
                                Saving...
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-6 text-center text-gray-500"
                      >
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}