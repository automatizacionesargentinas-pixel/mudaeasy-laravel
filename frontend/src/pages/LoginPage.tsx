import React from 'react';
import { Truck, Star, Shield, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-white/10">
          <Truck className="w-12 h-12 text-zinc-900" strokeWidth={1.5} />
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight mb-3">MudaEasy</h1>
        <p className="text-zinc-400 text-lg max-w-xs">
          Presupuestos de mudanza en minutos. Conectate con fleteros de confianza.
        </p>
      </div>

      {/* Features */}
      <div className="px-6 pb-8 space-y-3">
        {[
          { icon: Zap,    text: 'Presupuesto en 4 pasos simples' },
          { icon: Shield, text: 'Empresas verificadas y con rating' },
          { icon: Star,   text: 'Guardá y compartí tus presupuestos' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 bg-zinc-900 rounded-2xl px-4 py-3">
            <div className="w-9 h-9 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-zinc-300 text-sm font-medium">{text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-6 pb-10 space-y-3">
        <button
          onClick={login}
          className="w-full py-4 bg-white text-zinc-900 rounded-2xl font-bold text-base flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Continuar con Google
        </button>
        <p className="text-center text-zinc-600 text-xs">
          Al continuar aceptás los términos de uso
        </p>
      </div>
    </div>
  );
}
