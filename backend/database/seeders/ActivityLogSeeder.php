<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Item;
use App\Models\ActivityLog;
use Illuminate\Database\Seeder;

class ActivityLogSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@inventory.com')->first();
        $staff = User::where('email', 'staff@inventory.com')->first();
        $laptop = Item::where('code', 'LAP-DELL-5540')->first();

        if ($admin) {
            ActivityLog::firstOrCreate(
                ['description' => "Created item: Dell Latitude 5540 Laptop"],
                [
                    'user_id' => $admin->id,
                    'action' => 'ITEM_CREATED',
                    'model_type' => 'Item',
                    'model_id' => $laptop ? $laptop->id : 1,
                    'new_value' => ['name' => 'Dell Latitude 5540 Laptop', 'quantity' => 25],
                ]
            );
        }

        if ($staff) {
            ActivityLog::firstOrCreate(
                ['description' => 'Borrowed 2 units of MacBook Pro 16" M3 Max'],
                [
                    'user_id' => $staff->id,
                    'action' => 'ITEM_BORROWED',
                    'model_type' => 'BorrowingLog',
                    'model_id' => 1,
                    'new_value' => ['item' => 'MacBook Pro 16" M3 Max', 'borrower' => 'Alex Morgan'],
                ]
            );
        }

        if ($admin) {
            ActivityLog::firstOrCreate(
                ['description' => 'Returned 4 units of Zebra 2D Barcode Scanner'],
                [
                    'user_id' => $admin->id,
                    'action' => 'ITEM_RETURNED',
                    'model_type' => 'BorrowingLog',
                    'model_id' => 3,
                    'new_value' => ['item' => 'Zebra 2D Barcode Scanner', 'borrower' => 'David Miller'],
                ]
            );
        }
    }
}
