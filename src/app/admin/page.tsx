'use client';

// ============================================================================
// 1. IMPORTS & LIBRARIES
// ============================================================================
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  IndianRupee,
  Users,
  ShoppingBag,
  Package,
  RefreshCw,
  ArrowLeft,
  Lock,
  LogOut,
  Trash2,
  Plus,
  Edit2,
  ExternalLink,
  Layers,
  CheckCircle,
  XCircle,
  Save,
  Image as ImageIcon,
  Search,
  Tag,
  Truck,
  FileText,
  Upload,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  FolderOpen,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { formatExternalUrl } from '@/lib/formatUrl';
import InvoiceModal, { InvoiceOrder } from '@/components/InvoiceModal';
import ImageGalleryModal from '@/components/ImageGalleryModal';

// Chart.js Registration for Admin Analytics
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// ============================================================================
// 2. TYPES & INTERFACES
// ============================================================================
interface ProductItem {
  id: string;
  name: string;
  sku?: string;
  price: number; // Stored in paise (e.g. 49900 = ₹499.00)
  originalPrice?: number | null; // Stored in paise (e.g. 79900 = ₹799.00)
  stock: number;
  imageUrl?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface OrderItem {
  id: string;
  receiptId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
  amount: number;
  shippingCost?: number;
  status: string;
  razorpayPaymentId?: string | null;
  awbNumber?: string | null;
  courierUrl?: string | null;
  deliveredAt?: string | null;
  returnReason?: string | null;
  returnDetails?: string | null;
  returnUpi?: string | null;
  returnStatus?: string | null;
  returnRequestedAt?: string | null;
  returnAdminNotes?: string | null;
  createdAt: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

const INVOICE_ELIGIBLE_STATUSES = ['PAID', 'SHIPPED', 'DELIVERED', 'RETURN_REQUESTED', 'RETURNED'];

export default function AdminDashboard() {
  // ============================================================================
  // 3. COMPONENT STATES
  // ============================================================================
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'users'>('overview');
  const [loading, setLoading] = useState(false);

  // Global Shipping Settings State
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingMinAmount: '999',
    standardShippingFee: '99',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Global Dashboard Stats
  const [stats, setStats] = useState({
    totalSales: 0,
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });

  // Table Collections
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);

  // Customer Table Search & Pagination State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userPage, setUserPage] = useState(1);
  const USERS_PER_PAGE = 5;

  // Inline AWB & Courier Link Editing State
  const [editingAwbId, setEditingAwbId] = useState<string | null>(null);
  const [awbInputs, setAwbInputs] = useState<{
    [key: string]: { awbNumber: string; courierUrl: string };
  }>({});

  // Order Sub-filter & Return Management State
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED' | 'RETURNS' | 'COMPLETED_RETURNS'>('ALL');
  const [copiedUpiId, setCopiedUpiId] = useState<string | null>(null);

  // Invoice Modal State for Admin
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<InvoiceOrder | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Image Gallery Modal State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Single Product Management Form State
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productForm, setProductForm] = useState({
    name: 'Brain Bowl Powder',
    sku: 'Pow-100',
    price: '499',
    originalPrice: '799',
    stock: '500',
    imageUrl: '/product_image.jpeg',
    description: '100% Plant-Based Superfood Makhana with mental focus nutrients.',
    seoTitle: 'Brain Bowl Powder New',
    seoDescription: 'Brain Bowl Powder New',
  });

