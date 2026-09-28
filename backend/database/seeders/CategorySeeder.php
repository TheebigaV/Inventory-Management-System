<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Networking Devices',
                'code' => 'NET-CAT',
                'description' => 'Switches, routers, patch panels, and networking hardware',
            ],
            [
                'name' => 'Computers & Laptops',
                'code' => 'COMP-CAT',
                'description' => 'Laptops, workstations, desktops, and tablet computers',
            ],
            [
                'name' => 'Test & Measurement',
                'code' => 'TEST-CAT',
                'description' => 'Multimeters, oscilloscopes, cable testers, and soldering stations',
            ],
            [
                'name' => 'Peripherals & Accessories',
                'code' => 'ACC-CAT',
                'description' => 'Docking stations, barcode scanners, monitors, and cables',
            ],
            [
                'name' => 'Consumables & Cables',
                'code' => 'CBL-CAT',
                'description' => 'Patch cords, fiber jumpers, electrical tape, and wire connectors',
            ],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['code' => $cat['code']], $cat);
        }
    }
}
