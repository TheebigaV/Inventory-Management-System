<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Cupboard;
use App\Models\Place;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\Item;
use App\Models\StockTransaction;
use App\Models\BorrowingLog;
use App\Models\ActivityLog;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EndToEndFunctionalityTest extends TestCase
{
    use RefreshDatabase;

    public function test_end_to_end_system_functionality_and_database_persistence(): void
    {
        // 1. User Auth & Token Creation
        $user = User::factory()->create([
            'role' => 'admin',
        ]);
        $this->assertDatabaseHas('users', ['id' => $user->id]);

        $this->actingAs($user, 'sanctum');

        // 2. Cupboard Creation
        $cupboardRes = $this->postJson('/api/cupboards', [
            'name' => 'Main Electronics Storage',
            'description' => 'Cupboard for storing high-value devices',
        ]);
        $cupboardRes->assertStatus(201);
        $cupboardId = $cupboardRes->json('id');
        $this->assertDatabaseHas('cupboards', [
            'id' => $cupboardId,
            'name' => 'Main Electronics Storage',
        ]);

        // 3. Storage Place Creation
        $placeRes = $this->postJson('/api/places', [
            'cupboard_id' => $cupboardId,
            'name' => 'Shelf A1',
            'description' => 'Top Shelf',
        ]);
        $placeRes->assertStatus(201);
        $placeId = $placeRes->json('id');
        $this->assertDatabaseHas('places', [
            'id' => $placeId,
            'name' => 'Shelf A1',
            'cupboard_id' => $cupboardId,
        ]);

        // 4. Category Creation
        $catRes = $this->postJson('/api/categories', [
            'name' => 'Laptops & Computers',
            'code' => 'COMP-001',
            'description' => 'Portable computers',
        ]);
        $catRes->assertStatus(201);
        $catId = $catRes->json('id');
        $this->assertDatabaseHas('categories', [
            'id' => $catId,
            'code' => 'COMP-001',
        ]);

        // 5. Supplier Creation
        $supRes = $this->postJson('/api/suppliers', [
            'name' => 'TechDistributor Ltd',
            'contact_person' => 'Jane Smith',
            'email' => 'jane@techdist.com',
            'phone' => '+1 555-9876',
            'address' => '100 Innovation Way',
        ]);
        $supRes->assertStatus(201);
        $supId = $supRes->json('id');
        $this->assertDatabaseHas('suppliers', [
            'id' => $supId,
            'name' => 'TechDistributor Ltd',
        ]);

        // 6. Inventory Item Creation
        $itemRes = $this->postJson('/api/items', [
            'place_id' => $placeId,
            'category_id' => $catId,
            'supplier_id' => $supId,
            'name' => 'Dell XPS 15 Laptop',
            'code' => 'DELL-XPS-15',
            'quantity' => 20,
            'serial_number' => 'SN-DELL-9981',
            'description' => '15-inch laptop',
        ]);
        $itemRes->assertStatus(201);
        $itemId = $itemRes->json('id');
        $this->assertDatabaseHas('items', [
            'id' => $itemId,
            'name' => 'Dell XPS 15 Laptop',
            'code' => 'DELL-XPS-15',
            'category_id' => $catId,
            'supplier_id' => $supId,
            'quantity' => 20,
        ]);

        // 7. Stock Transactions (Stock In & Stock Out)
        // Stock In (+10)
        $stockInRes = $this->postJson('/api/stock-transactions', [
            'item_id' => $itemId,
            'type' => 'in',
            'quantity' => 10,
            'reason' => 'Shipment received from TechDistributor',
        ]);
        $stockInRes->assertStatus(201);
        $this->assertDatabaseHas('items', ['id' => $itemId, 'quantity' => 30]);
        $this->assertDatabaseHas('stock_transactions', [
            'item_id' => $itemId,
            'type' => 'in',
            'quantity' => 10,
        ]);

        // Stock Out (-5)
        $stockOutRes = $this->postJson('/api/stock-transactions', [
            'item_id' => $itemId,
            'type' => 'out',
            'quantity' => 5,
            'reason' => 'Sales order #1002',
        ]);
        $stockOutRes->assertStatus(201);
        $this->assertDatabaseHas('items', ['id' => $itemId, 'quantity' => 25]);
        $this->assertDatabaseHas('stock_transactions', [
            'item_id' => $itemId,
            'type' => 'out',
            'quantity' => 5,
        ]);

        // 8. Borrowing Flow
        $borrowRes = $this->postJson('/api/borrowings', [
            'item_id' => $itemId,
            'borrower_name' => 'Mathusha V.',
            'quantity_borrowed' => 2,
            'notes' => 'Borrowed for lab testing',
        ]);
        $borrowRes->assertStatus(201);
        $borrowId = $borrowRes->json('id');
        $this->assertDatabaseHas('items', ['id' => $itemId, 'quantity' => 23]);
        $this->assertDatabaseHas('borrowing_logs', [
            'id' => $borrowId,
            'status' => 'borrowed',
            'quantity_borrowed' => 2,
        ]);

        // Return Item
        $returnRes = $this->patchJson("/api/borrowings/{$borrowId}/return");
        $returnRes->assertStatus(200);
        $this->assertDatabaseHas('items', ['id' => $itemId, 'quantity' => 25]);
        $this->assertDatabaseHas('borrowing_logs', [
            'id' => $borrowId,
            'status' => 'returned',
        ]);

        // 9. Reports Summary API Check
        $reportRes = $this->getJson('/api/reports/summary');
        $reportRes->assertStatus(200)
            ->assertJson([
                'total_items' => 1,
                'total_categories' => 1,
                'total_suppliers' => 1,
                'total_stock_units' => 25,
            ]);

        // 10. Activity Log Verification
        $this->assertDatabaseHas('activity_logs', [
            'action' => 'CUPBOARD_CREATED',
            'model_id' => $cupboardId,
        ]);
        $this->assertDatabaseHas('activity_logs', [
            'action' => 'CATEGORY_CREATED',
            'model_id' => $catId,
        ]);
        $this->assertDatabaseHas('activity_logs', [
            'action' => 'SUPPLIER_CREATED',
            'model_id' => $supId,
        ]);
    }
}