  // Authentication State for Admin Sign In Form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ============================================================================
  // 4. DATA FETCHING & LIFECYCLE
  // ============================================================================
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/check');
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (data.authenticated) {
        setAuthenticated(true);
        fetchAllData();
        fetchSettings();
      } else {
        setAuthenticated(false);
      }
    } catch {
      setAuthenticated(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.data) {
        setShippingSettings({
          freeShippingMinAmount: (data.data.freeShippingMinAmount / 100).toString(),
          standardShippingFee: (data.data.standardShippingFee / 100).toString(),
        });
      }
    } catch (err) {
      console.error('Failed to load store shipping rules:', err);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resUsers, resOrders, resProducts, resStats] = await Promise.all([
        fetch('/api/admin/users').then((r) => r.ok ? r.json() : { success: false, data: [] }).catch(() => ({ success: false, data: [] })),
        fetch('/api/admin/orders').then((r) => r.ok ? r.json() : { success: false, data: [] }).catch(() => ({ success: false, data: [] })),
        fetch('/api/admin/products').then((r) => r.ok ? r.json() : { success: false, data: [] }).catch(() => ({ success: false, data: [] })),
        fetch('/api/admin/stats').then((r) => r.ok ? r.json() : { success: false, data: null }).catch(() => ({ success: false, data: null })),
      ]);

      if (resUsers?.success && Array.isArray(resUsers.data)) {
        setUsers(resUsers.data);
      }

      if (resOrders?.success && Array.isArray(resOrders.data)) {
        setOrders(resOrders.data);
        const initialAwbs: { [key: string]: { awbNumber: string; courierUrl: string } } = {};
        resOrders.data.forEach((o: OrderItem) => {
          initialAwbs[o.id] = {
            awbNumber: o.awbNumber || '',
            courierUrl: o.courierUrl || '',
          };
        });
        setAwbInputs(initialAwbs);
      }

      if (resStats?.success && resStats.data) {
        setStats(resStats.data);
      }

      if (resProducts?.success && Array.isArray(resProducts.data)) {
        setProducts(resProducts.data);
        if (resProducts.data.length > 0) {
          const first = resProducts.data[0];
          setEditingProduct(first);
          setProductForm({
            name: first.name,
            sku: first.sku || 'Pow-100',
            price: (first.price / 100).toString(),
            originalPrice: first.originalPrice ? (first.originalPrice / 100).toString() : '799',
            stock: first.stock.toString(),
            imageUrl: first.imageUrl || '/product_image.jpeg',
            description: first.description || '100% Plant-Based Superfood Makhana',
            seoTitle: first.seoTitle || 'Brain Bowl Powder New',
            seoDescription: first.seoDescription || 'Brain Bowl Powder New',
          });
        }
      }
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success('Admin Sign In Successful 👋');
      setAuthenticated(true);
      fetchAllData();
      fetchSettings();
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  // ============================================================================
  // 5. GLOBAL SHIPPING SETTINGS HANDLER
  // ============================================================================
  const handleSaveShippingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freeShippingMinAmount: shippingSettings.freeShippingMinAmount,
          standardShippingFee: shippingSettings.standardShippingFee,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('🚚 Global Shipping Rules Updated!');
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update shipping rules');
    } finally {
      setSavingSettings(false);
    }
  };

  // ============================================================================
  // 6. ORDER & DELIVERY ACTION HANDLERS
  // ============================================================================
  const handleSaveAwbAndLink = async (orderId: string) => {
    const input = awbInputs[orderId];
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          awbNumber: input?.awbNumber || '',
          courierUrl: input?.courierUrl || '',
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('AWB Number & Tracking Link Saved! 🚚');
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  awbNumber: input?.awbNumber || null,
                  courierUrl: input?.courierUrl || null,
                }
              : o
          )
        );
        setEditingAwbId(null);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save tracking details');
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Order status updated to ${newStatus} 🎯`);
        fetchAllData();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  const handleApproveReturn = async (orderId: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          returnStatus: 'APPROVED',
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Return Approved & Refund Settled! 💸');
        fetchAllData();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve return');
    }
  };

  const handleRejectReturn = async (orderId: string) => {
    const reason = prompt('Enter reason for rejecting this return request:');
    if (reason === null) return; // user cancelled prompt

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          returnStatus: 'REJECTED',
          returnAdminNotes: reason || 'Return policy terms not met.',
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Return request rejected.');
        fetchAllData();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject return');
    }
  };

  const handleCopyUpi = (upi: string, orderId: string) => {
    navigator.clipboard.writeText(upi);
    setCopiedUpiId(orderId);
    toast.success('UPI ID copied to clipboard! 📋');
    setTimeout(() => setCopiedUpiId(null), 2500);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Order deleted 🗑️');
        fetchAllData();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete order');
    }
  };

  // ============================================================================
  // 7. PRODUCT MANAGEMENT & IMAGE UPLOAD
  // ============================================================================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 1 * 1024 * 1024; // 1 MB limit
    if (file.size > MAX_SIZE) {
      toast.error(`Image is ${(file.size / (1024 * 1024)).toFixed(2)} MB! Maximum allowed size is 1 MB.`);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadingImage(true);
    const toastId = toast.loading('Uploading image (Max 1 MB)...');
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setProductForm((prev) => ({ ...prev, imageUrl: data.url }));
        toast.success('Image uploaded and selected! 📸', { id: toastId });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed', { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct?.id || products[0]?.id,
          ...productForm,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Product Price, MRP & Stock Updated! 📦');
        fetchAllData();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update product');
    }
  };

  // ============================================================================
  // 8. USER MANAGEMENT & DELETION HANDLERS
  // ============================================================================
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`User "${userName}" deleted successfully 🗑️`);
        fetchAllData();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const handleDeleteAllUsers = async () => {
    const confirmation = prompt('⚠️ WARNING: This will permanently delete ALL registered user accounts.\n\nType "DELETE ALL" to confirm:');
    if (confirmation !== 'DELETE ALL') {
      toast('Deletion cancelled.');
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteAll: true }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`All user records cleared! 🗑️ (${data.count || 0} removed)`);
        fetchAllData();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete all user records');
    }
  };

  // ============================================================================
  // 9. USER SEARCH & PAGINATION HELPERS
  // ============================================================================
  const filteredUsers = users.filter((u) => {
    const q = userSearchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q)
    );
  });

  const totalUserPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * USERS_PER_PAGE,
    userPage * USERS_PER_PAGE
  );

  // ============================================================================
  // 9. CHART.JS ANALYTICS DATA
  // ============================================================================
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Sales Revenue (₹)',
        data: [
          12000,
          19000,
          32000,
          45000,
          52000,
          stats.totalSales > 60000 ? stats.totalSales * 0.8 : 48000,
          stats.totalSales > 80000 ? stats.totalSales * 0.9 : 62000,
          stats.totalSales || 75000,
        ],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: ['Delivered', 'In Transit / Paid', 'Return Requests', 'Completed Returns', 'Cancelled'],
    datasets: [
      {
        data: [
          orders.filter((o) => o.status === 'DELIVERED').length || 1,
          orders.filter((o) => o.status === 'PAID' || o.status === 'SHIPPED').length || 0,
          orders.filter((o) => o.status === 'RETURN_REQUESTED').length || 0,
          orders.filter((o) => o.status === 'RETURNED').length || 0,
          orders.filter((o) => o.status === 'CANCELLED').length || 0,
        ],
        backgroundColor: ['#10b981', '#06b6d4', '#f59e0b', '#a855f7', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  // ============================================================================
  // 10. LOGIN SCREEN FOR UNAUTHENTICATED USERS
  // ============================================================================
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#070d0a] text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <RefreshCw className="h-5 w-5 animate-spin text-emerald-400" />
          <span>Verifying Admin Credentials...</span>
        </div>
      </div>
    );
  }

  if (authenticated === false) {
    return (
      <div className="min-h-screen bg-[#070d0a] text-white flex items-center justify-center p-4 font-sans antialiased">
        <div className="w-full max-w-md rounded-3xl border border-[#1f3328] bg-[#0d1712]/95 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white font-sans">Brain Bowl Control Panel</h1>
            <p className="mt-1 text-xs text-gray-400">Sign in to manage product prices, stock, AWB shipments & returns.</p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Admin Username</label>
              <input
                type="text"
                required
                placeholder="admin"
                className="mt-1.5 w-full rounded-xl border border-[#233b2e] bg-[#070d0a] p-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Security Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-[#233b2e] bg-[#070d0a] p-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="mt-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition disabled:opacity-50 cursor-pointer"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Control Center'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculate live discount for preview
  const sellingNum = Number(productForm.price) || 0;
  const mrpNum = Number(productForm.originalPrice) || 0;
  const discountPercent = mrpNum > sellingNum ? Math.round(((mrpNum - sellingNum) / mrpNum) * 100) : 0;

  // ============================================================================
  // 11. MAIN DASHBOARD UI (INTER FONT & MODERN DESIGN)
  // ============================================================================
  return (
    <>
      <div className="min-h-screen bg-[#070d0a] text-white p-4 sm:p-6 md:p-10 font-sans antialiased print:hidden">
        <div className="mx-auto max-w-7xl">
          
          {/* TOP BAR HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1f3328]">
            <div>
              <a href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline mb-2 transition">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Storefront
              </a>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                  Brain Bowl Control Panel
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-[10px] font-bold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchAllData}
                disabled={loading}
                className="flex items-center gap-2 bg-[#0e1a14] border border-[#1f3328] px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#15261d] text-gray-200 hover:text-white transition"
              >
                <RefreshCw className={`h-4 w-4 text-emerald-400 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
              </button>
              <button
                onClick={async () => {
                  await fetch('/api/admin/logout', { method: 'POST' });
                  setAuthenticated(false);
                }}
                className="flex items-center gap-1.5 bg-red-950/20 border border-red-900/40 text-red-400 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-900/30 transition"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>

          {/* GLOBAL SHIPPING COST SETTINGS */}
          <div className="mt-6 rounded-3xl border border-[#1f3328] bg-[#0d1712] p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 pb-4 border-b border-[#1f3328]">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Global Shipping Rules</h2>
                <p className="text-xs text-gray-400">
                  Set free delivery order thresholds and standard shipping cost for checkout.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveShippingSettings} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 items-end">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Free Shipping Minimum (₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="999"
                  className="mt-1.5 w-full rounded-xl border border-[#233b2e] bg-[#070d0a] p-3 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                  value={shippingSettings.freeShippingMinAmount}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingMinAmount: e.target.value })}
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Free shipping applied when cart total &gt; ₹{shippingSettings.freeShippingMinAmount || '999'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Standard Shipping Fee (₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="99"
                  className="mt-1.5 w-full rounded-xl border border-[#233b2e] bg-[#070d0a] p-3 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                  value={shippingSettings.standardShippingFee}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, standardShippingFee: e.target.value })}
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Charged on orders below free shipping threshold
                </span>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg transition disabled:opacity-50 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  {savingSettings ? 'Saving Rules...' : 'Save Shipping Rules'}
                </button>
              </div>
            </form>
          </div>

          {/* MAIN NAVIGATION TABS */}
          <div className="flex items-center gap-2 mt-8 border-b border-[#1f3328] pb-3 overflow-x-auto">
            {[
              { id: 'overview', label: 'Analytics & Overview', icon: Layers },
              { id: 'products', label: 'Product Price & Stock', icon: Package },
              {
                id: 'orders',
                label: `Orders & Deliveries (${orders.length})`,
                badge: orders.filter((o) => o.status === 'RETURN_REQUESTED').length,
                icon: ShoppingBag,
              },
              { id: 'users', label: `Customer Accounts (${users.length})`, icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-[#0d1712] border border-[#1f3328] text-gray-400 hover:text-white hover:bg-[#15261d]'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black animate-pulse">
                    {tab.badge} Return
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: ANALYTICS & OVERVIEW (CHART.JS) */}
          {activeTab === 'overview' && (
            <div className="mt-8 space-y-8 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-2xl border border-[#1f3328] bg-[#0d1712] p-6 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Gross Sales</span>
                    <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <IndianRupee className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-3 text-3xl font-black text-white font-mono">₹{stats.totalSales.toLocaleString('en-IN')}</p>
                  <span className="text-[10px] text-emerald-400/80 mt-1 block">✓ All confirmed orders</span>
                </div>

                <div className="rounded-2xl border border-[#1f3328] bg-[#0d1712] p-6 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Delivered Orders</span>
                    <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-3 text-3xl font-black text-emerald-400 font-mono">
                    {orders.filter((o) => o.status === 'DELIVERED').length}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">Successfully Delivered</span>
                </div>

                <div className="rounded-2xl border border-[#1f3328] bg-[#0d1712] p-6 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Return Requests</span>
                    <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <RotateCcw className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-3 text-3xl font-black text-amber-400 font-mono">
                    {orders.filter((o) => o.status === 'RETURN_REQUESTED').length}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">Pending Review</span>
                </div>

                <div className="rounded-2xl border border-[#1f3328] bg-[#0d1712] p-6 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Stock Inventory</span>
                    <div className="h-8 w-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <Package className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-3 text-3xl font-black text-white font-mono">
                    {productForm.stock || 0} units
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">Live Available Stock</span>
                </div>
              </div>

              {/* Graphical Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 rounded-2xl border border-[#1f3328] bg-[#0d1712] p-6 shadow-xl">
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" /> Monthly Revenue Analytics
                  </h3>
                  <div className="h-64">
                    <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#1f3328] bg-[#0d1712] p-6 shadow-xl flex flex-col items-center justify-center">
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
                    Order Status Breakdown
                  </h3>
                  <div className="h-48 w-48">
                    <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT PRICE & STOCK MANAGEMENT (WITH GALLERY MEDIA ACCESS) */}
          {activeTab === 'products' && (
            <div className="mt-8 space-y-8 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Form: Product Settings */}
                <div className="lg:col-span-7 rounded-3xl border border-[#1f3328] bg-[#0d1712] p-6 sm:p-8 shadow-xl">
                  <div className="flex items-center gap-3 pb-4 border-b border-[#1f3328]">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Product Price, MRP & Stock</h2>
                      <p className="text-xs text-gray-400">
                        Update storefront pricing, regular MRP, stock count, and product image.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProduct} className="mt-6 space-y-5">
                    {/* Product Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Product Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Brain Bowl Powder"
                        className="mt-1.5 w-full rounded-xl border border-[#233b2e] bg-[#070d0a] p-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      />
                    </div>

                    {/* Pricing: Selling Price & MRP */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider">
                          Selling Price (₹) <span className="text-red-400">*</span>
                        </label>
                        <div className="relative mt-1.5">
                          <span className="absolute left-3.5 top-3 text-xs text-gray-500 font-bold">₹</span>
                          <input
                            type="number"
                            required
                            step="1"
                            placeholder="499"
                            className="w-full rounded-xl border border-[#233b2e] bg-[#070d0a] pl-8 p-3 text-xs text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1 block">Actual customer checkout price</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Regular Price / MRP (₹)
                        </label>
                        <div className="relative mt-1.5">
                          <span className="absolute left-3.5 top-3 text-xs text-gray-500 font-bold">₹</span>
                          <input
                            type="number"
                            step="1"
                            placeholder="799"
                            className="w-full rounded-xl border border-[#233b2e] bg-[#070d0a] pl-8 p-3 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                            value={productForm.originalPrice}
                            onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1 block">Strikethrough list price</span>
                      </div>
                    </div>

                    {/* Stock & SKU */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                          Stock Quantity (Units) <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="500"
                          className="mt-1.5 w-full rounded-xl border border-[#233b2e] bg-[#070d0a] p-3 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                          Product SKU Code
                        </label>
                        <input
                          type="text"
                          placeholder="Pow-100"
                          className="mt-1.5 w-full rounded-xl border border-[#233b2e] bg-[#070d0a] p-3 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                          value={productForm.sku}
                          onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Image Selection & Media Gallery Integration */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                          Product Image & Media
                        </label>
                        <button
                          type="button"
                          onClick={() => setGalleryModalOpen(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition cursor-pointer"
                        >
                          <FolderOpen className="h-3.5 w-3.5" /> Browse Media Gallery
                        </button>
                      </div>

                      {/* Current Image Info & Quick Upload Buttons */}
                      <div className="p-3.5 rounded-2xl border border-[#233b2e] bg-[#070d0a] flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <div className="h-12 w-12 rounded-xl bg-[#0d1712] border border-[#1f3328] p-1 flex items-center justify-center overflow-hidden shrink-0">
                            <img
                              src={productForm.imageUrl || '/product_image.jpeg'}
                              alt="Current Preview"
                              className="h-full w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/product_image.jpeg';
                              }}
                            />
                          </div>
                          <div className="truncate max-w-[200px]">
                            <span className="text-[10px] text-gray-500 block uppercase font-semibold">Active Image</span>
                            <span className="text-xs text-emerald-400 font-mono truncate block">{productForm.imageUrl || '/product_image.jpeg'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => setGalleryModalOpen(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-[#15261d] border border-[#233b2e] px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-[#1d3528] transition cursor-pointer"
                          >
                            <FolderOpen className="h-3.5 w-3.5" /> Select from Gallery
                          </button>

                          <label className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-[#0d1712] border border-[#233b2e] px-3.5 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-[#15261d] cursor-pointer transition">
                            <Upload className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{uploadingImage ? 'Uploading...' : 'Upload (Max 1 MB)'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingImage}
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Description / Superfood Benefits
                      </label>
                      <textarea
                        rows={3}
                        placeholder="100% Plant-Based Superfood Makhana with mental focus nutrients..."
                        className="mt-1.5 w-full rounded-xl border border-[#233b2e] bg-[#070d0a] p-3 text-xs text-white focus:border-emerald-500 focus:outline-none resize-none"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      />
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 border-t border-[#1f3328] flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3.5 text-xs font-bold text-white shadow-lg transition cursor-pointer"
                      >
                        <Save className="h-4 w-4" /> Save Product Price & Stock
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Card: Live Storefront Card Preview */}
                <div className="lg:col-span-5 rounded-3xl border border-[#1f3328] bg-[#0d1712] p-6 shadow-xl sticky top-8">
                  <div className="flex items-center justify-between pb-4 border-b border-[#1f3328] mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Live Storefront Preview
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                      Real-time
                    </span>
                  </div>

                  <div className="rounded-2xl border border-[#233b2e] bg-[#070d0a] p-5 text-center relative overflow-hidden">
                    {discountPercent > 0 && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-black px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {discountPercent}% OFF
                      </div>
                    )}

                    <div className="h-48 w-full flex items-center justify-center p-2 my-2">
                      <img
                        src={productForm.imageUrl || '/product_image.jpeg'}
                        alt={productForm.name}
                        className="h-full w-auto object-contain rounded-xl drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/product_image.jpeg';
                        }}
                      />
                    </div>

                    <h3 className="font-bold text-white text-base mt-3">{productForm.name || 'Brain Bowl Powder'}</h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{productForm.description || '100% Plant-Based Superfood'}</p>

                    <div className="mt-4 flex items-center justify-center gap-3">
                      <span className="text-2xl font-black text-emerald-400 font-mono">₹{productForm.price || '499'}.00</span>
                      {discountPercent > 0 && (
                        <span className="text-sm text-gray-500 line-through font-mono">₹{productForm.originalPrice || '799'}.00</span>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1f3328] flex items-center justify-between text-xs text-gray-400">
                      <span>Stock Inventory:</span>
                      <span className="font-bold text-white font-mono">{productForm.stock || '500'} Available</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: ORDERS, DELIVERIES & RETURN MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="mt-8 rounded-3xl border border-[#1f3328] bg-[#0d1712] p-6 shadow-xl animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Orders, Deliveries & Return Management</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Progress delivery stages (`PAID` ➔ `SHIPPED` ➔ `DELIVERED`), assign courier AWB, and approve returns.
                  </p>
                </div>

                {/* Sub-filter tabs */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'ALL', label: `All (${orders.length})` },
                    { id: 'ACTIVE', label: `In Transit (${orders.filter((o) => o.status === 'PAID' || o.status === 'SHIPPED').length})` },
                    { id: 'DELIVERED', label: `Delivered (${orders.filter((o) => o.status === 'DELIVERED').length})` },
                    {
                      id: 'RETURNS',
                      label: `Return Requests (${orders.filter((o) => o.status === 'RETURN_REQUESTED').length})`,
                      alert: orders.filter((o) => o.status === 'RETURN_REQUESTED').length > 0,
                    },
                    { id: 'COMPLETED_RETURNS', label: `Completed Returns (${orders.filter((o) => o.status === 'RETURNED').length})` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setOrderFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        orderFilter === f.id
                          ? f.id === 'RETURNS'
                            ? 'bg-amber-500 text-black font-extrabold shadow'
                            : 'bg-emerald-600 text-white shadow-lg'
                          : f.alert
                          ? 'bg-amber-950/60 border border-amber-800 text-amber-300 hover:bg-amber-900/60'
                          : 'bg-[#070d0a] border border-[#1f3328] text-gray-400 hover:text-white'
                      }`}
                    >
                      {f.alert && <AlertTriangle className="h-3.5 w-3.5 animate-pulse text-amber-400" />}
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300 font-sans">
                  <thead className="border-b border-[#1f3328] text-gray-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-3">Customer & Receipt</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Delivery & Order Status</th>
                      <th className="py-3 px-3">Saved AWB & Tracking</th>
                      <th className="py-3 px-3">Return Details & Actions</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f3328]">
                    {orders
                      .filter((o) => {
                        if (orderFilter === 'ACTIVE') return o.status === 'PAID' || o.status === 'SHIPPED';
                        if (orderFilter === 'DELIVERED') return o.status === 'DELIVERED';
                        if (orderFilter === 'RETURNS') return o.status === 'RETURN_REQUESTED';
                        if (orderFilter === 'COMPLETED_RETURNS') return o.status === 'RETURNED';
                        return true;
                      })
                      .map((order) => {
                        const isEditingThis = editingAwbId === order.id;
                        const canDownloadInvoice = INVOICE_ELIGIBLE_STATUSES.includes(order.status?.toUpperCase());

                        return (
                          <tr key={order.id} className="hover:bg-[#070d0a] transition">
                            {/* Customer Column */}
                            <td className="py-4 px-3 font-semibold text-white">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm">{order.customerName}</span>
                                <span className="text-[10px] text-gray-500 font-mono">#{order.receiptId || order.id.slice(0, 8)}</span>
                                <span className="text-[10px] text-gray-400">{order.customerEmail}</span>
                                {order.customerPhone && (
                                  <span className="text-[10px] text-emerald-400/80 font-mono">+91 {order.customerPhone}</span>
                                )}
                              </div>
                            </td>

                            {/* Amount Column */}
                            <td className="py-4 px-3 font-bold text-white font-mono">
                              ₹{(order.amount / 100).toFixed(2)}
                              {order.shippingCost ? (
                                <span className="block text-[10px] text-gray-500 font-sans">+ ₹{(order.shippingCost / 100).toFixed(2)} ship</span>
                              ) : null}
                            </td>

                            {/* Status Selector Dropdown */}
                            <td className="py-4 px-3">
                              <div className="flex flex-col gap-1.5 items-start">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border focus:outline-none cursor-pointer ${
                                    order.status === 'DELIVERED'
                                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                      : order.status === 'SHIPPED'
                                      ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                                      : order.status === 'RETURN_REQUESTED'
                                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                                      : order.status === 'RETURNED'
                                      ? 'bg-purple-950 text-purple-300 border-purple-800'
                                      : order.status === 'PAID'
                                      ? 'bg-green-950 text-green-300 border-green-800'
                                      : order.status === 'CANCELLED'
                                      ? 'bg-red-950 text-red-300 border-red-800'
                                      : 'bg-amber-950 text-amber-300 border-amber-800'
                                  }`}
                                >
                                  <option value="PAID" className="bg-[#0d1712] text-green-400">✓ PAID & CONFIRMED</option>
                                  <option value="SHIPPED" className="bg-[#0d1712] text-cyan-400">🚚 SHIPPED / IN TRANSIT</option>
                                  <option value="DELIVERED" className="bg-[#0d1712] text-emerald-400">🎉 DELIVERED</option>
                                  <option value="RETURN_REQUESTED" className="bg-[#0d1712] text-amber-400">🔄 RETURN REQUESTED</option>
                                  <option value="RETURNED" className="bg-[#0d1712] text-purple-400">✨ RETURNED & REFUNDED</option>
                                  <option value="CANCELLED" className="bg-[#0d1712] text-red-400">✕ CANCELLED</option>
                                  <option value="PENDING" className="bg-[#0d1712] text-amber-400">⏳ PENDING</option>
                                </select>

                                {order.deliveredAt && order.status === 'DELIVERED' && (
                                  <span className="text-[10px] text-emerald-400/80">
                                    Delivered: {new Date(order.deliveredAt).toLocaleDateString('en-IN')}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Saved AWB & Tracking Link */}
                            <td className="py-4 px-3">
                              {isEditingThis ? (
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="AWB Number"
                                    value={awbInputs[order.id]?.awbNumber || ''}
                                    onChange={(e) =>
                                      setAwbInputs({
                                        ...awbInputs,
                                        [order.id]: { ...awbInputs[order.id], awbNumber: e.target.value },
                                      })
                                    }
                                    className="w-32 rounded-lg border border-[#233b2e] bg-[#070d0a] px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                                  />
                                  <input
                                    type="url"
                                    placeholder="Courier Link"
                                    value={awbInputs[order.id]?.courierUrl || ''}
                                    onChange={(e) =>
                                      setAwbInputs({
                                        ...awbInputs,
                                        [order.id]: { ...awbInputs[order.id], courierUrl: e.target.value },
                                      })
                                    }
                                    className="w-40 rounded-lg border border-[#233b2e] bg-[#070d0a] px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleSaveAwbAndLink(order.id)}
                                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
                                  >
                                    <Save className="h-3.5 w-3.5" /> Save
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  {order.awbNumber ? (
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/40">
                                        {order.awbNumber}
                                      </span>
                                      <a
                                        href={formatExternalUrl(order.courierUrl, order.awbNumber)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs text-blue-400 hover:underline font-semibold"
                                      >
                                        Track <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-gray-500 italic">No AWB assigned</span>
                                  )}
                                  <button
                                    onClick={() => setEditingAwbId(order.id)}
                                    className="text-xs text-gray-400 hover:text-white underline ml-2 font-semibold cursor-pointer"
                                  >
                                    {order.awbNumber ? 'Edit' : '+ Add AWB'}
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Return Request Details & Processing Actions */}
                            <td className="py-4 px-3">
                              {order.status === 'RETURN_REQUESTED' ? (
                                <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 space-y-2 min-w-[220px]">
                                  <div>
                                    <span className="font-bold text-amber-400 block text-[11px]">
                                      Reason: {order.returnReason || 'Product Return'}
                                    </span>
                                    {order.returnDetails && (
                                      <p className="text-[10px] text-gray-300 italic mt-0.5 line-clamp-2" title={order.returnDetails}>
                                        &quot;{order.returnDetails}&quot;
                                      </p>
                                    )}
                                  </div>

                                  {order.returnUpi && (
                                    <div className="flex items-center justify-between bg-[#070d0a] p-1.5 rounded-lg border border-[#233b2e]">
                                      <span className="font-mono text-[10px] text-emerald-400 truncate max-w-[130px]" title={order.returnUpi}>
                                        {order.returnUpi}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyUpi(order.returnUpi!, order.id)}
                                        className="p-1 text-gray-400 hover:text-white transition"
                                        title="Copy UPI ID"
                                      >
                                        {copiedUpiId === order.id ? (
                                          <Check className="h-3.5 w-3.5 text-green-400" />
                                        ) : (
                                          <Copy className="h-3.5 w-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-1.5 pt-1">
                                    <button
                                      onClick={() => handleApproveReturn(order.id)}
                                      className="flex-1 rounded-lg bg-green-700 hover:bg-green-600 px-2 py-1 text-[11px] font-bold text-white transition flex items-center justify-center gap-1 cursor-pointer"
                                      title="Approve Return & Mark Refund as Settled"
                                    >
                                      <Check className="h-3 w-3" /> Approve & Refund
                                    </button>
                                    <button
                                      onClick={() => handleRejectReturn(order.id)}
                                      className="rounded-lg bg-red-950/60 border border-red-800/60 hover:bg-red-900/60 px-2 py-1 text-[11px] font-bold text-red-300 transition flex items-center justify-center gap-1 cursor-pointer"
                                      title="Reject Return Request"
                                    >
                                      <XCircle className="h-3 w-3" /> Reject
                                    </button>
                                  </div>
                                </div>
                              ) : order.status === 'RETURNED' ? (
                                <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-300 text-xs">
                                  <span className="font-bold flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" /> Return Approved
                                  </span>
                                  {order.returnUpi && (
                                    <span className="text-[10px] text-gray-400 block font-mono">
                                      Refunded: {order.returnUpi}
                                    </span>
                                  )}
                                </div>
                              ) : order.status === 'DELIVERED' ? (
                                <span className="text-[11px] text-emerald-400/80 italic">
                                  Delivered (Eligible for return)
                                </span>
                              ) : (
                                <span className="text-[11px] text-gray-500 italic">
                                  In fulfillment
                                </span>
                              )}
                            </td>

                            {/* Action Buttons: Invoice & Delete */}
                            <td className="py-4 px-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {canDownloadInvoice ? (
                                  <button
                                    onClick={() => {
                                      setSelectedInvoiceOrder({
                                        id: order.id,
                                        receiptId: order.receiptId || order.id.slice(0, 8),
                                        amount: order.amount,
                                        shippingCost: order.shippingCost || 0,
                                        status: order.status,
                                        customerName: order.customerName,
                                        customerEmail: order.customerEmail,
                                        customerPhone: order.customerPhone || '',
                                        shippingAddress: order.shippingAddress || 'Address on file',
                                        razorpayPaymentId: order.razorpayPaymentId,
                                        awbNumber: order.awbNumber,
                                        createdAt: order.createdAt,
                                      });
                                      setInvoiceModalOpen(true);
                                    }}
                                    className="rounded-xl bg-[#15261d] border border-[#233b2e] p-2 text-gray-300 hover:bg-[#1d3528] hover:text-white transition cursor-pointer"
                                    title="Generate / Download Tax Invoice (Available on Paid, Shipped, or Delivered)"
                                  >
                                    <FileText className="h-4 w-4 text-emerald-400" />
                                  </button>
                                ) : (
                                  <span
                                    className="rounded-xl bg-[#070d0a] border border-[#1f3328] p-2 text-gray-600 opacity-40 cursor-not-allowed inline-flex items-center justify-center"
                                    title="Invoice available on Paid, Shipped, or Delivered status"
                                  >
                                    <FileText className="h-4 w-4 text-gray-600" />
                                  </span>
                                )}
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="rounded-xl bg-red-950/40 border border-red-800/50 p-2 text-red-400 hover:bg-red-900/60 transition cursor-pointer"
                                  title="Delete Order"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMER ACCOUNTS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="mt-8 rounded-3xl border border-[#1f3328] bg-[#0d1712] p-6 shadow-xl animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Registered Customer Accounts ({filteredUsers.length})</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Search, manage, or delete verified customer records.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search name, email, phone..."
                      className="w-full rounded-xl border border-[#233b2e] bg-[#070d0a] pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      value={userSearchQuery}
                      onChange={(e) => {
                        setUserSearchQuery(e.target.value);
                        setUserPage(1);
                      }}
                    />
                  </div>

                  {users.length > 0 && (
                    <button
                      onClick={handleDeleteAllUsers}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-red-950/40 border border-red-800/60 px-3.5 py-2.5 text-xs font-bold text-red-400 hover:bg-red-900/60 hover:text-white transition cursor-pointer"
                      title="Permanently Delete All User Records"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Clear All Users
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300 font-sans">
                  <thead className="border-b border-[#1f3328] text-gray-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-3">Customer Name</th>
                      <th className="py-3 px-3">Email Address</th>
                      <th className="py-3 px-3">Phone</th>
                      <th className="py-3 px-3">Member Since</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f3328]">
                    {paginatedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#070d0a] transition">
                        <td className="py-4 px-3 font-semibold text-white flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          {u.name}
                        </td>
                        <td className="py-4 px-3 text-gray-300">{u.email}</td>
                        <td className="py-4 px-3 font-mono text-emerald-400">+91 {u.phone}</td>
                        <td className="py-4 px-3 text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-3 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="rounded-lg bg-red-950/30 border border-red-800/40 p-2 text-red-400 hover:bg-red-900/60 hover:text-white transition cursor-pointer"
                            title={`Delete ${u.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalUserPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#1f3328]">
                  <span className="text-xs text-gray-400">
                    Showing page <span className="font-bold text-white">{userPage}</span> of {totalUserPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={userPage <= 1}
                      onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-lg border border-[#233b2e] bg-[#070d0a] text-xs font-semibold text-gray-300 hover:bg-[#15261d] disabled:opacity-40 transition"
                    >
                      Previous
                    </button>
                    <button
                      disabled={userPage >= totalUserPages}
                      onClick={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
                      className="px-3 py-1.5 rounded-lg border border-[#233b2e] bg-[#070d0a] text-xs font-semibold text-gray-300 hover:bg-[#15261d] disabled:opacity-40 transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Tax Invoice Modal for Admin */}
      <InvoiceModal
        isOpen={invoiceModalOpen}
        order={selectedInvoiceOrder}
        onClose={() => {
          setInvoiceModalOpen(false);
          setSelectedInvoiceOrder(null);
        }}
      />

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={galleryModalOpen}
        currentImageUrl={productForm.imageUrl}
        onClose={() => setGalleryModalOpen(false)}
        onSelectImage={(url) => {
          setProductForm((prev) => ({ ...prev, imageUrl: url }));
        }}
      />
    </>
  );
}