<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BorrowingLog;
use App\Models\Item;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class BorrowingController extends Controller
{
    public function index(Request $request)
    {
        $query = BorrowingLog::with(['item.place.cupboard', 'user']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('item_id')) {
            $query->where('item_id', $request->item_id);
        }

        $logs = $query->orderBy('created_at', 'desc')->get();
        return response()->json($logs);
    }

    /**
     * Borrow an item - reduces stock.
     */
    public function borrow(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'borrower_name' => 'required|string|max:255',
            'borrower_contact' => 'nullable|string|max:255',
            'quantity_borrowed' => 'required|integer|min:1',
            'expected_return_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $item = Item::findOrFail($request->item_id);

        if ($item->quantity < $request->quantity_borrowed) {
            return response()->json(['message' => 'Insufficient stock. Available: ' . $item->quantity], 422);
        }

        // Reduce item quantity
        $oldQty = $item->quantity;
        $item->quantity -= $request->quantity_borrowed;
        if ($item->quantity === 0) {
            $item->status = 'borrowed';
        }
        $item->save();

        // Create borrowing log
        $log = BorrowingLog::create([
            'item_id' => $request->item_id,
            'user_id' => $request->user()->id,
            'borrower_name' => $request->borrower_name,
            'borrower_contact' => $request->borrower_contact,
            'quantity_borrowed' => $request->quantity_borrowed,
            'borrow_date' => now(),
            'expected_return_date' => $request->expected_return_date,
            'status' => 'borrowed',
            'notes' => $request->notes,
        ]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'ITEM_BORROWED',
            'model_type' => 'Item',
            'model_id' => $item->id,
            'previous_value' => ['quantity' => $oldQty],
            'new_value' => ['quantity' => $item->quantity, 'borrower' => $request->borrower_name],
            'description' => "Borrowed {$request->quantity_borrowed}x {$item->name} to {$request->borrower_name}",
        ]);

        return response()->json($log->load(['item', 'user']), 201);
    }

    /**
     * Return a borrowed item - restores stock.
     */
    public function returnItem(Request $request, $id)
    {
        $log = BorrowingLog::findOrFail($id);

        if ($log->status === 'returned') {
            return response()->json(['message' => 'This item has already been returned'], 422);
        }

        $item = Item::findOrFail($log->item_id);
        $oldQty = $item->quantity;

        // Restore quantity
        $item->quantity += $log->quantity_borrowed;
        if ($item->status === 'borrowed') {
            $item->status = 'in-store';
        }
        $item->save();

        // Update log
        $log->update([
            'status' => 'returned',
            'returned_at' => now(),
        ]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'ITEM_RETURNED',
            'model_type' => 'Item',
            'model_id' => $item->id,
            'previous_value' => ['quantity' => $oldQty],
            'new_value' => ['quantity' => $item->quantity, 'borrower' => $log->borrower_name],
            'description' => "Returned {$log->quantity_borrowed}x {$item->name} from {$log->borrower_name}",
        ]);

        return response()->json($log->load(['item', 'user']));
    }
}
