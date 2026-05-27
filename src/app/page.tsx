"use client";

import { Flame, History, LogOut, ShoppingBag, UserIcon, Clock, CheckCircle2, Search, HamburgerIcon, PizzaIcon, CupSodaIcon, Star, Plus, X, Trash2, ArrowLeft, CreditCard, DollarSign, UserPlus, LayoutDashboard } from "lucide-react";
import { HotDogIcon } from "./Icons/HotDog";
import { useState, useEffect } from "react";
import { productsList } from "./data/productsList";
import { Product } from "./types/Product";
import { Order } from "./types/Order";
import { ordersList } from "./data/ordersList";
import { User } from "./types/User";
import { usersList } from "./data/usersList";
import { toNamespacedPath } from "path";

export default function Home() {

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<(Product & { quantity: number })[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutPayment, setCheckoutPayment] = useState("pix");
  const [checkoutNotes, setCheckoutNotes] = useState("");

  useEffect(() => {
    const savedProducts = localStorage.getItem("snapbite_products");
    if (!savedProducts) {
      localStorage.setItem("snapbite_products", JSON.stringify(productsList));
      setProducts(productsList);
    } else {
      setProducts(JSON.parse(savedProducts));
    }

    const savedUsers = localStorage.getItem("snapbite_users");
    if (!savedUsers) {
      localStorage.setItem("snapbite_users", JSON.stringify(usersList));
    }

    const activeUser = localStorage.getItem("snapbite_current_user");
    if (activeUser) {
      const parsed = JSON.parse(activeUser);
      setCurrentUser(parsed);
      setCheckoutName(parsed.name);
      setCheckoutPhone(parsed.phone);
      setCheckoutAddress(parsed.address);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (currentUser && e.key === `snapbite_orders_${currentUser.id}`) {
        if (e.newValue) {
          setOrders(JSON.parse(e.newValue));
        }
      }
      if (e.key === "snapbite_products" && e.newValue) {
        setProducts(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const key = `snapbite_orders_${currentUser.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setOrders(JSON.parse(saved));
      } else {
        if (currentUser.id === "u1") {
          localStorage.setItem(key, JSON.stringify(ordersList));
          setOrders(ordersList);
        } else {
          setOrders([]);
        }
      }
    } else {
      setOrders([]);
    }
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("snapbite_current_user");
    setCurrentUser(null);
    setOrders([]);
    setCheckoutName("");
    setCheckoutPhone("");
    setCheckoutAddress("");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => {
        let changed = false;
        const updated = prevOrders.map(order => {
          if (order.status !== "delivered") {
            changed = true;
            let nextStatus = "delivered";
            let label = "Entregue";

            if (order.status === "pending") {
              nextStatus = "production";
              label = "Em produção";
            } else if (order.status === "production") {
              nextStatus = "sent";
              label = "Saiu para entrega";
            } else if (order.status === "sent") {
              nextStatus = "delivered";
              label = "Entregue";
            }

            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

            return {
              ...order,
              status: nextStatus,
              statusHistory: [
                ...order.statusHistory,
                { status: nextStatus, time: timeStr, label }
              ]
            };
          }
          return order;
        });

        if (changed) {
          const userJson = localStorage.getItem("snapbite_current_user");
          if (userJson) {
            const user = JSON.parse(userJson);
            localStorage.setItem(`snapbite_orders_${user.id}`, JSON.stringify(updated));
          }
          return updated;
        }
        return prevOrders;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0 || !currentUser) return;

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = 5.0;
    const total = subtotal + deliveryFee;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const newOrderSuffix = String(orders.length + 1).padStart(3, "0");
    const newOrderId = `ORD-${newOrderSuffix}`;

    const newOrder: Order = {
      id: newOrderId,
      userId: currentUser.id,
      customerName: checkoutName,
      customerPhone: checkoutPhone,
      customerEmail: currentUser.email,
      address: checkoutAddress,
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal,
      deliveryFee,
      total,
      payment: { method: checkoutPayment, status: "approved" },
      status: "pending",
      statusHistory: [
        { status: "pending", time: timeStr, label: "Pedido realizado" }
      ],
      createdAt: now.toISOString(),
      estimatedTime: "30-45 min",
      notes: checkoutNotes
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem(`snapbite_orders_${currentUser.id}`, JSON.stringify(updatedOrders));

    setCartItems([]);
    setIsCartOpen(false);
    setIsCheckoutStep(false);
    setIsHistoryOpen(true);
  };

  const handleReorder = (order: Order) => {
    setCartItems(prev => {
      let updatedCart = [...prev];
      order.items.forEach(orderItem => {
        const productInfo = products.find(p => p.id === orderItem.productId);
        const existing = updatedCart.find(item => item.id === orderItem.productId);

        if (existing) {
          existing.quantity += orderItem.quantity;
        } else {
          updatedCart.push({
            id: orderItem.productId,
            name: orderItem.name,
            price: orderItem.price,
            quantity: orderItem.quantity,
            category: productInfo?.category || "burgers",
            description: productInfo?.description || "",
            image: productInfo?.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
            rating: productInfo?.rating || 4.5,
            available: productInfo?.available ?? true,
            badge: productInfo?.badge || "",
            tag: productInfo?.tag || ""
          });
        }
      });
      return updatedCart;
    });

    setIsHistoryOpen(false);
    setIsCartOpen(true);
  };
  const [cartOpen, setCartOpen] = useState(false);
  const [productSelected, setProductSelected] = useState<Product | undefined>(undefined);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const searchedProducts = filteredProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    setProductSelected(product);
    setCartOpen(true);
  };

  const handleCloseCart = () => {
    setCartOpen(false);
    setProductSelected(undefined);
  };

  const handleClickCart = () => {
    setCartOpen(!cartOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black font-sans overflow-hidden">
      <header className="flex flex-row items-center justify-between w-full px-6 md:px-10 py-6 bg-black/40 backdrop-blur-xl fixed top-0 z-50 border-b border-white/10">
        <div className="flex flex-row items-center justify-center gap-4">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 text-2xl md:text-3xl font-black text-white tracking-tighter hover:text-orange-500 transition-all hover:scale-105 active:scale-95 cursor-pointer">
            <Flame size={32} fill="white" className="bg-orange-500 text-white p-1.5 rounded-xl shadow-lg shadow-orange-500/20" />
            SnapBite
          </button>
        </div>

        <nav className="hidden md:flex flex-row items-center gap-8">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-all cursor-pointer uppercase tracking-widest transform hover:scale-105 active:scale-95"
          >
            <History size={20} />
            Meus Pedidos
          </button>
          {currentUser ? (
            <>
              {currentUser.role === "admin" && (
                <button
                  onClick={() => window.location.href = "/admin"}
                  className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-all cursor-pointer uppercase tracking-widest transform hover:scale-105 active:scale-95"
                >
                  <LayoutDashboard size={20} />
                  Admin
                </button>
              )}
              <div className="flex items-center gap-2 text-sm font-bold text-orange-500 uppercase tracking-widest">
                <UserIcon size={20} className="bg-orange-500/10 text-orange-500 p-0.5 rounded-md" />
                Olá, {currentUser.name.split(" ")[0]}
              </div>
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded font-black transition-all transform hover:scale-105 active:scale-95 shadow-xl cursor-pointer relative"
              >
                <ShoppingBag size={18} />
                CARRINHO
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-orange-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-red-500 transition-all cursor-pointer uppercase tracking-widest transform hover:scale-105 active:scale-95"
              >
                <LogOut size={20} />
                Sair
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => window.location.href = "/login"}
                className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-all cursor-pointer uppercase tracking-widest transform hover:scale-105 active:scale-95"
              >
                <UserIcon size={20} />
                Entrar
              </button>
              <button
                onClick={() => window.location.href = "/register"}
                className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-all cursor-pointer uppercase tracking-widest transform hover:scale-105 active:scale-95"
              >
                <UserPlus size={20} />
                Cadastrar
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded font-black transition-all transform hover:scale-105 active:scale-95 shadow-xl cursor-pointer relative"
              >
                <ShoppingBag size={18} />
                CARRINHO
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-orange-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </button>
            </>
          )}
        </nav>

        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="text-white p-2 hover:text-orange-500 transition-colors cursor-pointer"
          >
            <History size={24} />
          </button>
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="text-zinc-400 p-2 hover:text-red-500 transition-colors cursor-pointer"
              title="Sair"
            >
              <LogOut size={24} />
            </button>
          ) : (
            <button
              onClick={() => window.location.href = "/login"}
              className="text-zinc-400 p-2 hover:text-white transition-colors cursor-pointer"
              title="Entrar"
            >
              <UserIcon size={24} />
            </button>
          )}
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-white p-2 relative hover:text-orange-500 transition-colors cursor-pointer"
          >
            <ShoppingBag size={24} />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-black">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="relative flex flex-col flex-1">
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000&auto=format&fit=crop"
              className="w-full h-full object-cover scale-105 animate-pulse-slow"
              alt="SnapBite Hero"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
          </div>

          <div className="relative z-10 flex flex-col items-start justify-center h-full px-6 md:px-20 max-w-7xl mx-auto w-full">

            <h1 className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 text-3xl md:text-5xl font-serif text-white tracking-tighter leading-none drop-shadow-2xl uppercase">
              <span className="text-orange-500">SnapBite</span>
              <span>Delivery</span>
              <Flame size={60} fill="#f97316" className="text-orange-600 drop-shadow-[0_0_30px_rgba(249,115,22,0.8)] hidden md:block" />
            </h1>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="flex flex-row items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 px-10 py-5 rounded-full font-black text-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-tighter">
                <Clock size={24} className="text-orange-500" />
                30-45 MIN
              </button>
              <button className="flex flex-row items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 px-10 py-5 rounded-full font-black text-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-tighter">
                <CheckCircle2 size={24} className="text-orange-500" />
                ENTREGA GRÁTIS
              </button>
            </div>

            <div className="mt-16 relative w-full md:w-96">
              <input
                type="text"
                placeholder="Procure aqui"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 rounded-full bg-white/10 backdrop-blur-2xl text-white border border-white/20 focus:border-orange-500 focus:outline-none placeholder-gray-400 transition-all hover:border-orange-500"
              />
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-full transition-all transform hover:scale-105 active:scale-95 cursor-pointer">
                <Search size={24} />
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>

        <section className="bg-black py-20 px-10 flex flex-col items-center justify-center gap-10">
          <div className="flex flex-row items-center justify-between gap-10">
            <div className="flex flex-row items-center justify-center gap-10">
              <div className="flex flex-1 text-center justify-center items-center gap-6">
                <button className="flex flex-row items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 px-8 py-3 rounded font-black text-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-tighter" onClick={() => setSelectedCategory('all')}>
                  <Star size={20} />
                  Todos
                </button>
                <button className="flex flex-row items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 px-8 py-3 rounded font-black text-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-tighter" onClick={() => setSelectedCategory('burgers')}>
                  <HamburgerIcon size={20} />
                  Hambúrgueres
                </button>
                <button className="flex flex-row items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 px-8 py-3 rounded font-black text-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-tighter" onClick={() => setSelectedCategory('pizzas')}>
                  <PizzaIcon size={20} />
                  pizzas
                </button>
                <button className="flex flex-row items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 px-8 py-3 rounded font-black text-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-tighter" onClick={() => setSelectedCategory('hotdogs')}>
                  <HotDogIcon size={20} />
                  hot-dogs
                </button>
                <button className="flex flex-row items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 px-8 py-3 rounded font-black text-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-tighter" onClick={() => setSelectedCategory('drinks')}>
                  <CupSodaIcon size={20} />
                  bebidas
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {searchedProducts.map((product) => (
              <div key={product.id} className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-orange-500/30 transition-all group cursor-pointer hover:scale-105 transition-all transform active:scale-95" onClick={() => {
                addToCart(product);
              }}>
                <div className="relative w-full h-48">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-2xl mb-4" />
                  {product.tag && (
                    product.tag.toLowerCase() === "novidade" ||
                    product.tag.toLowerCase() === "novidades" ||
                    product.tag.toLowerCase() === "mais pedido" ||
                    product.tag.toLowerCase() === "mais pedidos"
                  ) && (
                      <div className={`absolute top-4 left-4 rounded-full px-3 py-1.5 shadow-xl font-black text-xs uppercase tracking-widest ${product.tag.toLowerCase().includes("pedido")
                          ? "bg-red-600 text-white border border-red-500/30"
                          : "bg-emerald-500 text-white border border-emerald-400/30"
                        }`}>
                        {product.tag}
                      </div>
                    )}
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center mt-3">
                    <h3 className="text-2xl font-black text-white mb-2 group mr-24">{product.name}</h3>
                    <Star size={20} fill="#f97316" className="text-orange-500" />
                    <p className="text-orange-500 font-black text-xl">{product.rating}</p>
                  </div>
                </div>
                <p className="text-gray-400 font-medium">{product.description}</p>
                <p className="text-orange-500 font-black text-xl">R$ {product.price}0</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => { setIsCartOpen(false); setIsCheckoutStep(false); }}
          />
          <div className="relative w-full md:w-[450px] h-full bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              {isCheckoutStep ? (
                <button
                  onClick={() => setIsCheckoutStep(false)}
                  className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10 flex items-center justify-center cursor-pointer"
                >
                  <ArrowLeft size={20} />
                </button>
              ) : (
                <div className="w-9" /> // spacer to balance
              )}
              <h2 className="text-2xl font-black text-white flex items-center gap-3 justify-center flex-1">
                {isCheckoutStep ? (
                  <>
                    <CreditCard className="text-orange-500" />
                    Finalizar Pedido
                  </>
                ) : (
                  <>
                    <ShoppingBag className="text-orange-500" />
                    Seu Carrinho
                  </>
                )}
              </h2>
              <button
                onClick={() => { setIsCartOpen(false); setIsCheckoutStep(false); }}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items or Checkout Form */}
            {!isCheckoutStep ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-6">
                    <div className="bg-white/5 p-6 rounded-full">
                      <ShoppingBag size={48} className="opacity-20" />
                    </div>
                    <p className="font-medium text-lg">Seu carrinho está vazio</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="flex gap-4 bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-2xl border border-white/5 group">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl shadow-lg" />
                      <div className="flex flex-1 flex-col justify-between py-1">
                        <div>
                          <h4 className="text-white font-bold line-clamp-1">{item.name}</h4>
                          <p className="text-orange-500 font-black mt-1">R$ {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/5">
                            <button
                              onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }}
                              className="text-gray-400 hover:text-white w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-white font-medium text-sm w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }}
                              className="text-gray-400 hover:text-white w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                            className="text-red-500/50 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10 cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-all placeholder-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Telefone</label>
                  <input
                    type="text"
                    required
                    value={checkoutPhone}
                    onChange={(e) => setCheckoutPhone(e.target.value)}
                    placeholder="Ex: (11) 99999-0000"
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-all placeholder-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Endereço de Entrega</label>
                  <textarea
                    required
                    value={checkoutAddress}
                    onChange={(e) => setCheckoutAddress(e.target.value)}
                    placeholder="Rua, número, complemento, bairro, cidade - UF"
                    rows={3}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-all resize-none placeholder-gray-600"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Forma de Pagamento</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setCheckoutPayment("pix")}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${checkoutPayment === "pix"
                          ? "border-orange-500 bg-orange-500/10 text-orange-500"
                          : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                    >
                      <DollarSign size={20} />
                      <span className="text-xs font-bold">PIX</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutPayment("credit_card")}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${checkoutPayment === "credit_card"
                          ? "border-orange-500 bg-orange-500/10 text-orange-500"
                          : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                    >
                      <CreditCard size={20} />
                      <span className="text-xs font-bold">Crédito</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutPayment("debit_card")}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${checkoutPayment === "debit_card"
                          ? "border-orange-500 bg-orange-500/10 text-orange-500"
                          : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                    >
                      <CreditCard size={20} />
                      <span className="text-xs font-bold">Débito</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Observações (opcional)</label>
                  <input
                    type="text"
                    value={checkoutNotes}
                    onChange={(e) => setCheckoutNotes(e.target.value)}
                    placeholder="Ex: sem cebola, campainha com defeito"
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-all placeholder-gray-600"
                  />
                </div>
              </form>
            )}

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-zinc-950/90 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400 font-medium">Subtotal</span>
                  <span className="text-white font-bold">
                    R$ {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
                {isCheckoutStep && (
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400 font-medium">Taxa de entrega</span>
                    <span className="text-orange-500 font-bold">R$ 5,00</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400 font-medium text-lg">Total</span>
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-white">
                      R$ {(
                        cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) +
                        (isCheckoutStep ? 5.0 : 0.0)
                      ).toFixed(2)}
                    </span>
                    {!isCheckoutStep && <span className="text-sm text-gray-500">Taxa de entrega não inclusa</span>}
                  </div>
                </div>
                {isCheckoutStep ? (
                  <button
                    onClick={handleCheckoutSubmit}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-lg cursor-pointer"
                  >
                    CONFIRMAR E ENVIAR
                  </button>
                ) : (
                  <button
                    onClick={() => setIsCheckoutStep(true)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-lg cursor-pointer"
                  >
                    FINALIZAR PEDIDO
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order History Overlay */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setIsHistoryOpen(false)}
          />
          <div className="relative w-full md:w-[500px] h-full bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <History className="text-orange-500" />
                Meus Pedidos
              </h2>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-6">
                  <div className="bg-white/5 p-6 rounded-full">
                    <History size={48} className="opacity-20" />
                  </div>
                  <p className="font-medium text-lg text-center">Nenhum pedido realizado ainda</p>
                </div>
              ) : (
                orders.map(order => {
                  let statusBg = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
                  let statusLabel = "Pendente";
                  if (order.status === "production") {
                    statusBg = "bg-blue-500/10 text-blue-500 border-blue-500/20";
                    statusLabel = "Em Produção";
                  } else if (order.status === "sent") {
                    statusBg = "bg-orange-500/10 text-orange-500 border-orange-500/20";
                    statusLabel = "A Caminho";
                  } else if (order.status === "delivered") {
                    statusBg = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                    statusLabel = "Entregue";
                  }

                  return (
                    <div key={order.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                      {/* Order Title & Badge */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div>
                          <span className="text-sm font-bold text-orange-500">{order.id}</span>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${statusBg}`}>
                          {statusLabel}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">
                              <span className="text-orange-500 font-bold">{item.quantity}x</span> {item.name}
                            </span>
                            <span className="text-gray-400 font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Timeline/Tracker */}
                      <div className="relative pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between relative z-10">
                          {/* Pending Step */}
                          <div className="flex flex-col items-center gap-1.5 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${order.statusHistory.some(h => h.status === "pending")
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-110"
                                : "bg-zinc-800 text-gray-500"
                              }`}>
                              📋
                            </div>
                            <span className={`text-[9px] font-bold tracking-tight uppercase ${order.statusHistory.some(h => h.status === "pending") ? "text-orange-500" : "text-gray-600"
                              }`}>Recebido</span>
                            {order.statusHistory.find(h => h.status === "pending") && (
                              <span className="text-[8px] text-gray-500">{order.statusHistory.find(h => h.status === "pending")?.time}</span>
                            )}
                          </div>

                          {/* Line 1 */}
                          <div className={`h-0.5 flex-1 -mt-5 ${order.statusHistory.some(h => h.status === "production") ? "bg-orange-500" : "bg-zinc-800"
                            }`} />

                          {/* Production Step */}
                          <div className="flex flex-col items-center gap-1.5 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${order.statusHistory.some(h => h.status === "production")
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-110"
                                : "bg-zinc-800 text-gray-500"
                              }`}>
                              👨‍🍳
                            </div>
                            <span className={`text-[9px] font-bold tracking-tight uppercase ${order.statusHistory.some(h => h.status === "production") ? "text-orange-500" : "text-gray-600"
                              }`}>Produção</span>
                            {order.statusHistory.find(h => h.status === "production") && (
                              <span className="text-[8px] text-gray-500">{order.statusHistory.find(h => h.status === "production")?.time}</span>
                            )}
                          </div>

                          {/* Line 2 */}
                          <div className={`h-0.5 flex-1 -mt-5 ${order.statusHistory.some(h => h.status === "sent") ? "bg-orange-500" : "bg-zinc-800"
                            }`} />

                          {/* Sent Step */}
                          <div className="flex flex-col items-center gap-1.5 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${order.statusHistory.some(h => h.status === "sent")
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-110"
                                : "bg-zinc-800 text-gray-500"
                              }`}>
                              🛵
                            </div>
                            <span className={`text-[9px] font-bold tracking-tight uppercase ${order.statusHistory.some(h => h.status === "sent") ? "text-orange-500" : "text-gray-600"
                              }`}>A Caminho</span>
                            {order.statusHistory.find(h => h.status === "sent") && (
                              <span className="text-[8px] text-gray-500">{order.statusHistory.find(h => h.status === "sent")?.time}</span>
                            )}
                          </div>

                          {/* Line 3 */}
                          <div className={`h-0.5 flex-1 -mt-5 ${order.statusHistory.some(h => h.status === "delivered") ? "bg-orange-500" : "bg-zinc-800"
                            }`} />

                          {/* Delivered Step */}
                          <div className="flex flex-col items-center gap-1.5 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${order.statusHistory.some(h => h.status === "delivered")
                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110"
                                : "bg-zinc-800 text-gray-500"
                              }`}>
                              ✅
                            </div>
                            <span className={`text-[9px] font-bold tracking-tight uppercase ${order.statusHistory.some(h => h.status === "delivered") ? "text-emerald-500" : "text-gray-600"
                              }`}>Entregue</span>
                            {order.statusHistory.find(h => h.status === "delivered") && (
                              <span className="text-[8px] text-gray-500">{order.statusHistory.find(h => h.status === "delivered")?.time}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer Details & Reorder Button */}
                      <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-500">Endereço de entrega:</p>
                          <p className="text-xs text-gray-300 font-medium truncate">{order.address}</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 min-w-max">
                          <div className="text-right">
                            <span className="text-[10px] text-gray-500 block">Total pago:</span>
                            <span className="text-white font-black text-sm">R$ {order.total.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => handleReorder(order)}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                          >
                            REPETIR PEDIDO
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 20s ease-in-out infinite;
        }
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
