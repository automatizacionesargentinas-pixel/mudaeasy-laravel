<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class QuoteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $quotes = $request->user()
            ->quotes()
            ->with('company')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($quotes);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'client_name'              => 'required|string|max:255',
            'phone'                    => 'required|string|max:50',
            'email'                    => 'required|email',
            'origin_address'           => 'required|string',
            'destination_address'      => 'required|string',
            'move_date'                => 'required|date',
            'origin_housing_type'      => 'required|string',
            'destination_housing_type' => 'required|string',
            'origin_floor'             => 'integer|min:0',
            'destination_floor'        => 'integer|min:0',
            'distance_km'              => 'numeric|min:0',
            'charge_by_distance'       => 'boolean',
            'charge_by_min_time'       => 'boolean',
            'inventory'                => 'required|array',
            'services'                 => 'array',
            'signature'                => 'nullable|string',
            'status'                   => 'in:Borrador,Enviado,Aceptado',
            'total_volume'             => 'numeric|min:0',
            'total_price'              => 'numeric|min:0',
            'currency'                 => 'in:ARS,EUR,USD',
            'company_id'               => 'nullable|exists:companies,id',
        ]);

        $quote = $request->user()->quotes()->create($data);

        return response()->json($quote, 201);
    }

    public function show(Request $request, Quote $quote): JsonResponse
    {
        $this->authorize($request->user(), $quote);
        return response()->json($quote->load('company'));
    }

    public function update(Request $request, Quote $quote): JsonResponse
    {
        $this->authorize($request->user(), $quote);
        $quote->update($request->all());
        return response()->json($quote);
    }

    public function destroy(Request $request, Quote $quote): JsonResponse
    {
        $this->authorize($request->user(), $quote);
        $quote->delete();
        return response()->json(['ok' => true]);
    }

    public function pdf(Request $request, Quote $quote): Response
    {
        $this->authorize($request->user(), $quote);

        $inventoryItems = config('mudaeasy.inventory_items');
        $additionalServices = config('mudaeasy.additional_services');
        $currencies = config('mudaeasy.currencies');

        $pdf = Pdf::loadView('pdf.quote', compact('quote', 'inventoryItems', 'additionalServices', 'currencies'));
        $pdf->setPaper('a4');

        return $pdf->download("Presupuesto_{$quote->client_name}.pdf");
    }

    private function authorize(object $user, Quote $quote): void
    {
        abort_if($quote->user_id !== $user->id, 403, 'Unauthorized');
    }
}
