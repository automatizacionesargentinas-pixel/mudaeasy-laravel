import React from 'react';
import { User, Building2, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function RolePage() {
  const { updateRole, user } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Truck className="w-8 h-8 text-zinc-900" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">¿Cómo usás MudaEasy?</h2>
          <p className="text-zinc-500 text-sm">Hola {user?.name?.split(' ')[0]} 👋 Elegí tu perfil</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => updateRole('client')}
            className="w-full p-5 bg-zinc-900 border-2 border-zinc-800 hover:border-white rounded-2xl text-left transition-all active:scale-95 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 group-hover:bg-white rounded-xl flex items-center justify-center transition-colors">
                <User className="w-6 h-6 text-white group-hover:text-zinc-900 transition-colors" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">Soy Cliente</p>
                <p className="text-zinc-500 text-xs mt-0.5">Busco fleteros para mi mudanza</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => updateRole('company')}
            className="w-full p-5 bg-zinc-900 border-2 border-zinc-800 hover:border-white rounded-2xl text-left transition-all active:scale-95 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 group-hover:bg-white rounded-xl flex items-center justify-center transition-colors">
                <Building2 className="w-6 h-6 text-white group-hover:text-zinc-900 transition-colors" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">Soy Fletero / Empresa</p>
                <p className="text-zinc-500 text-xs mt-0.5">Ofrezco servicios de mudanza</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
