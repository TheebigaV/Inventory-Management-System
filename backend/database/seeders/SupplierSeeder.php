<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'Cisco Systems Ltd',
                'contact_person' => 'Sarah Connor',
                'email' => 'orders@cisco-direct.com',
                'phone' => '+1 (800) 553-6387',
                'address' => '170 West Tasman Dr, San Jose, CA 95134',
            ],
            [
                'name' => 'Dell Technologies Direct',
                'contact_person' => 'Mark Harrison',
                'email' => 'b2b.sales@dell.com',
                'phone' => '+1 (800) 456-3355',
                'address' => 'One Dell Way, Round Rock, TX 78682',
            ],
            [
                'name' => 'Apple Enterprise Sales',
                'contact_person' => 'David Miller',
                'email' => 'business@apple.com',
                'phone' => '+1 (800) 854-3680',
                'address' => 'One Apple Park Way, Cupertino, CA 95014',
            ],
            [
                'name' => 'Fluke Industrial Supply',
                'contact_person' => 'Rachel Green',
                'email' => 'support@flukecal.com',
                'phone' => '+1 (800) 443-5853',
                'address' => '6920 Seaway Blvd, Everett, WA 98203',
            ],
            [
                'name' => 'Zebra Technologies Inc',
                'contact_person' => 'James Wilson',
                'email' => 'partners@zebra.com',
                'phone' => '+1 (847) 634-6700',
                'address' => '3 Overlook Point, Lincolnshire, IL 60069',
            ],
        ];

        foreach ($suppliers as $sup) {
            Supplier::firstOrCreate(['name' => $sup['name']], $sup);
        }
    }
}
