<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Quote extends Model
{
    protected $fillable = [
        'user_id', 'company_id', 'client_name', 'phone', 'email',
        'origin_address', 'destination_address', 'move_date',
        'origin_housing_type', 'destination_housing_type',
        'origin_floor', 'destination_floor',
        'distance_km', 'charge_by_distance', 'charge_by_min_time',
        'inventory', 'services', 'signature',
        'status', 'total_volume', 'total_price', 'currency',
    ];

    protected $casts = [
        'inventory'           => 'array',
        'services'            => 'array',
        'charge_by_distance'  => 'boolean',
        'charge_by_min_time'  => 'boolean',
        'move_date'           => 'date',
        'total_volume'        => 'float',
        'total_price'         => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function getCurrencySymbolAttribute(): string
    {
        return match($this->currency) {
            'ARS' => '$',
            'USD' => 'US$',
            default => '€',
        };
    }
}
