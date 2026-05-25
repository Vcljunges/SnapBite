"use client";

import { useState } from "react";
import { Flame, ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { User as UserType } from "../types/User";
import { usersList as initialUsers } from "../data/usersList";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      // Get existing users (initialize if not present)
      let storedUsers = localStorage.getItem("snapbite_users");
      let users: UserType[] = [];
      
      if (!storedUsers) {
        localStorage.setItem("snapbite_users", JSON.stringify(initialUsers));
        users = initialUsers;
      } else {
        users = JSON.parse(storedUsers);
      }

      // Check credentials
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        setError("E-mail ou senha incorretos.");
        setLoading(false);
        return;
      }

      // Save user session
      localStorage.setItem("snapbite_current_user", JSON.stringify(foundUser));

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      setError("Ocorreu um erro ao processar o login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black font-sans items-center justify-center relative px-4 py-8 overflow-y-auto">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Back Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
      >
        <ArrowLeft size={16} />
        Voltar ao início
      </Link>

      <div className="w-full max-w-md bg-zinc-950/80 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl relative z-10 transition-all">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-2 text-2xl font-black text-white uppercase tracking-tighter mb-2">
            <Flame size={28} fill="white" className="bg-orange-500 text-white p-1 rounded-lg" />
            SnapBite
          </div>
          <p className="text-zinc-400 text-sm font-medium text-center">Entre para acessar seus pedidos e acompanhar entregas</p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-500 text-2xl font-black">
              ✓
            </div>
            <h3 className="text-xl font-bold text-white">Login realizado!</h3>
            <p className="text-zinc-500 text-sm text-center">Direcionando você ao SnapBite...</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-xl text-center animate-fade-in">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">E-mail</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail cadastrado"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Senha</label>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-4 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider cursor-pointer"
            >
              {loading ? "Entrando..." : "ENTRAR"}
            </button>
          </form>
        )}

        {/* Register Link */}
        <div className="mt-8 text-center text-sm">
          <span className="text-zinc-500">Não tem uma conta? </span>
          <Link href="/register" className="text-orange-500 hover:text-orange-400 font-bold underline decoration-dotted transition-colors">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
