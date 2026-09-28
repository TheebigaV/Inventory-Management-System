<?php

namespace Database\Seeders;

use App\Models\Place;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\Item;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    public function run(): void
    {
        $placeA1 = Place::where('name', 'like', 'Shelf A1%')->first();
        $placeA2 = Place::where('name', 'like', 'Shelf A2%')->first();
        $placeB1 = Place::where('name', 'like', 'Shelf B1%')->first();
        $placeB2 = Place::where('name', 'like', 'Shelf B2%')->first();
        $placeC1 = Place::where('name', 'like', 'Shelf C1%')->first();
        $placeC2 = Place::where('name', 'like', 'Shelf C2%')->first();
        $placeD1 = Place::where('name', 'like', 'Shelf D1%')->first();

        $catNet = Category::where('code', 'NET-CAT')->first();
        $catComp = Category::where('code', 'COMP-CAT')->first();
        $catTest = Category::where('code', 'TEST-CAT')->first();
        $catAcc = Category::where('code', 'ACC-CAT')->first();
        $catCbl = Category::where('code', 'CBL-CAT')->first();

        $supCisco = Supplier::where('name', 'like', 'Cisco%')->first();
        $supDell = Supplier::where('name', 'like', 'Dell%')->first();
        $supApple = Supplier::where('name', 'like', 'Apple%')->first();
        $supFluke = Supplier::where('name', 'like', 'Fluke%')->first();
        $supZebra = Supplier::where('name', 'like', 'Zebra%')->first();

        Item::updateOrCreate(
            ['code' => 'NET-SW-001'],
            [
                'place_id' => $placeA1 ? $placeA1->id : 1,
                'category_id' => $catNet?->id,
                'supplier_id' => $supCisco?->id,
                'name' => 'Cisco Catalyst 48-Port Switch',
                'quantity' => 14,
                'serial_number' => 'CSCO-9823-X1',
                'description' => 'Managed Layer 3 Gigabit Ethernet PoE+ Switch.',
                'status' => 'in-store',
            ]
        );

        Item::updateOrCreate(
            ['code' => 'LAP-DELL-5540'],
            [
                'place_id' => $placeB1 ? $placeB1->id : 1,
                'category_id' => $catComp?->id,
                'supplier_id' => $supDell?->id,
                'name' => 'Dell Latitude 5540 Laptop',
                'quantity' => 25,
                'serial_number' => 'DELL-LAT-8841',
                'description' => 'Intel Core i7, 32GB RAM, 1TB NVMe SSD.',
                'status' => 'in-store',
            ]
        );

        Item::updateOrCreate(
            ['code' => 'LAP-APPLE-M3'],
            [
                'place_id' => $placeB1 ? $placeB1->id : 1,
                'category_id' => $catComp?->id,
                'supplier_id' => $supApple?->id,
                'name' => 'MacBook Pro 16" M3 Max',
                'quantity' => 8,
                'serial_number' => 'APL-M3X-9901',
                'description' => 'Apple M3 Max, 36GB Unified Memory, Space Black.',
                'status' => 'borrowed',
            ]
        );

        Item::updateOrCreate(
            ['code' => 'TST-FLUKE-87V'],
            [
                'place_id' => $placeC1 ? $placeC1->id : 1,
                'category_id' => $catTest?->id,
                'supplier_id' => $supFluke?->id,
                'name' => 'Fluke 87V Digital Multimeter',
                'quantity' => 12,
                'serial_number' => 'FLK-87V-4421',
                'description' => 'Industrial true-RMS digital multimeter with temperature probe.',
                'status' => 'in-store',
            ]
        );

        Item::updateOrCreate(
            ['code' => 'SCN-ZEB-2D'],
            [
                'place_id' => $placeD1 ? $placeD1->id : 1,
                'category_id' => $catAcc?->id,
                'supplier_id' => $supZebra?->id,
                'name' => 'Zebra 2D Barcode Scanner',
                'quantity' => 18,
                'serial_number' => 'ZEB-SCN-7712',
                'description' => 'Wireless Bluetooth handheld 1D/2D scanner unit.',
                'status' => 'in-store',
            ]
        );

        Item::updateOrCreate(
            ['code' => 'ACC-DCK-TB4'],
            [
                'place_id' => $placeB2 ? $placeB2->id : 1,
                'category_id' => $catAcc?->id,
                'supplier_id' => $supDell?->id,
                'name' => 'Dell Thunderbolt 4 Dock WD22TB4',
                'quantity' => 30,
                'serial_number' => 'DELL-DCK-3390',
                'description' => 'Dual 4K display dock with 130W power delivery.',
                'status' => 'in-store',
            ]
        );

        Item::updateOrCreate(
            ['code' => 'CBL-FBR-LC10'],
            [
                'place_id' => $placeA2 ? $placeA2->id : 1,
                'category_id' => $catCbl?->id,
                'supplier_id' => $supCisco?->id,
                'name' => 'LC-LC Duplex Fiber Cable (10m)',
                'quantity' => 50,
                'serial_number' => 'FBR-10M-5012',
                'description' => 'OM4 50/125 Multimode Fiber Optic Patch Cable.',
                'status' => 'in-store',
            ]
        );

        Item::updateOrCreate(
            ['code' => 'TL-HKO-888D'],
            [
                'place_id' => $placeC2 ? $placeC2->id : 1,
                'category_id' => $catTest?->id,
                'supplier_id' => $supFluke?->id,
                'name' => 'Hakko FX-888D Soldering Station',
                'quantity' => 3,
                'serial_number' => 'HKO-SOL-1123',
                'description' => 'Digital ESD-safe soldering station with temperature lock.',
                'status' => 'damaged',
            ]
        );
    }
}
