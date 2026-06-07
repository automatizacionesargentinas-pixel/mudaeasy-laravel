<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #18181b; background: #fff; }
  .header { background: #18181b; color: #fff; padding: 28px 32px; display: flex; justify-content: space-between; align-items: center; }
  .logo { font-size: 24px; font-weight: 900; letter-spacing: -1px; }
  .logo span { color: #a1a1aa; }
  .header-meta { text-align: right; color: #a1a1aa; font-size: 11px; }
  .body { padding: 28px 32px; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 10px; font-weight: 700; }
  .badge-borrador { background: #27272a; color: #a1a1aa; }
  .badge-enviado  { background: #1e3a5f; color: #60a5fa; }
  .badge-aceptado { background: #052e16; color: #4ade80; }
  .section { margin-bottom: 20px; }
  .section-title { font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #f4f4f5; padding-bottom: 5px; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .field-label { font-size: 10px; color: #a1a1aa; margin-bottom: 2px; }
  .field-value { font-size: 13px; font-weight: 600; color: #18181b; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #f4f4f5; padding: 8px 10px; text-align: left; font-size: 10px; font-weight: 700; color: #71717a; text-transform: uppercase; }
  td { padding: 8px 10px; border-bottom: 1px solid #f4f4f5; font-size: 11px; }
  .total-box { background: #18181b; color: #fff; padding: 16px 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
  .total-label { font-size: 11px; color: #a1a1aa; }
  .total-amount { font-size: 26px; font-weight: 900; }
  .sig-section { margin-top: 20px; }
  .sig-box { border: 1px solid #e4e4e7; border-radius: 8px; padding: 10px; background: #fafafa; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #f4f4f5; text-align: center; color: #a1a1aa; font-size: 10px; }
</style>
</head>
<body>
<div class="header">
  <div class="logo">Muda<span>Easy</span></div>
  <div class="header-meta">
    <div>Presupuesto #{{ $quote->id }}</div>
    <div>{{ $quote->created_at->format('d/m/Y') }}</div>
    <div style="margin-top:6px">
      <span class="badge badge-{{ strtolower($quote->status) }}">{{ $quote->status }}</span>
    </div>
  </div>
</div>

<div class="body">
  {{-- Client --}}
  <div class="section">
    <div class="section-title">Datos del Cliente</div>
    <div class="grid2">
      <div><div class="field-label">Nombre</div><div class="field-value">{{ $quote->client_name }}</div></div>
      <div><div class="field-label">Teléfono</div><div class="field-value">{{ $quote->phone }}</div></div>
      <div><div class="field-label">Email</div><div class="field-value">{{ $quote->email }}</div></div>
      <div><div class="field-label">Fecha de mudanza</div><div class="field-value">{{ $quote->move_date->format('d/m/Y') }}</div></div>
    </div>
  </div>

  {{-- Logistics --}}
  <div class="section">
    <div class="section-title">Logística</div>
    <div class="grid2">
      <div>
        <div class="field-label">Origen</div>
        <div class="field-value">{{ $quote->origin_address }}</div>
        <div style="color:#71717a;font-size:10px;margin-top:2px">{{ $quote->origin_housing_type }}, planta {{ $quote->origin_floor }}</div>
      </div>
      <div>
        <div class="field-label">Destino</div>
        <div class="field-value">{{ $quote->destination_address }}</div>
        <div style="color:#71717a;font-size:10px;margin-top:2px">{{ $quote->destination_housing_type }}, planta {{ $quote->destination_floor }}</div>
      </div>
    </div>
    @if($quote->distance_km > 0)
    <div style="margin-top:10px"><div class="field-label">Distancia</div><div class="field-value">{{ $quote->distance_km }} km</div></div>
    @endif
  </div>

  {{-- Inventory --}}
  <div class="section">
    <div class="section-title">Inventario</div>
    <table>
      <tr><th>Artículo</th><th>Cantidad</th><th>Volumen</th></tr>
      @foreach($quote->inventory as $item)
        @php
          $def = collect($inventoryItems)->firstWhere('id', $item['itemId']);
          $name = $def ? $def['name'] : ($item['customName'] ?? 'Custom');
          $vol = $def ? $def['volume'] : ($item['customVolume'] ?? 0);
          $totalVol = round($vol * $item['quantity'], 2);
        @endphp
        <tr>
          <td>{{ $name }}</td>
          <td>{{ $item['quantity'] }}</td>
          <td>{{ $totalVol }} m³</td>
        </tr>
      @endforeach
      <tr>
        <td colspan="2"><strong>Volumen total</strong></td>
        <td><strong>{{ $quote->total_volume }} m³</strong></td>
      </tr>
    </table>
  </div>

  {{-- Services --}}
  @if(!empty($quote->services))
  <div class="section">
    <div class="section-title">Servicios Adicionales</div>
    @foreach($quote->services as $sId)
      @php $s = collect($additionalServices)->firstWhere('id', $sId); @endphp
      @if($s)
        <div style="padding:4px 0; color:#3f3f46">• {{ $s['name'] }}</div>
      @endif
    @endforeach
  </div>
  @endif

  {{-- Total --}}
  @php $sym = $currencies[$quote->currency]['symbol'] ?? '€'; @endphp
  <div class="total-box">
    <div><div class="total-label">Precio Total Estimado</div></div>
    <div class="total-amount">{{ $sym }}{{ number_format($quote->total_price, 2) }}</div>
  </div>

  {{-- Signature --}}
  @if($quote->signature)
  <div class="sig-section">
    <div class="section-title" style="margin-top:20px">Firma del Cliente</div>
    <div class="sig-box">
      <img src="{{ $quote->signature }}" style="max-height:80px" />
    </div>
  </div>
  @endif

  <div class="footer">Generado por MudaEasy &bull; {{ now()->format('d/m/Y H:i') }}</div>
</div>
</body>
</html>
