<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\User;
use App\Models\BorrowingLog;
use Illuminate\Database\Seeder;

class BorrowingLogSeeder extends Seeder
{
    public function run(): void
    {
        $staff = User::where('email', 'staff@inventory.com')->first();
        $admin = User::where('email', 'admin@inventory.com')->first();
        $macbook = Item::where('code', 'LAP-APPLE-M3')->first();
        $dellLaptop = Item::where('code', 'LAP-DELL-5540')->first();
        $scanner = Item::where('code', 'SCN-ZEB-2D')->first();

        if ($macbook && $staff) {
            BorrowingLog::firstOrCreate(
                ['borrower_name' => 'Alex Morgan (Senior Engineer)'],
                [
                    'item_id' => $macbook->id,
                    'user_id' => $staff->id,
                    'borrower_contact' => 'alex.morgan@company.com',
                    'quantity_borrowed' => 2,
                    'borrow_date' => now()->subDays(5),
                    'expected_return_date' => now()->addDays(7),
                    'returned_at' => null,
                    'status' => 'borrowed',
                    'notes' => 'Borrowed for remote AI model benchmark testing.',
                ]
            );
        }

        if ($dellLaptop && $staff) {
            BorrowingLog::firstOrCreate(
                ['borrower_name' => 'Sarah Connor (IT Ops)'],
                [
                    'item_id' => $dellLaptop->id,
                    'user_id' => $staff->id,
                    'borrower_contact' => '+1 555-0199',
                    'quantity_borrowed' => 3,
                    'borrow_date' => now()->subDays(12),
                    'expected_return_date' => now()->subDays(2),
                    'returned_at' => null,
                    'status' => 'overdue',
                    'notes' => 'Borrowed for annual field site audit.',
                ]
            );
        }

        if ($scanner && $admin) {
            BorrowingLog::firstOrCreate(
                ['borrower_name' => 'David Miller (Warehouse Manager)'],
                [
                    'item_id' => $scanner->id,
                    'user_id' => $admin->id,
                    'borrower_contact' => 'david.m@company.com',
                    'quantity_borrowed' => 4,
                    'borrow_date' => now()->subDays(15),
                    'expected_return_date' => now()->subDays(5),
                    'returned_at' => now()->subDays(1),
                    'status' => 'returned',
                    'notes' => 'Returned in good working condition after stock cycle count.',
                ]
            );
        }
    }
}
