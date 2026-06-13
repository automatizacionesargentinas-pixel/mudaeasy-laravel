import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Plus, Minus, Truck, Package, Settings, FileText, X } from 'lucide-react';
import SignaturePad from 'signature_pad';
import api from '../lib/api';

const INVENTORY_ITEMS = [
  { id: 'sofa-3',   name: 'Sofá 3 plazas',  volume: 2.5, icon: '🛋️' },
  { id: 'bed-mat',  name: 'Cama matrimonio', volume: 2.0, icon: '🛏️' },
  { id: 'table',    name: 'Mesa comedor',    volume: 1.8, icon: '🪑' },
  { id: 'chair',    name: 'Silla',           volume: 0.3, icon: '🪑' },
  { id: 'box-lg',   name: 'Caja grande',     volume: 0.8, icon: '📦' },
  { id: 'box-md',   name: 'Caja mediana',    volume: 0.5, icon: '📦' },
  { id: 'wardrobe', name: 'Armario',         volume: 3.0, icon: '🚪' },
  { id: 'fridge',   name: 'Nevera',          volume: 1.5, icon: '❄️' },
  { id: 'tv',       name: 'Televisor',       volume: 0.4, icon: '📺' },
  { id: 'washing',  name: 'Lavadora',        volume: 0.8, icon: '🧼' },
];

const ADDITIONAL_SERVICES = [
  { id: 'packing',     name: 'Embalaje',           desc: '10/m³ extra',  icon: '📦' },
  { id: 'disassembly', name: 'Desmontaje',          desc: '+$40 fijo',    icon: '🔧' },
  { id: 'assembly',    name: 'Montaje de muebles',  desc: '+$40 fijo',    icon: '🪛' },
];

const HOUSING_TYPES = ['Piso con ascensor', 'Piso sin ascensor', 'Casa'];
const PRICING = { pricePerM3: 45, pricePerKm: 1.5, minTimePrice: 120, noElevatorMult: 0.15, highFloorMult: 0.20 };

function calcTotal(data: any) {
  const vol = (data.inventory || []).reduce((acc: number, item: any) => {
    const def = INVENTORY_ITEMS.find(i => i.id === item.itemId);
    return acc + (def ? def.volume : (item.customVolume || 0)) * item.quantity;
  }, 0);
  let price = vol * PRICING.pricePerM3;
  if (data.chargeByDistance) price += (data.distanceKm || 0) * PRICING.pricePerKm;
  if (data.chargeByMinTime) price += PRICING.minTimePrice;
  if (data.originHousingType === 'Piso sin ascensor') price += price * PRICING.noElevatorMult;
  if ((data.originFloor || 0) > 3) price += price * PRICING.highFloorMult;
  if ((data.services || []).includes('packing')) price += vol * 10;
  if ((data.services || []).includes('disassembly')) price += 40;
  if ((data.services || []).includes('assembly')) price += 40;
  return { vol: parseFloat(vol.toFixed(2)), price: parseFloat(price.toFixed(2)) };
}

const STEPS = [
  { label: 'Logística',  icon: Truck },
  { label: 'Inventario', icon: Package },
  { label: 'Servicios',  icon: Settings },
  { label: 'Resumen',    icon: FileText },
];

type FormState = {
  clientName: string; phone: string; email: string;
  originAddress: string; destinationAddress: string;
  moveDate: string;
  originHousingType: string; destinationHousingType: string;
  originFloor: number; destinationFloor: number;
  distanceKm: number; chargeByDistance: boolean; chargeByMinTime: boolean;
  inventory: { itemId: string; quantity: number; customVolume?: number }[];
  services: string[];
  currency: string;
  signature: string;
};

