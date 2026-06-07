import React, { useEffect, useState } from 'react';
import { Star, MapPin, Truck, Shield, ChevronRight } from 'lucide-react';
import { BottomNav } from './DashboardPage';
import api from '../lib/api';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/companies').then(r => setCompanies(r.data)).finally(() => setLoading(false));
  }, []);

  const symbol = (c: any) => c.currency === 'ARS' ? '$' : c.currency === 'USD' ? 'US$' : '€';

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <div className="px-5 pt-14 pb-6">
        <p className="text-zinc-500 text-xs">Encontrá</p>
        <h1 className="text-white text-2xl font-black">Empresas de mudanza</h1>
      </div>

      <div className="px-5 space-y-3">
        {loading && [1,2,3].map(i => <div key={i} className="bg-zinc-900 rounded-2xl h-28 animate-pulse" />)}
        {!loading && companies.length === 0 && (
          <div className="bg-zinc-900 rounded-2xl p-10 text-center">
            <Truck className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">Todavía no hay empresas registradas</p>
          </div>
        )}
        {companies.map(c => (
          <div key={c.id} className="bg-zinc-900 rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-zinc-400" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold text-sm">{c.name}</p>
                  {c.is_verified && (
                    <span className="bg-emerald-950 text-emerald-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3" />Verificada
                    </span>
                  )}
                </div>
                {c.description && <p className="text-zinc-500 text-xs mt-0.5 line-clamp-2">{c.description}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Por m³', value: `${symbol(c)}${c.price_per_m3}` },
                { label: 'Por km', value: `${symbol(c)}${c.price_per_km}` },
                { label: 'Mínimo', value: `${symbol(c)}${c.min_time_price}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-zinc-800 rounded-xl p-2 text-center">
                  <p className="text-zinc-500 text-xs">{label}</p>
                  <p className="text-white font-bold text-sm">{value}</p>
                </div>
              ))}
            </div>

            {c.rating > 0 && (
              <div className="flex items-center gap-1 mt-3">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(c.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'}`} />
                ))}
                <span className="text-zinc-500 text-xs ml-1">{c.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav active="companies" />
    </div>
  );
}
