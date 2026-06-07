<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = ['name', 'email', 'google_id', 'avatar', 'role'];

    public function quotes(): HasMany { return $this->hasMany(Quote::class); }
    public function company(): HasOne  { return $this->hasOne(Company::class); }
    public function isCompany(): bool  { return $this->role === 'company'; }
    public function isClient(): bool   { return $this->role === 'client'; }
}
