<?php

return [
    'google' => [
        'client_id'     => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect'      => env('GOOGLE_REDIRECT_URL', 'https://web-production-fccae8.up.railway.app/api/auth/google/callback'),
    ],
];
