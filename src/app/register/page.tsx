"use client";

import { useState } from "react";
import { Flame, ArrowLeft, User, Mail, Phone, MapPin, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { User as UserType } from "../types/User";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!name || !email || !phone || !address || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      // Get existing users
      const storedUsers = localStorage.getItem("snapbite_users");
      const usersList: UserType[] = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if email already registered
      if (usersList.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        setError("Este e-mail já está cadastrado.");
        setLoading(false);
        return;
      }

      // Generate ID
      const newUserId = "u" + (usersList.length + 1);
      
      const newUser: UserType = {
        id: newUserId,
        name,
        email,
        phone,
        address,
        password,
        role: "customer",
      };

      usersList.push(newUser);
      localStorage.setItem("snapbite_users", JSON.stringify(usersList));

      localStorage.setItem("snapbite_current_user", JSON.stringify(newUser));

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      setError("Ocorreu um erro ao processar o cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black font-sans items-center justify-center relative px-4 py-8 md:py-16 overflow-y-auto">
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

      <div className="w-full max-w-lg bg-zinc-950/80 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl relative z-10 transition-all">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-2 text-2xl font-black text-white uppercase tracking-tighter mb-2">
            <Flame size={28} fill="white" className="bg-orange-500 text-white p-1 rounded-lg" />
            SnapBite
          </div>
          <p className="text-zinc-400 text-sm font-medium text-center">Crie sua conta para pedir os melhores burgers e pizzas</p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-500 text-2xl font-black">
              ✓
            </div>
            <h3 className="text-xl font-bold text-white">Cadastro concluído!</h3>
            <p className="text-zinc-500 text-sm text-center">Redirecionando você para o SnapBite...</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Nome */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Nome Completo</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

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
                  placeholder="exemplo@email.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Telefone</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Phone size={18} />
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Endereço Completo</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <MapPin size={18} />
                </span>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, bairro, cidade - UF"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Senha</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caract."
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

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Confirmar Senha</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-4 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider cursor-pointer"
            >
              {loading ? "Cadastrando..." : "CRIAR CONTA"}
            </button>
          </form>
        )}

        {/* Login Link */}
        <div className="mt-8 text-center text-sm">
          <span className="text-zinc-500">Já tem uma conta? </span>
          <Link href="/login" className="text-orange-500 hover:text-orange-400 font-bold underline decoration-dotted transition-colors">
            Faça Login
          </Link>
        </div>
      </div>
    </div>
  );
}
