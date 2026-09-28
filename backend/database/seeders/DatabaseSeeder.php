<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CupboardSeeder::class,
            PlaceSeeder::class,
            CategorySeeder::class,
            SupplierSeeder::class,
            ItemSeeder::class,
            StockTransactionSeeder::class,
            BorrowingLogSeeder::class,
            ActivityLogSeeder::class,
        ]);
    }
}
