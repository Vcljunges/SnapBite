"use client";

import { Flame, History, LogOut, ShoppingBag, UserIcon, Clock, CheckCircle2, Search, HamburgerIcon, PizzaIcon, CupSodaIcon, Star, Plus, X, Trash2 } from "lucide-react";
import { HotDogIcon } from "./Icons/HotDog";
import { useState } from "react";
import { productsList } from "./data/productsList";
import { Product } from "./types/Product";

export default function Home() {

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<(Product & { quantity: number })[]>([]);

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
  const [cartOpen, setCartOpen] = useState(false);
  const [productSelected, setProductSelected] = useState<Product | undefined>(undefined);

  const filteredProducts = selectedCategory === 'all'
    ? productsList
    : productsList.filter(product => product.category === selectedCategory);

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
          <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-black text-white tracking-tighter hover:text-orange-500 transition-all">
            <Flame size={32} fill="white" className="bg-orange-500 text-white p-1.5 rounded-xl shadow-lg shadow-orange-500/20" />
            SnapBite
          </h1>
        </div>
        
        <nav className="hidden md:flex flex-row items-center gap-8">
          <button className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-white transition-all cursor-pointer uppercase tracking-widest transform hover:scale-105 active:scale-95">
            <History size={20} />
            Meus Pedidos
          </button>
          <button className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-white transition-all cursor-pointer uppercase tracking-widest transform hover:scale-105 active:scale-95">
            <UserIcon size={20} />
            Entrar
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
          <button className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-red-500 transition-all cursor-pointer uppercase tracking-widest transform hover:scale-105 active:scale-95">
            <LogOut size={20} />
            Sair
          </button>
        </nav>

        <div className="flex md:hidden">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-white p-2 relative"
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
                <Clock size={24} className="text-orange-500"/>
                30-45 MIN
              </button>
              <button className="flex flex-row items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 px-10 py-5 rounded-full font-black text-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-tighter">
              <CheckCircle2 size={24} className="text-orange-500"/>
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
                    <div className={`absolute top-4 left-4 rounded-full px-3 py-1.5 shadow-xl font-black text-xs uppercase tracking-widest ${
                      product.tag.toLowerCase().includes("pedido") 
                        ? "bg-red-600 text-white border border-red-500/30" 
                        : "bg-emerald-500 text-white border border-emerald-400/30"
                    }`}>
                      {product.tag}
                    </div>
                  )}
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center mt-3">
                    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-orange-500 transition-colors mr-24">{product.name}</h3>
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

      {/* Cart Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full md:w-[450px] h-full bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <ShoppingBag className="text-orange-500" />
                Seu Carrinho
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
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
                            className="text-gray-400 hover:text-white w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-white font-medium text-sm w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }}
                            className="text-gray-400 hover:text-white w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                          className="text-red-500/50 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-zinc-950/90 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400 font-medium text-lg">Total</span>
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-white">
                      R$ {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">Taxa de entrega não inclusa</span>
                  </div>
                </div>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 text-lg">
                  FINALIZAR PEDIDO
                </button>
              </div>
            )}
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
