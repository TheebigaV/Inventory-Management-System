<?php

namespace Database\Seeders;

use App\Models\Cupboard;
use App\Models\Place;
use Illuminate\Database\Seeder;

class PlaceSeeder extends Seeder
{
    public function run(): void
    {
        $cupboardA = Cupboard::where('name', 'like', 'Cupboard A%')->first();
        $cupboardB = Cupboard::where('name', 'like', 'Cupboard B%')->first();
        $cupboardC = Cupboard::where('name', 'like', 'Cupboard C%')->first();
        $cupboardD = Cupboard::where('name', 'like', 'Cupboard D%')->first();

        if ($cupboardA) {
            Place::firstOrCreate(
                ['name' => 'Shelf A1 - Switches & Routers'],
                ['cupboard_id' => $cupboardA->id, 'description' => 'Top shelf for managed Gigabit switches.']
            );
            Place::firstOrCreate(
                ['name' => 'Shelf A2 - Fiber & Patch Cables'],
                ['cupboard_id' => $cupboardA->id, 'description' => 'Middle shelf containing LC-LC fiber cables.']
            );
        }

        if ($cupboardB) {
            Place::firstOrCreate(
                ['name' => 'Shelf B1 - High-End Laptops'],
                ['cupboard_id' => $cupboardB->id, 'description' => 'Secure shelf with laptop lock mounts.']
            );
            Place::firstOrCreate(
                ['name' => 'Shelf B2 - Docking Stations'],
                ['cupboard_id' => $cupboardB->id, 'description' => 'Thunderbolt 4 expansion docks.']
            );
        }

        if ($cupboardC) {
            Place::firstOrCreate(
                ['name' => 'Shelf C1 - Precision Multimeters'],
                ['cupboard_id' => $cupboardC->id, 'description' => 'Calibrated digital measuring units.']
            );
            Place::firstOrCreate(
                ['name' => 'Shelf C2 - Soldering Stations'],
                ['cupboard_id' => $cupboardC->id, 'description' => 'ESD-safe soldering and rework tools.']
            );
        }

        if ($cupboardD) {
            Place::firstOrCreate(
                ['name' => 'Shelf D1 - Barcode Scanners'],
                ['cupboard_id' => $cupboardD->id, 'description' => 'Handheld wireless Bluetooth scanners.']
            );
            Place::firstOrCreate(
                ['name' => 'Shelf D2 - Cables & Converters'],
                ['cupboard_id' => $cupboardD->id, 'description' => 'HDMI to DisplayPort adapters.']
            );
        }
    }
}
