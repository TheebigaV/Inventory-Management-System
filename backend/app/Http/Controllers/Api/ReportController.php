<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\StockTransaction;
use App\Models\BorrowingLog;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function summary()
    {
        $totalItems = Item::count();
        $totalCategories = Category::count();
        $totalSuppliers = Supplier::count();
        $totalQuantity = Item::sum('quantity');

        $lowStockItems = Item::where('quantity', '<=', 5)->get();
        $activeBorrowings = BorrowingLog::where('status', 'borrowed')->count();

        $recentTransactions = StockTransaction::with(['item', 'user'])
            ->latest()
            ->take(10)
            ->get();

        return response()->json([
            'total_items' => $totalItems,
            'total_categories' => $totalCategories,
            'total_suppliers' => $totalSuppliers,
            'total_stock_units' => $totalQuantity,
            'low_stock_count' => $lowStockItems->count(),
            'active_borrowings' => $activeBorrowings,
            'low_stock_items' => $lowStockItems,
            'recent_transactions' => $recentTransactions,
        ]);
    }
}
