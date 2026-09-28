<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\User;
use App\Models\StockTransaction;
use Illuminate\Database\Seeder;

class StockTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        $items = Item::all();

        if ($items->isEmpty()) {
            return;
        }

        $sampleTransactions = [
            ['type' => 'in', 'quantity' => 15, 'reason' => 'Initial bulk order restock from vendor'],
            ['type' => 'out', 'quantity' => 2, 'reason' => 'Issued to Engineering Department'],
            ['type' => 'in', 'quantity' => 10, 'reason' => 'Quarterly replenishment shipment'],
            ['type' => 'adjustment', 'quantity' => 8, 'reason' => 'Physical inventory count adjustment'],
        ];

        foreach ($items as $item) {
            foreach ($sampleTransactions as $st) {
                StockTransaction::create([
                    'item_id' => $item->id,
                    'user_id' => $user?->id,
                    'type' => $st['type'],
                    'quantity' => $st['quantity'],
                    'reason' => "{$st['reason']} for {$item->name}",
                ]);
            }
        }
    }
}
