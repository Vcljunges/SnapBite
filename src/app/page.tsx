import { Flame, History, LogOut, ShoppingBag, UserIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black overflow-hidden">
      <div className="flex flex-row items-center justify-between w-full px-10 py-6 bg-black/40 backdrop-blur-md fixed top-0 z-50 border-b border-white/10">
        <div className="flex flex-row items-center justify-center gap-4">
          <h1 className="flex items-center gap-1.5 text-3xl font-extrabold text-white tracking-tight hover:text-orange-500 transition-all">
            <Flame size={36} fill="white" className="bg-orange-500 text-white p-1.5 rounded-lg shadow-md" />
            SnapBite
          </h1>
        </div>
        <div className="flex flex-row items-center gap-8">
          <button className="flex items-center gap-2 text-lg font-serif text-gray-400 hover:text-orange-500 transition-all cursor-pointer">
            <History size={20} className="transition-colors" />
            Meus Pedidos
          </button>
          <button className="flex items-center gap-2 text-lg font-Arial text-gray-400 hover:text-orange-500 transition-all cursor-pointer">
            <UserIcon size={20} className="transition-colors" />
            Entrar/Cadastrar
          </button>
          <div className="bg-orange-500 rounded-lg p-2">
            <button className="flex items-center gap-2 text-lg font-Arial text-white hover:text-black transition-all cursor-pointer">
              <ShoppingBag size={20} className="transition-colors" />
              Carrinho
            </button>
          </div>
          <button className="flex items-center gap-2 text-lg font-Arial text-gray-400 hover:text-red-500 transition-all cursor-pointer">
            <LogOut size={20} className="transition-colors" />
            Sair
          </button>
        </div>
      </div>
      <div className="flex flex-col ">
        <div>

        </div>
        <div className="relative w-screen h-screen">
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover"
            alt="SnapBite Hero"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/80" />
          <div className="absolute inset-0 shadow-[inner_0px_0px_200px_rgba(0,0,0,0.9)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
          </div>
        </div>
      </div>
    </div>
  );
}
