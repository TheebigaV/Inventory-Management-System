<?php

namespace Database\Seeders;

use App\Models\Cupboard;
use Illuminate\Database\Seeder;

class CupboardSeeder extends Seeder
{
    public function run(): void
    {
        Cupboard::firstOrCreate(
            ['name' => 'Cupboard A - Server Racks & Networking'],
            ['description' => 'Main networking hardware, rackmount switches, and fiber patch panels.']
        );

        Cupboard::firstOrCreate(
            ['name' => 'Cupboard B - Laptops & Mobile Devices'],
            ['description' => 'Storage for corporate laptops, tablets, and charging docks.']
        );

        Cupboard::firstOrCreate(
            ['name' => 'Cupboard C - Lab & Test Instruments'],
            ['description' => 'Oscilloscopes, digital multimeters, power supplies, and logic analyzers.']
        );

        Cupboard::firstOrCreate(
            ['name' => 'Cupboard D - Office Supplies & Accessories'],
            ['description' => 'Barcodes scanners, HDMI cables, wireless mice, and keyboard bundles.']
        );
    }
}
