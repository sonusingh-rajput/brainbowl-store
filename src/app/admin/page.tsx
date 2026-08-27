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
} from 'lucide-react';
import { formatExternalUrl } from '@/lib/formatUrl';
import InvoiceModal, { InvoiceOrder } from '@/components/InvoiceModal';

// Chart.js Registration for Admin Graphics
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
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

  // Product Drawer / Modal Form State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productForm, setProductForm] = useState({
    name: 'Brain Bowl Powder',
    sku: 'POW-100',
    price: '499',
    originalPrice: '799',
    stock: '500',
    imageUrl: '/product_image.jpeg',
    description: '100% Plant-Based Superfood Makhana',
    seoTitle: 'BrainBowl — Premium Superfood Makhana',
    seoDescription: 'High-protein, low-calorie superfood snack',
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Admin Auth Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ============================================================================
  // 4. AUTHENTICATION & DATA FETCHING HANDLERS
  // ============================================================================
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me');
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
    }
    checkAuth();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setShippingSettings({
          freeShippingMinAmount: (data.data.freeShippingMinAmount / 100).toString(),
          standardShippingFee: (data.data.standardShippingFee / 100).toString(),
        });
      }
    } catch {
      toast.error('Failed to load shipping settings');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/products'),
      ]);

      const statsData = await statsRes.json();
      const prodData = await prodRes.json();

      if (statsData.success) {
        setStats({
          totalSales: statsData.data.totalSales,
          totalUsers: statsData.data.totalUsers,
          totalOrders: statsData.data.totalOrders,
          pendingOrders: statsData.data.pendingOrders,
        });

        const fetchedOrders: OrderItem[] = statsData.data.recentOrders || [];
        setOrders(fetchedOrders);
        setUsers(statsData.data.recentUsers || []);

        // Initialize local inline input values for AWB and Links
        const initialAwbInputs: any = {};
        fetchedOrders.forEach((order) => {
          initialAwbInputs[order.id] = {
            awbNumber: order.awbNumber || '',
            courierUrl: order.courierUrl || '',
          };
        });
        setAwbInputs(initialAwbInputs);
      }

      if (prodData.success && prodData.data) {
        const fetchedProds: ProductItem[] = prodData.data;
        setProducts(fetchedProds);
        if (fetchedProds.length > 0) {
          const first = fetchedProds[0];
          setEditingProduct(first);
          setProductForm({
            name: first.name,
            sku: first.sku || 'BB-ROAST-01',
            price: (first.price / 100).toString(),
            originalPrice: first.originalPrice ? (first.originalPrice / 100).toString() : '799',
            stock: first.stock.toString(),
            imageUrl: first.imageUrl || '/product_image.jpeg',
            description: first.description || '100% Plant-Based Superfood Makhana',
            seoTitle: first.seoTitle || 'BrainBowl — Premium Superfood Makhana',
            seoDescription: first.seoDescription || 'High-protein roasted superfood snack',
          });
        }
      }
    } catch {
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
  // 6. ORDER & AWB ACTION HANDLERS
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
        toast.success('Return Approved & Refund Marked as Completed! 💸');
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
    if (reason === null) return; // user cancelled

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          returnStatus: 'REJECTED',
          returnAdminNotes: reason || 'Return criteria not met.',
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
  // 7. SHOPIFY PRODUCT ACTION HANDLERS
  // ============================================================================
  const openProductModal = (prod?: ProductItem) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        name: prod.name,
        sku: prod.sku || '',
        price: (prod.price / 100).toString(),
        originalPrice: prod.originalPrice ? (prod.originalPrice / 100).toString() : '799',
        stock: prod.stock.toString(),
        imageUrl: prod.imageUrl || '',
        description: prod.description || '',
        seoTitle: prod.seoTitle || '',
        seoDescription: prod.seoDescription || '',
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        sku: '',
        price: '499',
        originalPrice: '799',
        stock: '500',
        imageUrl: '',
        description: '',
        seoTitle: '',
        seoDescription: '',
      });
    }
    setProductModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 1 * 1024 * 1024; // 1 MB limit in bytes
    if (file.size > MAX_SIZE) {
      toast.error(`Image is ${(file.size / (1024 * 1024)).toFixed(2)} MB! Maximum allowed image size is 1 MB.`);
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
        toast.success('Image uploaded successfully! 📸', { id: toastId });
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
        toast.success('Product Price & Stock Updated! 📦');
        setProductModalOpen(false);
        fetchAllData();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    }
  };

  // ============================================================================
  // 8. CUSTOMER SEARCH & PAGINATION LOGIC
  // ============================================================================
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.phone?.includes(userSearchQuery)
  );

  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * USERS_PER_PAGE,
    userPage * USERS_PER_PAGE
  );

  // ============================================================================
  // 9. GRAPHICS & CHART CONFIGURATIONS
  // ============================================================================
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [1200, 2900, 4500, 3100, 6800, 8900, stats.totalSales || 12000],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: ['Paid Orders', 'Pending Orders', 'Cancelled'],
    datasets: [
      {
        data: [
          orders.filter((o) => o.status === 'PAID').length || 1,
          orders.filter((o) => o.status === 'PENDING').length || 0,
          orders.filter((o) => o.status === 'CANCELLED').length || 0,
        ],
        backgroundColor: ['#16a34a', '#f59e0b', '#dc2626'],
        borderWidth: 0,
      },
    ],
  };

  // ============================================================================
  // 10. LOGIN SCREEN FOR UNAUTHENTICATED USERS
  // ============================================================================
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center text-xs">
        Verifying administrator session...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-[#262626] bg-[#141414] p-8 shadow-2xl">
          <div className="text-center">
            <Lock className="h-8 w-8 text-[#22c55e] mx-auto" />
            <h1 className="mt-4 text-2xl font-black">Admin Sign In</h1>
          </div>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="text"
              required
              placeholder="Username"
              className="w-full rounded-xl border border-[#262626] bg-[#0a0a0a] p-3 text-sm text-white focus:border-[#22c55e] focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full rounded-xl border border-[#262626] bg-[#0a0a0a] p-3 text-sm text-white focus:border-[#22c55e] focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-xl bg-[#16a34a] py-3 text-sm font-bold text-white hover:bg-[#15803d]"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 11. MAIN DASHBOARD UI RENDER
  // ============================================================================
  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10 font-sans print:hidden">
        <div className="mx-auto max-w-7xl">
        {/* SECTION A: TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
          <div>
            <a href="/" className="flex items-center gap-1 text-xs font-bold text-[#22c55e] hover:underline mb-2">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Store
            </a>
            <h1 className="text-3xl font-black tracking-tight">Brain Bowl Control Panel</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center gap-2 bg-[#141414] border border-[#262626] px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#1f1f1f]"
            >
              <RefreshCw className={`h-4 w-4 text-[#22c55e] ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              onClick={async () => {
                await fetch('/api/admin/logout', { method: 'POST' });
                setAuthenticated(false);
              }}
              className="flex items-center gap-1.5 bg-red-950/20 border border-red-900/40 text-red-400 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-900/30"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        {/* SECTION B: GLOBAL SHIPPING COST SETTINGS BOX */}
        <div className="mt-6 rounded-3xl border border-[#262626] bg-[#141414] p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#262626]">
            <div className="p-2.5 rounded-2xl bg-green-950/50 border border-green-800/40 text-[#22c55e]">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Global Shipping Cost Settings</h2>
              <p className="text-xs text-gray-400">
                Set shipping charge rules (Free shipping above ₹ threshold, and standard shipping fee below).
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveShippingSettings} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">
                Free Shipping Minimum Amount (₹)
              </label>
              <input
                type="number"
                required
                placeholder="999"
                className="mt-1 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] p-3 text-xs text-white focus:border-[#22c55e] focus:outline-none"
                value={shippingSettings.freeShippingMinAmount}
                onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingMinAmount: e.target.value })}
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                Free shipping applied for order total &gt; ₹{shippingSettings.freeShippingMinAmount || '999'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                required
                placeholder="99"
                className="mt-1 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] p-3 text-xs text-white focus:border-[#22c55e] focus:outline-none"
                value={shippingSettings.standardShippingFee}
                onChange={(e) => setShippingSettings({ ...shippingSettings, standardShippingFee: e.target.value })}
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                Charged on orders &lt; ₹{shippingSettings.freeShippingMinAmount || '999'}
              </span>
            </div>

            <div>
              <button
                type="submit"
                disabled={savingSettings}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] py-3 text-xs font-bold text-white shadow-lg hover:bg-[#15803d] disabled:opacity-50 transition"
              >
                <Save className="h-4 w-4" />
                {savingSettings ? 'Saving...' : 'Save Shipping Rules'}
              </button>
            </div>
          </form>
        </div>

        {/* SECTION C: NAVIGATION TABS */}
        <div className="flex items-center gap-2 mt-6 border-b border-[#262626] pb-3 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview Graphics', icon: Layers },
            { id: 'products', label: 'Product & Stock Pricing', icon: Package },
            {
              id: 'orders',
              label: `Orders & Deliveries (${orders.length})`,
              badge: orders.filter((o) => o.status === 'RETURN_REQUESTED').length,
              icon: ShoppingBag,
            },
            { id: 'users', label: `Customers (${users.length})`, icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition relative ${
                activeTab === tab.id
                  ? 'bg-[#16a34a] text-white shadow-lg'
                  : 'bg-[#141414] border border-[#262626] text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold animate-pulse">
                  {tab.badge} Return
                </span>
              )}
            </button>
          ))}
        </div>

        {/* SECTION D: OVERVIEW GRAPHICS (CHART.JS) */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6">
                <span className="text-xs font-bold uppercase text-gray-400">Total Sales</span>
                <p className="mt-3 text-3xl font-black text-white">₹{stats.totalSales.toLocaleString('en-IN')}</p>
                <span className="text-[10px] text-gray-500">Gross Sales Revenue</span>
              </div>
              <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6">
                <span className="text-xs font-bold uppercase text-gray-400">Delivered Orders</span>
                <p className="mt-3 text-3xl font-black text-emerald-400">
                  {orders.filter((o) => o.status === 'DELIVERED').length}
                </p>
                <span className="text-[10px] text-gray-500">Successfully Received</span>
              </div>
              <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6">
                <span className="text-xs font-bold uppercase text-gray-400">Return Requests</span>
                <p className="mt-3 text-3xl font-black text-amber-400">
                  {orders.filter((o) => o.status === 'RETURN_REQUESTED').length}
                </p>
                <span className="text-[10px] text-gray-500">Pending Return Actions</span>
              </div>
              <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6">
                <span className="text-xs font-bold uppercase text-gray-400">Warehouse Stock</span>
                <p className="mt-3 text-3xl font-black text-white">
                  {productForm.stock || 0} units
                </p>
                <span className="text-[10px] text-gray-500">Live Inventory Count</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 rounded-2xl border border-[#262626] bg-[#141414] p-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Monthly Revenue Chart</h3>
                <div className="h-64">
                  <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>

              <div className="rounded-2xl border border-[#262626] bg-[#141414] p-6 flex flex-col items-center justify-center">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Order Breakdown</h3>
                <div className="h-48 w-48">
                  <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION E: SINGLE PRODUCT & STOCK MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262626]">
              <div>
                <h2 className="text-xl font-black text-white">Product Price & Stock Management</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Manage the selling amount (₹), regular MRP (₹), stock inventory, and product image for the storefront.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-green-950/60 border border-green-800/50 text-green-400 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" /> Single Active Flagship Product
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Column 1: Live Store Product Preview Card */}
              <div className="lg:col-span-1 rounded-3xl border border-[#262626] bg-[#141414] overflow-hidden flex flex-col justify-between shadow-xl">
                <div>
                  <div className="h-64 w-full bg-[#0a0a0a] relative flex items-center justify-center border-b border-[#262626] p-4">
                    <img
                      src={productForm.imageUrl || '/product_image.jpeg'}
                      alt={productForm.name || 'BrainBowl Product'}
                      className="h-full w-full object-contain rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/product_image.jpeg';
                      }}
                    />
                    <span
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                        Number(productForm.stock) > 10
                          ? 'bg-green-950 text-green-400 border border-green-800'
                          : Number(productForm.stock) > 0
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}
                    >
                      {Number(productForm.stock) > 0 ? `${productForm.stock} In Stock` : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="p-6">
                    {productForm.sku && (
                      <span className="inline-flex items-center gap-1 text-[11px] bg-[#262626] text-[#d4af37] px-2.5 py-1 rounded-md font-mono mb-3 border border-[#333]">
                        <Tag className="h-3 w-3" /> SKU: {productForm.sku}
                      </span>
                    )}
                    <h3 className="font-bold text-white text-lg leading-snug">
                      {productForm.name || 'BrainBowl Superfood Makhana'}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      {productForm.description || '100% Plant-Based Superfood Makhana'}
                    </p>

                    <div className="mt-4 pt-4 border-t border-[#262626] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Selling Price:</span>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-black text-[#22c55e]">
                            ₹{Number(productForm.price || 499).toFixed(2)}
                          </p>
                          {productForm.originalPrice && Number(productForm.originalPrice) > Number(productForm.price) && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{Number(productForm.originalPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {productForm.originalPrice && Number(productForm.originalPrice) > Number(productForm.price) && (
                        <div className="flex justify-end">
                          <span className="text-[10px] font-bold text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/30">
                            {Math.round(((Number(productForm.originalPrice) - Number(productForm.price)) / Number(productForm.originalPrice)) * 100)}% OFF
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="rounded-xl bg-[#0a0a0a] p-3 text-[11px] text-gray-400 border border-[#262626]">
                    💡 Price, stock, and image updates apply immediately to the front-end homepage and checkout.
                  </div>
                </div>
              </div>

              {/* Column 2 & 3: Instant Product & Stock Editor Form */}
              <div className="lg:col-span-2 rounded-3xl border border-[#262626] bg-[#141414] p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-3 pb-5 border-b border-[#262626]">
                  <div className="p-2.5 rounded-2xl bg-green-950/50 border border-green-800/40 text-[#22c55e]">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Update Product Price & Stock</h3>
                    <p className="text-xs text-gray-400">Set selling price, MRP, warehouse inventory units, and upload product photo.</p>
                  </div>
                </div>

                <form onSubmit={handleSaveProduct} className="mt-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Selling Price */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Selling Price (₹) <span className="text-red-400">*</span>
                      </label>
                      <div className="mt-1.5 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3.5 py-3 focus-within:border-[#22c55e]">
                        <span className="text-sm font-bold text-[#22c55e] mr-2">₹</span>
                        <input
                          type="number"
                          required
                          min="1"
                          placeholder="499"
                          className="w-full bg-transparent text-sm font-bold text-white focus:outline-none"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 block">Actual customer checkout price.</span>
                    </div>

                    {/* Original MRP */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Original Price / MRP (₹)
                      </label>
                      <div className="mt-1.5 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3.5 py-3 focus-within:border-gray-500">
                        <span className="text-sm font-bold text-gray-400 mr-2">₹</span>
                        <input
                          type="number"
                          min="1"
                          placeholder="799"
                          className="w-full bg-transparent text-sm font-bold text-white focus:outline-none"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 block">Strikethrough MRP price.</span>
                    </div>

                    {/* Stock Inventory */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Stock Inventory (Units) <span className="text-red-400">*</span>
                      </label>
                      <div className="mt-1.5 flex items-center rounded-xl border border-[#262626] bg-[#0a0a0a] px-3.5 py-3 focus-within:border-[#22c55e]">
                        <Package className="h-4 w-4 text-gray-500 mr-2" />
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="500"
                          className="w-full bg-transparent text-sm font-bold text-white focus:outline-none"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 block">Physical units available in stock.</span>
                    </div>
                  </div>

                  {/* Image Upload & Link Section */}
                  <div className="rounded-2xl border border-[#262626] bg-[#0a0a0a] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Product Photo / Image (Max 1 MB)
                      </label>
                      <span className="text-[10px] font-semibold text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20">
                        Max Size: 1 MB
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      {/* Direct File Upload */}
                      <div>
                        <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#404040] bg-[#141414] p-3 text-xs font-bold text-gray-300 hover:border-[#22c55e] hover:text-white cursor-pointer transition">
                          <Upload className="h-4 w-4 text-[#22c55e]" />
                          <span>{uploadingImage ? 'Uploading...' : 'Upload Image (Max 1 MB)'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage}
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Or Direct URL Input */}
                      <div>
                        <input
                          type="text"
                          placeholder="/product_image.jpeg or https://..."
                          className="w-full rounded-xl border border-[#262626] bg-[#141414] p-3 text-xs text-white focus:border-[#22c55e] focus:outline-none"
                          value={productForm.imageUrl}
                          onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Product Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Product Display Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Brain Bowl Powder"
                        className="mt-1.5 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] p-3 text-xs text-white focus:border-[#22c55e] focus:outline-none"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      />
                    </div>

                    {/* Product SKU */}
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                        SKU Identifier
                      </label>
                      <input
                        type="text"
                        placeholder="POW-100"
                        className="mt-1.5 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] p-3 text-xs text-white focus:border-[#22c55e] focus:outline-none font-mono"
                        value={productForm.sku}
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Product Description / Benefits
                    </label>
                    <textarea
                      rows={3}
                      placeholder="100% Plant-Based Superfood Makhana with mental focus nutrients..."
                      className="mt-1.5 w-full rounded-xl border border-[#262626] bg-[#0a0a0a] p-3 text-xs text-white focus:border-[#22c55e] focus:outline-none resize-none"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    />
                  </div>

                  <div className="pt-4 border-t border-[#262626] flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-[#16a34a] px-6 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-[#15803d] transition cursor-pointer"
                    >
                      <Save className="h-4 w-4" /> Save Product Price & Stock
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* SECTION F: ORDERS, PAYMENT STATUS, DELIVERIES & RETURN MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="mt-8 rounded-2xl border border-[#262626] bg-[#141414] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Orders, Deliveries & Return Management</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Update delivery stages (`PAID` ➔ `SHIPPED` ➔ `DELIVERED`), assign AWB, and process customer return & refund requests.
                </p>
              </div>

              {/* Sub-filter tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'ALL', label: `All (${orders.length})` },
                  { id: 'ACTIVE', label: `In Transit (${orders.filter((o) => o.status === 'PAID' || o.status === 'SHIPPED').length})` },
                  { id: 'DELIVERED', label: `Delivered (${orders.filter((o) => o.status === 'DELIVERED').length})` },
                  { id: 'RETURNS', label: `Return Requests (${orders.filter((o) => o.status === 'RETURN_REQUESTED').length})`, alert: orders.filter((o) => o.status === 'RETURN_REQUESTED').length > 0 },
                  { id: 'COMPLETED_RETURNS', label: `Completed Returns (${orders.filter((o) => o.status === 'RETURNED').length})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setOrderFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      orderFilter === f.id
                        ? f.id === 'RETURNS'
                          ? 'bg-amber-500 text-black font-extrabold shadow'
                          : 'bg-[#16a34a] text-white shadow'
                        : f.alert
                        ? 'bg-amber-950/60 border border-amber-800 text-amber-300 hover:bg-amber-900/60'
                        : 'bg-[#0a0a0a] border border-[#262626] text-gray-400 hover:text-white'
                    }`}
                  >
                    {f.alert && <AlertTriangle className="h-3 w-3 animate-pulse text-amber-400" />}
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="border-b border-[#262626] text-gray-400 uppercase">
                  <tr>
                    <th className="py-3 px-3">Customer & Receipt</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Delivery & Order Status</th>
                    <th className="py-3 px-3">Saved AWB & Tracking</th>
                    <th className="py-3 px-3">Return Details & Actions</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
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

                      return (
                        <tr key={order.id} className="hover:bg-[#1a1a1a] transition">
                          <td className="py-4 px-3 font-semibold text-white">
                            <div className="flex flex-col">
                              <span>{order.customerName}</span>
                              <span className="text-[10px] text-gray-500 font-mono">#{order.receiptId || order.id.slice(0, 8)}</span>
                              <span className="text-[10px] text-gray-400">{order.customerEmail}</span>
                              {order.customerPhone && (
                                <span className="text-[10px] text-gray-500">+91 {order.customerPhone}</span>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-3 font-bold text-white">
                            ₹{(order.amount / 100).toFixed(2)}
                            {order.shippingCost ? (
                              <span className="block text-[10px] text-gray-500">+ ₹{(order.shippingCost / 100).toFixed(2)} ship</span>
                            ) : null}
                          </td>

                          {/* Dynamic Order & Delivery Status Selector */}
                          <td className="py-4 px-3">
                            <div className="flex flex-col gap-1.5 items-start">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer ${
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
                                <option value="PAID" className="bg-[#141414] text-green-400">✓ PAID & CONFIRMED</option>
                                <option value="SHIPPED" className="bg-[#141414] text-cyan-400">🚚 SHIPPED / IN TRANSIT</option>
                                <option value="DELIVERED" className="bg-[#141414] text-emerald-400">🎉 DELIVERED</option>
                                <option value="RETURN_REQUESTED" className="bg-[#141414] text-amber-400">🔄 RETURN REQUESTED</option>
                                <option value="RETURNED" className="bg-[#141414] text-purple-400">✨ RETURNED & REFUNDED</option>
                                <option value="CANCELLED" className="bg-[#141414] text-red-400">✕ CANCELLED</option>
                                <option value="PENDING" className="bg-[#141414] text-amber-400">⏳ PENDING</option>
                              </select>

                              {order.deliveredAt && order.status === 'DELIVERED' && (
                                <span className="text-[10px] text-emerald-400/80">
                                  Delivered: {new Date(order.deliveredAt).toLocaleDateString('en-IN')}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Saved AWB & Tracking Link Display with Edit Control */}
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
                                  className="w-32 rounded-lg border border-[#262626] bg-[#0a0a0a] px-2.5 py-1.5 text-xs text-white focus:border-[#22c55e] focus:outline-none"
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
                                  className="w-40 rounded-lg border border-[#262626] bg-[#0a0a0a] px-2.5 py-1.5 text-xs text-white focus:border-[#22c55e] focus:outline-none"
                                />
                                <button
                                  onClick={() => handleSaveAwbAndLink(order.id)}
                                  className="flex items-center gap-1 rounded-lg bg-[#16a34a] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#15803d]"
                                >
                                  <Save className="h-3.5 w-3.5" /> Save
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                {order.awbNumber ? (
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs text-[#22c55e] font-bold bg-green-950/40 px-2.5 py-1 rounded-md border border-green-800/40">
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
                                  className="text-xs text-gray-400 hover:text-white underline ml-2 font-semibold"
                                >
                                  {order.awbNumber ? 'Edit' : '+ Add AWB'}
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Return Request Details & Processing Actions */}
                          <td className="py-4 px-3">
                            {order.status === 'RETURN_REQUESTED' ? (
                              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 space-y-2 min-w-[220px]">
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
                                  <div className="flex items-center justify-between bg-[#0a0a0a] p-1.5 rounded-lg border border-[#262626]">
                                    <span className="font-mono text-[10px] text-[#22c55e] truncate max-w-[130px]" title={order.returnUpi}>
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
                                    className="flex-1 rounded-lg bg-green-700 hover:bg-green-600 px-2 py-1 text-[11px] font-bold text-white transition flex items-center justify-center gap-1"
                                    title="Approve Return and Mark Refund as Processed"
                                  >
                                    <Check className="h-3 w-3" /> Approve & Refund
                                  </button>
                                  <button
                                    onClick={() => handleRejectReturn(order.id)}
                                    className="rounded-lg bg-red-950/60 border border-red-800/60 hover:bg-red-900/60 px-2 py-1 text-[11px] font-bold text-red-300 transition flex items-center justify-center gap-1"
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
                                    Refunded to: {order.returnUpi}
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

                          <td className="py-4 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'RETURN_REQUESTED' || order.status === 'RETURNED' ? (
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
                                  className="rounded-lg bg-[#262626] border border-gray-700 p-2 text-gray-300 hover:bg-[#333] hover:text-white transition cursor-pointer"
                                  title="Generate / Print Tax Invoice"
                                >
                                  <FileText className="h-4 w-4 text-[#d4af37]" />
                                </button>
                              ) : (
                                <span
                                  className="rounded-lg bg-[#1a1a1a] border border-gray-800 p-2 text-gray-600 opacity-40 cursor-not-allowed inline-flex items-center justify-center"
                                  title="Invoice only available for PAID orders"
                                >
                                  <FileText className="h-4 w-4 text-gray-600" />
                                </span>
                              )}
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="rounded-lg bg-red-950/40 border border-red-800/50 p-2 text-red-400 hover:bg-red-900/60 transition"
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

        {/* SECTION G: CUSTOMERS TAB (WITH SEARCH & PAGINATION) */}
        {activeTab === 'users' && (
          <div className="mt-8 rounded-2xl border border-[#262626] bg-[#141414] p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-white">Registered Accounts ({filteredUsers.length})</h2>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  className="w-full rounded-xl border border-[#262626] bg-[#0a0a0a] pl-9 pr-3 py-2 text-xs text-white focus:border-[#22c55e] focus:outline-none"
                  value={userSearchQuery}
                  onChange={(e) => {
                    setUserSearchQuery(e.target.value);
                    setUserPage(1);
                  }}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="border-b border-[#262626] text-gray-400 uppercase">
                  <tr>
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Phone</th>
                    <th className="py-3 px-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#1a1a1a]">
                        <td className="py-3 px-3 font-semibold text-white">{u.name}</td>
                        <td className="py-3 px-3 text-gray-400">{u.email}</td>
                        <td className="py-3 px-3 text-gray-400">{u.phone}</td>
                        <td className="py-3 px-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-500">
                        No customers match your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredUsers.length > USERS_PER_PAGE && (
              <div className="flex items-center justify-between border-t border-[#262626] pt-4 mt-4 text-xs">
                <span className="text-gray-500">
                  Showing {(userPage - 1) * USERS_PER_PAGE + 1} to {Math.min(userPage * USERS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
                    disabled={userPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-[#262626] bg-[#0a0a0a] text-white disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setUserPage((p) => Math.min(p + 1, Math.ceil(filteredUsers.length / USERS_PER_PAGE)))}
                    disabled={userPage >= Math.ceil(filteredUsers.length / USERS_PER_PAGE)}
                    className="px-3 py-1.5 rounded-lg border border-[#262626] bg-[#0a0a0a] text-white disabled:opacity-40"
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

    {/* Reusable Tax Invoice Modal for Admin */}
    <InvoiceModal
      isOpen={invoiceModalOpen}
      order={selectedInvoiceOrder}
      onClose={() => {
        setInvoiceModalOpen(false);
        setSelectedInvoiceOrder(null);
      }}
    />
  </>
  );
}