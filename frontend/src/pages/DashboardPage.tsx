import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Truck, LogOut, ChevronRight, Clock, CheckCircle, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Borrador: { bg: 'bg-zinc-800', text: 'text-zinc-400', icon: <Clock className="w-3 h-3" /> },
  Enviado:  { bg: 'bg-blue-950', text: 'text-blue-400', icon: <Send className="w-3 h-3" /> },
  Aceptado: { bg: 'bg-emerald-950', text: 'text-emerald-400', icon: <CheckCircle className="w-3 h-3" /> },
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quotes').then(r => setQuotes(r.data)).finally(() => setLoading(false));
  }, []);

  const totalRevenue = quotes.filter(q => q.status === 'Aceptado').reduce((s, q) => s + q.total_price, 0);

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            {user?.avatar
              ? <img src={user.avatar} className="w-10 h-10 rounded-full" alt={user.name} />
              : <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-white font-bold">{user?.name?.[0]}</div>
            }
            <div>
              <p className="text-zinc-500 text-xs">Bienvenido</p>
              <p className="text-white font-bold text-sm">{user?.name?.split(' ')[0]}</p>
            </div>
          </div>
          <button onClick={logout} className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center">
            <LogOut className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-6">
        <div className="bg-zinc-900 rounded-2xl p-4">
          <p className="text-zinc-500 text-xs mb-1">Presupuestos</p>
          <p className="text-white text-3xl font-black">{quotes.length}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-4">
          <p className="text-zinc-500 text-xs mb-1">Aceptados</p>
          <p className="text-emerald-400 text-3xl font-black">{quotes.filter(q => q.status === 'Aceptado').length}</p>
        </div>
      </div>

      {/* New Quote CTA */}
      <div className="px-5 mb-6">
        <button
          onClick={() => navigate('/quotes/new')}
          className="w-full bg-white text-zinc-900 rounded-2xl py-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5" />
          Nuevo Presupuesto
        </button>
      </div>

      {/* Quotes list */}
      <div className="px-5">
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-3">Mis presupuestos</p>
        {loading && (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="bg-zinc-900 rounded-2xl h-20 animate-pulse" />)}
          </div>
        )}
        {!loading && quotes.length === 0 && (
          <div className="bg-zinc-900 rounded-2xl p-8 text-center">
            <FileText className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">Todavía no tenés presupuestos</p>
            <p className="text-zinc-700 text-xs mt-1">Creá uno nuevo arriba</p>
          </div>
        )}
        <div className="space-y-3">
          {quotes.map(q => {
            const st = STATUS_STYLES[q.status] || STATUS_STYLES.Borrador;
            return (
              <button
                key={q.id}
                onClick={() => navigate(`/quotes/${q.id}`)}
                className="w-full bg-zinc-900 rounded-2xl p-4 text-left flex items-center gap-4 active:bg-zinc-800 transition-colors"
              >
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-zinc-400" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{q.client_name}</p>
                  <p className="text-zinc-500 text-xs truncate mt-0.5">{q.origin_address} → {q.destination_address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${st.bg} ${st.text}`}>
                      {st.icon}{q.status}
                    </span>
                    <span className="text-zinc-600 text-xs">{format(new Date(q.created_at), 'd MMM', { locale: es })}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-bold text-sm">{q.total_price?.toFixed(0)}{q.currency === 'ARS' ? '$' : q.currency === 'USD' ? 'US$' : '€'}</p>
                  <ChevronRight className="w-4 h-4 text-zinc-700 ml-auto mt-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav active="home" />
    </div>
  );
}

function BottomNav({ active }: { active: string }) {
  const navigate = useNavigate();
  const items = [
    { id: 'home',      icon: FileText, label: 'Presupuestos', path: '/' },
    { id: 'companies', icon: Truck,    label: 'Empresas',     path: '/companies' },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur border-t border-zinc-900 px-6 py-3 flex justify-around safe-bottom">
      {items.map(({ id, icon: Icon, label, path }) => (
        <button key={id} onClick={() => navigate(path)} className="flex flex-col items-center gap-1">
          <Icon className={`w-6 h-6 ${active === id ? 'text-white' : 'text-zinc-600'}`} />
          <span className={`text-xs ${active === id ? 'text-white font-semibold' : 'text-zinc-600'}`}>{label}</span>
        </button>
      ))}
    </div>
  );
}

export { BottomNav };
