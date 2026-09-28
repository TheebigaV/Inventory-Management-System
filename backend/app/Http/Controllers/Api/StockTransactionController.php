<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockTransaction;
use App\Models\Item;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockTransactionController extends Controller
{
    public function index()
    {
        $transactions = StockTransaction::with(['item', 'user'])
            ->latest()
            ->get();
        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'type' => 'required|in:in,out,adjustment',
            'quantity' => 'required|integer|min:1',
            'reason' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($request) {
            $item = Item::findOrFail($request->item_id);
            $type = $request->type;
            $qty = (int) $request->quantity;

            if ($type === 'out' && $item->quantity < $qty) {
                return response()->json([
                    'message' => "Insufficient stock. Current stock is {$item->quantity}, requested {$qty}."
                ], 422);
            }

            if ($type === 'in') {
                $item->quantity += $qty;
            } elseif ($type === 'out') {
                $item->quantity -= $qty;
            } elseif ($type === 'adjustment') {
                $item->quantity = $qty;
            }
            $item->save();

            $transaction = StockTransaction::create([
                'item_id' => $item->id,
                'user_id' => $request->user()?->id,
                'type' => $type,
                'quantity' => $qty,
                'reason' => $request->reason ?? "Stock transaction: {$type}",
            ]);

            ActivityLog::create([
                'user_id' => $request->user()?->id,
                'action' => 'STOCK_TRANSACTION',
                'model_type' => 'StockTransaction',
                'model_id' => $transaction->id,
                'new_value' => $transaction->toArray(),
                'description' => "Stock {$type} of {$qty} units for item '{$item->name}'. New balance: {$item->quantity}",
            ]);

            return response()->json($transaction->load(['item', 'user']), 201);
        });
    }
}
