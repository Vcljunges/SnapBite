"use client";

import { Flame, History, LogOut, ShoppingBag, UserIcon, Clock, CheckCircle2, Search, HamburgerIcon, PizzaIcon } from "lucide-react";
import { useState } from "react";
import { productsList } from "./data/productsList";

export default function Home() {
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
          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-black transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-orange-500/30 cursor-pointer">
            <ShoppingBag size={18} />
            CARRINHO
          </button>
          <button className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-red-500 transition-all cursor-pointer uppercase tracking-widest transform hover:scale-105 active:scale-95">
            <LogOut size={20} />
            Sair
          </button>
        </nav>

        <div className="flex md:hidden">
          <button className="text-white p-2">
            <ShoppingBag size={24} />
          </button>
        </div>
      </header>

      <main className="relative flex flex-col flex-1">
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Background Image */}
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
              <input type="text" placeholder="Procure aqui" className="w-full p-4 rounded-full bg-white/10 backdrop-blur-2xl text-white border border-white/20 focus:border-orange-500 focus:outline-none placeholder-gray-400 transition-all hover:border-orange-500" />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-full transition-all transform hover:scale-105 active:scale-95 cursor-pointer">
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
                <button className="flex flex-row items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 px-10 py-5 rounded-full font-black text-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-tighter">
                  Todos
                </button>
                <button className="flex flex-row items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 px-10 py-5 rounded-full font-black text-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-tighter">
                <HamburgerIcon size={20} />
                  Hambúrgueres
                </button>
                <button className="flex flex-row items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 px-10 py-5 rounded-full font-black text-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-tighter">
                <PizzaIcon size={20} />
                  pizzas
                </button>
                <button className="flex flex-row items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 px-10 py-5 rounded-full font-black text-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-tighter">
                
                  hot-dogs
                </button>
                <button className="flex flex-row items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 px-10 py-5 rounded-full font-black text-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-tighter">
                  bebidas
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {productsList.map((product) => (
              <div key={product.id} className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-orange-500/30 transition-all group cursor-pointer hover:scale-105 transition-all transform active:scale-95">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-2xl mb-4" />
                <h3 className="text-2xl font-black text-white mb-2 group-hover:text-orange-500 transition-colors">{product.name}</h3>
                <p className="text-gray-400 font-medium">{product.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
