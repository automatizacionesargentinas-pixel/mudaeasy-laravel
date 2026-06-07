<?php

return [
    'inventory_items' => [
        ['id' => 'sofa-3',   'name' => 'Sofá 3 plazas',     'volume' => 2.5, 'icon' => '🛋️'],
        ['id' => 'bed-mat',  'name' => 'Cama matrimonio',    'volume' => 2.0, 'icon' => '🛏️'],
        ['id' => 'table',    'name' => 'Mesa comedor',       'volume' => 1.8, 'icon' => '🪑'],
        ['id' => 'chair',    'name' => 'Silla',              'volume' => 0.3, 'icon' => '🪑'],
        ['id' => 'box-lg',   'name' => 'Caja grande',        'volume' => 0.8, 'icon' => '📦'],
        ['id' => 'box-md',   'name' => 'Caja mediana',       'volume' => 0.5, 'icon' => '📦'],
        ['id' => 'wardrobe', 'name' => 'Armario',            'volume' => 3.0, 'icon' => '🚪'],
        ['id' => 'fridge',   'name' => 'Nevera',             'volume' => 1.5, 'icon' => '❄️'],
        ['id' => 'tv',       'name' => 'Televisor',          'volume' => 0.4, 'icon' => '📺'],
        ['id' => 'washing',  'name' => 'Lavadora',           'volume' => 0.8, 'icon' => '🧼'],
    ],

    'additional_services' => [
        ['id' => 'packing',     'name' => 'Embalaje (10/m³)',       'type' => 'percentage_volume', 'value' => 10],
        ['id' => 'disassembly', 'name' => 'Desmontaje de muebles',  'type' => 'fixed',             'value' => 40],
        ['id' => 'assembly',    'name' => 'Montaje de muebles',     'type' => 'fixed',             'value' => 40],
    ],

    'currencies' => [
        'ARS' => ['symbol' => '$',   'name' => 'Pesos Argentinos'],
        'EUR' => ['symbol' => '€',   'name' => 'Euros'],
        'USD' => ['symbol' => 'US$', 'name' => 'Dólares'],
    ],

    'pricing' => [
        'price_per_m3'            => 45,
        'price_per_km'            => 1.5,
        'min_time_price'          => 120,
        'no_elevator_multiplier'  => 0.15,
        'high_floor_multiplier'   => 0.20,
    ],
];
