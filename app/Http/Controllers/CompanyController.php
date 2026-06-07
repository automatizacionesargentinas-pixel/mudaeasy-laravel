<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index(): JsonResponse
    {
        $companies = Company::with('user')->get();
        return response()->json($companies);
    }

    public function mine(Request $request): JsonResponse
    {
        $company = $request->user()->company;
        return response()->json($company);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'description'    => 'nullable|string',
            'latitude'       => 'nullable|numeric',
            'longitude'      => 'nullable|numeric',
            'price_per_m3'   => 'numeric|min:0',
            'price_per_km'   => 'numeric|min:0',
            'min_time_price' => 'numeric|min:0',
            'currency'       => 'in:ARS,EUR,USD',
        ]);

        $company = $request->user()->company()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $data
        );

        return response()->json($company, 201);
    }

    public function update(Request $request, Company $company): JsonResponse
    {
        abort_if($company->user_id !== $request->user()->id, 403);
        $company->update($request->all());
        return response()->json($company);
    }
}
