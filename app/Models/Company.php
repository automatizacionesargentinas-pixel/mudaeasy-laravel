<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = [
        'user_id', 'name', 'description',
        'latitude', 'longitude',
        'price_per_m3', 'price_per_km', 'min_time_price',
        'currency', 'rating', 'is_verified',
    ];

    protected $casts = [
        'is_verified'   => 'boolean',
        'rating'        => 'float',
        'price_per_m3'  => 'float',
        'price_per_km'  => 'float',
        'min_time_price'=> 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
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
