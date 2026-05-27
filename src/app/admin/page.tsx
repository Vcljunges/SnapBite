"use client";

import { useState, useEffect } from "react";
import { Flame, LayoutDashboard, ShoppingBag, Package, Users, Plus, Edit, Trash2, X, LogOut, Home, DollarSign, Clock, CheckCircle2, TrendingUp, AlertTriangle, Play, ShieldAlert, RefreshCw, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { User } from "../types/User";
import { Product } from "../types/Product";
import { Order } from "../types/Order";
import { usersList } from "../data/usersList";
import { productsList } from "../data/productsList";
import { ordersList } from "../data/ordersList";

export default function Admin() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "products" | "users">("dashboard");

  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategory, setPCategory] = useState("burgers");
  const [pDescription, setPDescription] = useState("");
  const [pImage, setPImage] = useState("");
  const [pBadge, setPBadge] = useState("");
  const [pTag, setPTag] = useState("");
  const [pAvailable, setPAvailable] = useState(true);



  useEffect(() => {
    const activeUser = localStorage.getItem("snapbite_current_user");
    if (activeUser) {
      const parsedUser: User = JSON.parse(activeUser);
      setCurrentUser(parsedUser);
      if (parsedUser.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }

    loadData();
  }, []);

  const loadData = () => {
    const usersRaw = localStorage.getItem("snapbite_users");
    const loadedUsers: User[] = usersRaw ? JSON.parse(usersRaw) : usersList;
    setUsers(loadedUsers);
    const productsRaw = localStorage.getItem("snapbite_products");
    const loadedProducts: Product[] = productsRaw ? JSON.parse(productsRaw) : productsList;
    setProducts(loadedProducts);
    const allOrders: Order[] = [];
    const seenIds = new Set<string>();
    loadedUsers.forEach(u => {
      const userOrdersRaw = localStorage.getItem(`snapbite_orders_${u.id}`);
      if (userOrdersRaw) {
        (JSON.parse(userOrdersRaw) as Order[]).forEach(o => {
          if (!seenIds.has(o.id)) { seenIds.add(o.id); allOrders.push(o); }
        });
      } else if (u.id === "u1") {
        ordersList.forEach(o => {
          if (!seenIds.has(o.id)) { seenIds.add(o.id); allOrders.push(o); }
        });
      }
    });
    allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setOrders(allOrders);
  };
  const nextStatuses: Record<string, string> = {
    pending: "production",
    production: "sent",
    sent: "delivered",
  };

  const statusLabels: Record<string, string> = {
    pending: "Pendente",
    production: "Em Produção",
    sent: "A Caminho",
    delivered: "Entregue",
    cancelled: "Cancelado",
  };

  const statusBgs: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    production: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    sent: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
        
        let label = statusLabels[newStatus] || "Status atualizado";
        const newHistory = [...o.statusHistory, { status: newStatus, time: timeStr, label }];
        
        const updated = {
          ...o,
          status: newStatus,
          statusHistory: newHistory
        };
        const userOrdersRaw = localStorage.getItem(`snapbite_orders_${o.userId}`);
        let userOrders: Order[] = [];
        if (userOrdersRaw) {
          userOrders = JSON.parse(userOrdersRaw);
        } else if (o.userId === "u1") {
          userOrders = [...ordersList];
        }

        const index = userOrders.findIndex(uo => uo.id === orderId);
        if (index > -1) {
          userOrders[index] = updated;
        } else {
          userOrders.unshift(updated);
        }
        localStorage.setItem(`snapbite_orders_${o.userId}`, JSON.stringify(userOrders));
        
        return updated;
      }
      return o;
    });

    setOrders(updatedOrders);
    
    if (selectedOrder && selectedOrder.id === orderId) {
      const order = updatedOrders.find(o => o.id === orderId);
      if (order) setSelectedOrder(order);
    }
  };

  const handleOpenProductModal = (product: Product | null = null) => {
    setSelectedProduct(product);
    if (product) {
      setPName(product.name);
      setPPrice(String(product.price));
      setPCategory(product.category);
      setPDescription(product.description);
      setPImage(product.image);
      setPBadge(product.badge || "");
      setPTag(product.tag || "");
      setPAvailable(product.available);
    } else {
      setPName("");
      setPPrice("");
      setPCategory("burgers");
      setPDescription("");
      setPImage("");
      setPBadge("");
      setPTag("");
      setPAvailable(true);
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pName || !pPrice) {
      alert("Por favor, preencha o nome e o preço.");
      return;
    }

    let updatedProducts = [...products];

    if (selectedProduct) {
      updatedProducts = products.map(p => {
        if (p.id === selectedProduct.id) {
          return {
            ...p,
            name: pName,
            price: Number(pPrice),
            category: pCategory,
            description: pDescription,
            image: pImage || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
            badge: pBadge,
            tag: pTag,
            available: pAvailable
          };
        }
        return p;
      });
    } else {
      const prefix = pCategory.substring(0, 1);
      const newId = `${prefix}-${Date.now().toString().slice(-4)}`;
      const newProduct: Product = {
        id: newId,
        name: pName,
        price: Number(pPrice),
        category: pCategory,
        description: pDescription,
        image: pImage || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        badge: pBadge,
        tag: pTag,
        available: pAvailable,
        rating: 5.0
      };
      updatedProducts.push(newProduct);
    }

    setProducts(updatedProducts);
    localStorage.setItem("snapbite_products", JSON.stringify(updatedProducts));
    window.dispatchEvent(new Event("storage"));
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    const confirmDelete = window.confirm("Deseja realmente excluir este produto?");
    if (!confirmDelete) return;

    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem("snapbite_products", JSON.stringify(updatedProducts));
    window.dispatchEvent(new Event("storage"));
  };

  const handleToggleProductAvailability = (productId: string) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        return { ...p, available: !p.available };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem("snapbite_products", JSON.stringify(updatedProducts));
    window.dispatchEvent(new Event("storage"));
  };

  const handleToggleUserRole = (userId: string) => {
    if (currentUser && currentUser.id === userId) {
      alert("Você não pode remover seu próprio cargo de administrador.");
      return;
    }

    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          role: u.role === "admin" ? "customer" : "admin"
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    localStorage.setItem("snapbite_users", JSON.stringify(updatedUsers));
  };

  const handleLogout = () => {
    localStorage.removeItem("snapbite_current_user");
    window.location.href = "/login";
  };

  const totalRevenue = orders
    .filter(o => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === "pending" || o.status === "production" || o.status === "sent").length;
  const activeProductsCount = products.filter(p => p.available).length;
  const totalUsersCount = users.length;
  const avgOrderValue = orders.length > 0 ? (totalRevenue / orders.filter(o => o.status === "delivered").length || 0) : 0;

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          o.id.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesFilter = orderFilter === "all" || o.status === orderFilter;
    return matchesSearch && matchesFilter;
  });
  const filteredProducts = products.filter(p => {
    return productFilter === "all" || p.category === productFilter;
  });

  if (isAdmin === false) {
    return (
      <div className="flex flex-col min-h-screen bg-black font-sans items-center justify-center relative px-4">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-zinc-950/80 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl relative z-10 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-500">
            <ShieldAlert size={36} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Acesso Restrito</h2>
          <p className="text-zinc-400 text-sm font-medium">
            Você não possui privilégios de administrador para acessar esta página. Por favor, faça login com uma conta administrativa.
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <Link 
              href="/login" 
              className="bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg cursor-pointer uppercase tracking-wider text-sm block"
            >
              Fazer Login
            </Link>
            <Link 
              href="/" 
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer uppercase tracking-wider text-sm block"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center">
        <div className="text-white font-bold flex items-center gap-3">
          <RefreshCw className="animate-spin text-orange-500" /> Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black font-sans text-white">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <aside className="w-full md:w-64 bg-zinc-950/80 border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between backdrop-blur-xl relative z-20">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Flame size={28} fill="white" className="bg-orange-500 text-white p-1 rounded-lg" />
            <span className="text-xl font-black uppercase tracking-tighter">SnapBite Admin</span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer relative ${
                activeTab === "orders"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShoppingBag size={18} />
              Pedidos
              {pendingOrdersCount > 0 && (
                <span className="absolute right-4 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-zinc-950">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer ${
                activeTab === "products"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Package size={18} />
              Cardápio
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users size={18} />
              Usuários
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/5 mt-6 md:mt-0 space-y-4">
          <div className="flex items-center gap-2.5 px-2">
            <div className="bg-orange-500/10 text-orange-500 w-8 h-8 rounded-lg flex items-center justify-center font-black">
              A
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">Administrador</p>
            </div>
          </div>
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Home size={16} />
            Ver Loja
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-zinc-400 hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-6 md:p-10 relative overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        
        {/* TAB: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-10 animate-fade-in">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Resumo do Negócio</h2>
              <p className="text-zinc-400 text-sm font-medium mt-1">Estatísticas em tempo real com base no armazenamento local.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-orange-500/20 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-[20px] group-hover:bg-orange-500/10 transition-colors" />
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Receita Entregue</span>
                    <span className="text-2xl font-black block">R$ {totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="bg-orange-500/10 text-orange-500 p-3 rounded-2xl">
                    <DollarSign size={20} />
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-orange-500/20 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-[20px] group-hover:bg-orange-500/10 transition-colors" />
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Pedidos Totais</span>
                    <span className="text-2xl font-black block">{orders.length}</span>
                  </div>
                  <div className="bg-orange-500/10 text-orange-500 p-3 rounded-2xl">
                    <ShoppingBag size={20} />
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-orange-500/20 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-[20px] group-hover:bg-orange-500/10 transition-colors" />
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Pendentes/Produção</span>
                    <span className="text-2xl font-black block">{pendingOrdersCount}</span>
                  </div>
                  <div className="bg-orange-500/10 text-orange-500 p-3 rounded-2xl">
                    <Clock size={20} />
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-orange-500/20 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-[20px] group-hover:bg-orange-500/10 transition-colors" />
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Ticket Médio</span>
                    <span className="text-2xl font-black block">R$ {avgOrderValue.toFixed(2)}</span>
                  </div>
                  <div className="bg-orange-500/10 text-orange-500 p-3 rounded-2xl">
                    <TrendingUp size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Layout divided: Recent orders & stats review */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders List */}
              <div className="lg:col-span-2 bg-zinc-900/40 border border-white/5 p-6 rounded-3xl space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black uppercase tracking-tighter">Pedidos Recentes</h3>
                  <button 
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-orange-500 hover:text-orange-400 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Ver todos
                  </button>
                </div>

                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-zinc-500 text-sm text-center py-6">Nenhum pedido registrado.</p>
                  ) : (
                    orders.slice(0, 5).map(o => (
                      <div 
                        key={o.id}
                        onClick={() => setSelectedOrder(o)}
                        className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="space-y-1">
                            <span className="text-sm font-bold text-orange-500">{o.id}</span>
                            <p className="text-xs font-semibold text-white">{o.customerName}</p>
                            <p className="text-[10px] text-zinc-500">
                              {o.items.length} {o.items.length === 1 ? "item" : "itens"} • R$ {o.total.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusBgs[o.status] || ""}`}>
                            {statusLabels[o.status] || o.status}
                          </span>
                          <ChevronRight size={16} className="text-zinc-500 hidden sm:block" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick inventory summary / items availability */}
              <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl space-y-6">
                <h3 className="text-lg font-black uppercase tracking-tighter">Cardápio & Usuários</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-500/10 text-orange-500 p-2.5 rounded-xl">
                        <Package size={16} />
                      </div>
                      <span className="text-sm font-bold text-zinc-300">Produtos no Menu</span>
                    </div>
                    <span className="font-black text-white">{products.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/10 text-emerald-500 p-2.5 rounded-xl">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-sm font-bold text-zinc-300">Disponíveis</span>
                    </div>
                    <span className="font-black text-emerald-500">{activeProductsCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-500/10 text-red-500 p-2.5 rounded-xl">
                        <AlertTriangle size={16} />
                      </div>
                      <span className="text-sm font-bold text-zinc-300">Indisponíveis</span>
                    </div>
                    <span className="font-black text-red-500">{products.length - activeProductsCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/10 text-blue-500 p-2.5 rounded-xl">
                        <Users size={16} />
                      </div>
                      <span className="text-sm font-bold text-zinc-300">Usuários Cadastrados</span>
                    </div>
                    <span className="font-black text-white">{totalUsersCount}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handleOpenProductModal()}
                    className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider shadow-lg"
                  >
                    <Plus size={16} /> Novo Produto
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Pedidos Recibidos</h2>
                <p className="text-zinc-400 text-sm font-medium mt-1">Gerencie a preparação e entrega de todos os pedidos.</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Buscar por cliente ou ID..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl focus:border-orange-500 focus:outline-none text-sm text-white placeholder-zinc-500 transition-colors"
                />
                <Search size={16} className="text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-white/5">
              {[
                { id: "all", label: "Todos" },
                { id: "pending", label: "Pendente" },
                { id: "production", label: "Em Produção" },
                { id: "sent", label: "A Caminho" },
                { id: "delivered", label: "Entregue" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setOrderFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    orderFilter === tab.id
                      ? "bg-white/10 text-white border border-white/20"
                      : "text-zinc-400 hover:text-white bg-transparent border border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders Table/Cards */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-zinc-900/20 rounded-3xl border border-white/5">
                  <ShoppingBag size={48} className="text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-500 font-bold">Nenhum pedido encontrado.</p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div 
                    key={order.id}
                    className="bg-zinc-900/30 border border-white/5 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-colors"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-orange-500">{order.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${statusBgs[order.status] || ""}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                        <div>
                          <p className="text-[10px] text-zinc-500">Cliente</p>
                          <p className="text-sm font-bold text-white">{order.customerName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-500">Contato</p>
                          <p className="text-xs font-semibold text-zinc-300">{order.customerPhone}</p>
                        </div>
                        <div className="sm:col-span-2 mt-1">
                          <p className="text-[10px] text-zinc-500 font-medium">Itens</p>
                          <p className="text-xs text-zinc-300 font-semibold truncate max-w-md">
                            {order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Total</span>
                        <span className="text-lg font-black text-white">R$ {order.total.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-white/5 hover:bg-white/10 text-white font-black text-xs px-4 py-3 rounded-xl transition-all cursor-pointer uppercase tracking-wider border border-white/10"
                        >
                          Detalhes
                        </button>
                        
                        {nextStatuses[order.status] && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, nextStatuses[order.status])}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-black text-xs px-4 py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
                          >
                            <Play size={12} fill="white" /> Avançar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: PRODUCTS */}
        {activeTab === "products" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Gerenciar Cardápio</h2>
                <p className="text-zinc-400 text-sm font-medium mt-1">Adicione, edite ou remova produtos cadastrados.</p>
              </div>

              <button
                onClick={() => handleOpenProductModal(null)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
              >
                <Plus size={18} /> Novo Produto
              </button>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-white/5">
              {[
                { id: "all", label: "Todos" },
                { id: "burgers", label: "Hambúrgueres" },
                { id: "pizzas", label: "Pizzas" },
                { id: "hotdogs", label: "Hot Dogs" },
                { id: "drinks", label: "Bebidas" }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setProductFilter(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    productFilter === cat.id
                      ? "bg-white/10 text-white border border-white/20"
                      : "text-zinc-400 hover:text-white bg-transparent border border-transparent"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div 
                  key={product.id}
                  className={`bg-zinc-900/35 border border-white/5 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between hover:border-orange-500/10 transition-colors ${
                    !product.available ? "opacity-60" : ""
                  }`}
                >
                  <div>
                    {/* Image */}
                    <div className="relative w-full h-40 bg-zinc-950 rounded-2xl overflow-hidden mb-4 border border-white/5">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                      {product.tag && (
                        <div className="absolute top-3 left-3 bg-orange-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-lg border border-orange-400/20">
                          {product.tag}
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{product.category}</span>
                        <h4 className="text-lg font-black text-white line-clamp-1">{product.name}</h4>
                      </div>
                      <span className="text-base font-black text-orange-500">R$ {product.price.toFixed(2)}</span>
                    </div>

                    <p className="text-zinc-400 text-xs mt-2 line-clamp-2 min-h-8">{product.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                    {/* Toggle available */}
                    <button
                      onClick={() => handleToggleProductAvailability(product.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                        product.available
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-zinc-800 text-zinc-500 border-zinc-700 hover:bg-zinc-700"
                      }`}
                    >
                      {product.available ? "Disponível" : "Indisponível"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenProductModal(product)}
                        className="p-2 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-lg border border-white/10 transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-lg border border-red-500/10 transition-colors cursor-pointer"
                        title="Deletar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: USERS */}
        {activeTab === "users" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Gerenciar Usuários</h2>
              <p className="text-zinc-400 text-sm font-medium mt-1">Gerencie cargos administrativos de usuários do sistema.</p>
            </div>

            {/* Users table */}
            <div className="bg-zinc-900/25 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-xs font-bold text-zinc-500 uppercase tracking-wider bg-zinc-950/40">
                      <th className="p-5">Nome</th>
                      <th className="p-5">Email / Telefone</th>
                      <th className="p-5">Cargo</th>
                      <th className="p-5">Endereço</th>
                      <th className="p-5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors text-sm">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                              u.role === "admin" 
                                ? "bg-orange-500 text-white" 
                                : "bg-zinc-800 text-zinc-400"
                            }`}>
                              {u.name.substring(0, 2)}
                            </div>
                            <span className="font-bold text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="p-5 space-y-0.5">
                          <p className="font-medium text-white">{u.email}</p>
                          <p className="text-xs text-zinc-500">{u.phone}</p>
                        </td>
                        <td className="p-5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            u.role === "admin"
                              ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                              : "bg-zinc-800 text-zinc-500 border-zinc-700"
                          }`}>
                            {u.role === "admin" ? "Administrador" : "Cliente"}
                          </span>
                        </td>
                        <td className="p-5 text-xs text-zinc-400 max-w-xs truncate" title={u.address}>
                          {u.address}
                        </td>
                        <td className="p-5 text-right">
                          <button
                            onClick={() => handleToggleUserRole(u.id)}
                            className="bg-white/5 hover:bg-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all border border-white/10 cursor-pointer"
                          >
                            Alternar Cargo
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setSelectedOrder(null)}
          />
          
          <div className="relative w-full md:w-[500px] h-full bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col animate-slide-in text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Detalhes do Pedido</h3>
                <span className="text-sm font-bold text-orange-500 mt-1 block">{selectedOrder.id}</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {/* Customer summary */}
              <div className="space-y-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Informações do Cliente</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Nome</span>
                    <span className="font-bold text-white">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Telefone</span>
                    <span className="font-bold text-zinc-300">{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-zinc-500 block">Email</span>
                    <span className="font-medium text-zinc-300">{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-zinc-500 block">Endereço de Entrega</span>
                    <span className="font-medium text-zinc-300 text-xs block leading-relaxed">{selectedOrder.address}</span>
                  </div>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Itens do Pedido</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/5 p-3.5 rounded-xl border border-white/5 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500 font-bold">{item.quantity}x</span>
                        <span className="font-semibold text-white">{item.name}</span>
                      </div>
                      <span className="font-bold text-zinc-300">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes & Payment method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Pagamento</span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {selectedOrder.payment.method === "credit_card" 
                      ? "Cartão de Crédito" 
                      : selectedOrder.payment.method === "debit_card" 
                        ? "Cartão de Débito" 
                        : "PIX"}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-bold block">✓ Aprovado</span>
                </div>
                
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Observações</span>
                  <p className="text-xs text-zinc-300 italic min-h-6">
                    {selectedOrder.notes || "Nenhuma observação informada."}
                  </p>
                </div>
              </div>

              {/* Timeline status history */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Histórico de Status</h4>
                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                  {selectedOrder.statusHistory.map((history, idx) => (
                    <div key={idx} className="flex items-start gap-4 relative z-10 pl-1 text-xs">
                      <div className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg shadow-orange-500/10 shrink-0">
                        ✓
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white">{history.label}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{history.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer with actions */}
            <div className="p-6 border-t border-white/10 bg-zinc-950/90 backdrop-blur-xl space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-zinc-500">Subtotal</span>
                <span className="text-white">R$ {selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-zinc-500">Taxa de Entrega</span>
                <span className="text-orange-500">R$ {selectedOrder.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-3">
                <span className="text-zinc-400 font-bold">Total</span>
                <span className="text-2xl font-black text-white">R$ {selectedOrder.total.toFixed(2)}</span>
              </div>

              {/* Transition actions */}
              <div className="flex gap-2 pt-2">
                {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, "cancelled")}
                    className="flex-1 bg-red-600/10 hover:bg-red-600/20 text-red-500 font-black py-3.5 rounded-xl transition-all border border-red-500/20 cursor-pointer uppercase tracking-wider text-xs"
                  >
                    Cancelar Pedido
                  </button>
                )}

                {nextStatuses[selectedOrder.status] && (
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, nextStatuses[selectedOrder.status])}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/25 cursor-pointer uppercase tracking-wider text-xs"
                  >
                    Avançar para: {statusLabels[nextStatuses[selectedOrder.status]]}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsProductModalOpen(false)}
          />

          <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl relative z-10 overflow-hidden text-white animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-black uppercase tracking-tighter">
                {selectedProduct ? "Editar Produto" : "Novo Produto"}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scroll form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nome do Produto</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="Ex: Classic Smash"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:outline-none text-sm text-white placeholder-zinc-600 transition-colors"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    placeholder="Ex: 32.90"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:outline-none text-sm text-white placeholder-zinc-600 transition-colors"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Categoria</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl focus:border-orange-500 focus:outline-none text-sm text-white transition-colors"
                  >
                    <option value="burgers">Hambúrgueres</option>
                    <option value="pizzas">Pizzas</option>
                    <option value="hotdogs">Hot Dogs</option>
                    <option value="drinks">Bebidas</option>
                  </select>
                </div>

                {/* Badge */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Badge (ex: Mais Pedido, Novo)</label>
                  <input
                    type="text"
                    value={pBadge}
                    onChange={(e) => setPBadge(e.target.value)}
                    placeholder="Sem badge se vazio"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:outline-none text-sm text-white placeholder-zinc-600 transition-colors"
                  />
                </div>

                {/* Tag */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tag (ex: Novidade, Promoção)</label>
                  <input
                    type="text"
                    value={pTag}
                    onChange={(e) => setPTag(e.target.value)}
                    placeholder="Sem tag se vazio"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:outline-none text-sm text-white placeholder-zinc-600 transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Descrição</label>
                  <textarea
                    rows={2}
                    value={pDescription}
                    onChange={(e) => setPDescription(e.target.value)}
                    placeholder="Ingredientes e detalhes..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:outline-none text-sm text-white placeholder-zinc-600 transition-colors resize-none"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Link da Imagem (URL Unsplash/Web)</label>
                  <input
                    type="url"
                    value={pImage}
                    onChange={(e) => setPImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:outline-none text-sm text-white placeholder-zinc-600 transition-colors"
                  />
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2 sm:col-span-2 py-2">
                  <input
                    type="checkbox"
                    id="available-check"
                    checked={pAvailable}
                    onChange={(e) => setPAvailable(e.target.checked)}
                    className="w-4 h-4 text-orange-500 bg-white/5 border-white/10 rounded focus:ring-orange-500 focus:ring-offset-zinc-950"
                  />
                  <label htmlFor="available-check" className="text-xs font-bold text-zinc-300 uppercase tracking-wider cursor-pointer select-none">
                    Produto disponível para venda imediata
                  </label>
                </div>

                {/* Live Preview */}
                {pImage && (
                  <div className="sm:col-span-2 space-y-1.5 border-t border-white/5 pt-4">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Preview da Imagem</label>
                    <div className="w-full h-32 rounded-xl overflow-hidden border border-white/5">
                      <img src={pImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal actions */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black py-3 rounded-xl transition-all border border-white/10 cursor-pointer uppercase tracking-wider text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/25 cursor-pointer uppercase tracking-wider text-xs"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL STYLES & ANIMATIONS */}
      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
