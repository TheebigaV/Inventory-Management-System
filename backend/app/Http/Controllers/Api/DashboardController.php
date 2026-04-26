<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Cupboard;
use App\Models\BorrowingLog;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_items' => Item::count(),
            'total_cupboards' => Cupboard::count(),
            'items_in_store' => Item::where('status', 'in-store')->count(),
            'items_borrowed' => Item::where('status', 'borrowed')->count(),
            'items_damaged' => Item::where('status', 'damaged')->count(),
            'items_missing' => Item::where('status', 'missing')->count(),
            'active_borrowings' => BorrowingLog::where('status', 'borrowed')->count(),
            'total_quantity' => Item::sum('quantity'),
            'recent_activities' => ActivityLog::with('user')
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get(),
            'low_stock_items' => Item::where('quantity', '<=', 5)
                ->where('quantity', '>', 0)
                ->with('place.cupboard')
                ->get(),
        ]);
    }
}