export default function QuoteWizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigPadRef = useRef<SignaturePad | null>(null);

  const [form, setForm] = useState<FormState>({
    clientName: '', phone: '', email: '',
    originAddress: '', destinationAddress: '',
    moveDate: '',
    originHousingType: 'Piso con ascensor', destinationHousingType: 'Piso con ascensor',
    originFloor: 0, destinationFloor: 0,
    distanceKm: 0, chargeByDistance: false, chargeByMinTime: false,
    inventory: [] as any[],
    services: [] as string[],
    currency: 'ARS',
    signature: '',
  });

  useEffect(() => {
    if (step === 3 && canvasRef.current) {
      sigPadRef.current = new SignaturePad(canvasRef.current, { backgroundColor: 'rgb(24,24,27)' });
    }
  }, [step]);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const changeQty = (itemId: string, delta: number) => {
    setForm(f => {
      const existing = f.inventory.find(i => i.itemId === itemId);
      if (!existing) {
        return delta > 0 ? { ...f, inventory: [...f.inventory, { itemId, quantity: 1 }] } : f;
      }
      const newQty = existing.quantity + delta;
      if (newQty <= 0) return { ...f, inventory: f.inventory.filter(i => i.itemId !== itemId) };
      return { ...f, inventory: f.inventory.map(i => i.itemId === itemId ? { ...i, quantity: newQty } : i) };
    });
  };

  const toggleService = (id: string) => {
    setForm(f => ({
      ...f,
      services: f.services.includes(id) ? f.services.filter(s => s !== id) : [...f.services, id],
    }));
  };

  const { vol, price } = calcTotal(form);

  const save = async (status = 'Borrador') => {
    setSaving(true);
    setSaveError('');
    const sig = sigPadRef.current && !sigPadRef.current.isEmpty() ? sigPadRef.current.toDataURL() : '';
    try {
      await api.post('/quotes', {
        client_name: form.clientName, phone: form.phone, email: form.email,
        origin_address: form.originAddress, destination_address: form.destinationAddress,
        move_date: form.moveDate,
        origin_housing_type: form.originHousingType, destination_housing_type: form.destinationHousingType,
        origin_floor: form.originFloor, destination_floor: form.destinationFloor,
        distance_km: form.distanceKm, charge_by_distance: form.chargeByDistance, charge_by_min_time: form.chargeByMinTime,
        inventory: form.inventory, services: form.services,
        signature: sig, status,
        total_volume: vol, total_price: price, currency: form.currency,
      });
      navigate('/');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al guardar';
      setSaveError('No se pudo guardar el presupuesto. Verificá tu conexión e intentá de nuevo.');
      console.error('save error:', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Top bar */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-4">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/')}
          className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1">
          <p className="text-zinc-500 text-xs">Paso {step + 1} de {STEPS.length}</p>
          <p className="text-white font-bold">{STEPS[step].label}</p>
        </div>
        <button onClick={() => navigate('/')} className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
          <X className="w-5 h-5 text-zinc-500" />
        </button>
      </div>

      {/* Step indicator */}
      <div className="px-5 mb-6 flex gap-1.5">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-white' : 'bg-zinc-800'}`} />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 overflow-y-auto pb-32">
        {step === 0 && <StepLogistica form={form} set={set} />}
        {step === 1 && <StepInventario inventory={form.inventory} changeQty={changeQty} />}
        {step === 2 && <StepServicios services={form.services} toggle={toggleService} currency={form.currency} set={set} />}
        {step === 3 && <StepResumen form={form} vol={vol} price={price} canvasRef={canvasRef} sigPadRef={sigPadRef} />}
      </div>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur px-5 py-4 border-t border-zinc-900 space-y-2">
        {saveError && (
          <p className="text-red-400 text-xs text-center pb-1">{saveError}</p>
        )}
        {step === 3 ? (
          <div className="flex gap-2">
            <button onClick={() => save('Borrador')} disabled={saving}
              className="flex-1 py-3.5 bg-zinc-900 text-white rounded-2xl font-semibold text-sm disabled:opacity-50">
              Guardar borrador
            </button>
            <button onClick={() => save('Enviado')} disabled={saving}
              className="flex-1 py-3.5 bg-white text-zinc-900 rounded-2xl font-bold text-sm disabled:opacity-50">
              {saving ? 'Guardando...' : 'Enviar'}
            </button>
          </div>
        ) : (
          <button onClick={() => setStep(s => s + 1)}
            className="w-full py-4 bg-white text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
            Siguiente <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function StepLogistica({ form, set }: any) {
  return (
    <div className="space-y-4">
      <Field label="Nombre del cliente">
        <input value={form.clientName} onChange={e => set('clientName', e.target.value)}
          className="input" placeholder="Juan García" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Teléfono">
          <input value={form.phone} onChange={e => set('phone', e.target.value)} className="input" placeholder="+54 11..." />
        </Field>
        <Field label="Email">
          <input value={form.email} onChange={e => set('email', e.target.value)} className="input" placeholder="mail@..." />
        </Field>
      </div>
      <Field label="Dirección origen">
        <input value={form.originAddress} onChange={e => set('originAddress', e.target.value)} className="input" placeholder="Calle y número" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tipo vivienda origen">
          <select value={form.originHousingType} onChange={e => set('originHousingType', e.target.value)} className="input">
            {['Piso con ascensor', 'Piso sin ascensor', 'Casa'].map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Planta">
          <input type="number" min="0" value={form.originFloor} onChange={e => set('originFloor', +e.target.value)} className="input" />
        </Field>
      </div>
      <Field label="Dirección destino">
        <input value={form.destinationAddress} onChange={e => set('destinationAddress', e.target.value)} className="input" placeholder="Calle y número" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tipo vivienda destino">
          <select value={form.destinationHousingType} onChange={e => set('destinationHousingType', e.target.value)} className="input">
            {['Piso con ascensor', 'Piso sin ascensor', 'Casa'].map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Planta">
          <input type="number" min="0" value={form.destinationFloor} onChange={e => set('destinationFloor', +e.target.value)} className="input" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Fecha de mudanza">
          <input type="date" value={form.moveDate} onChange={e => set('moveDate', e.target.value)} className="input" />
        </Field>
        <Field label="Distancia (km)">
          <input type="number" min="0" value={form.distanceKm} onChange={e => set('distanceKm', +e.target.value)} className="input" />
        </Field>
      </div>
      <div className="space-y-2">
        <Toggle label="Cobrar por distancia" checked={form.chargeByDistance} onChange={v => set('chargeByDistance', v)} />
        <Toggle label="Cobrar tiempo mínimo" checked={form.chargeByMinTime} onChange={v => set('chargeByMinTime', v)} />
      </div>
    </div>
  );
}

function StepInventario({ inventory, changeQty }: any) {
  return (
    <div className="space-y-2">
      {INVENTORY_ITEMS.map(item => {
        const qty = inventory.find((i: any) => i.itemId === item.id)?.quantity || 0;
        return (
          <div key={item.id} className="bg-zinc-900 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{item.name}</p>
              <p className="text-zinc-500 text-xs">{item.volume} m³</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => changeQty(item.id, -1)}
                className="w-8 h-8 bg-zinc-800 rounded-xl flex items-center justify-center active:bg-zinc-700">
                <Minus className="w-4 h-4 text-white" />
              </button>
              <span className="text-white font-bold w-5 text-center">{qty}</span>
              <button onClick={() => changeQty(item.id, 1)}
                className="w-8 h-8 bg-zinc-800 rounded-xl flex items-center justify-center active:bg-zinc-700">
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StepServicios({ services, toggle, currency, set }: any) {
  return (
    <div className="space-y-4">
      <Field label="Moneda">
        <div className="grid grid-cols-3 gap-2">
          {['ARS', 'EUR', 'USD'].map(c => (
            <button key={c} onClick={() => set('currency', c)}
              className={`py-3 rounded-xl font-bold text-sm transition-colors ${currency === c ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-zinc-400'}`}>
              {c}
            </button>
          ))}
        </div>
      </Field>
      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">Servicios adicionales</p>
      {ADDITIONAL_SERVICES.map(s => (
        <button key={s.id} onClick={() => toggle(s.id)}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${services.includes(s.id) ? 'border-white bg-zinc-900' : 'border-zinc-800 bg-zinc-900'}`}>
          <span className="text-2xl">{s.icon}</span>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{s.name}</p>
            <p className="text-zinc-500 text-xs">{s.desc}</p>
          </div>
          {services.includes(s.id) && <Check className="w-5 h-5 text-white flex-shrink-0" />}
        </button>
      ))}
    </div>
  );
}

function StepResumen({ form, vol, price, canvasRef, sigPadRef }: any) {
  const symbol = form.currency === 'ARS' ? '$' : form.currency === 'USD' ? 'US$' : '€';
  return (
    <div className="space-y-4">
      <div className="bg-zinc-900 rounded-2xl p-4 space-y-2">
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-3">Resumen</p>
        <Row label="Cliente" value={form.clientName} />
        <Row label="Origen" value={form.originAddress} />
        <Row label="Destino" value={form.destinationAddress} />
        <Row label="Fecha" value={form.moveDate} />
        <Row label="Volumen total" value={`${vol} m³`} />
        <div className="border-t border-zinc-800 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-medium">Total estimado</span>
            <span className="text-white text-2xl font-black">{symbol}{price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-4">
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-3">Firma del cliente</p>
        <canvas ref={canvasRef} width={320} height={150}
          className="w-full rounded-xl bg-zinc-950 border border-zinc-800" />
        <button onClick={() => sigPadRef.current?.clear()}
          className="mt-2 text-zinc-500 text-xs underline">Limpiar firma</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-zinc-400 text-xs font-semibold">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between bg-zinc-900 rounded-2xl px-4 py-3">
      <span className="text-zinc-300 text-sm">{label}</span>
      <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-white' : 'bg-zinc-800'} relative`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-zinc-900 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-zinc-500 text-sm">{label}</span>
      <span className="text-zinc-300 text-sm text-right font-medium">{value}</span>
    </div>
  );
}
