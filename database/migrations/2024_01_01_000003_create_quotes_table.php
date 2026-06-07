<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('set null');
            $table->string('client_name');
            $table->string('phone');
            $table->string('email');
            $table->string('origin_address');
            $table->string('destination_address');
            $table->date('move_date');
            $table->enum('origin_housing_type', ['Piso con ascensor', 'Piso sin ascensor', 'Casa']);
            $table->enum('destination_housing_type', ['Piso con ascensor', 'Piso sin ascensor', 'Casa']);
            $table->integer('origin_floor')->default(0);
            $table->integer('destination_floor')->default(0);
            $table->decimal('distance_km', 8, 2)->default(0);
            $table->boolean('charge_by_distance')->default(false);
            $table->boolean('charge_by_min_time')->default(false);
            $table->json('inventory'); // [{itemId, quantity, customName?, customVolume?}]
            $table->json('services');  // [serviceId, ...]
            $table->text('signature')->nullable(); // base64
            $table->enum('status', ['Borrador', 'Enviado', 'Aceptado'])->default('Borrador');
            $table->decimal('total_volume', 10, 2)->default(0);
            $table->decimal('total_price', 10, 2)->default(0);
            $table->enum('currency', ['ARS', 'EUR', 'USD'])->default('EUR');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
