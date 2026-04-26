<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CupboardController;
use App\Http\Controllers\Api\PlaceController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\BorrowingController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (requires auth)
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Cupboards
    Route::apiResource('cupboards', CupboardController::class);

    // Places
    Route::apiResource('places', PlaceController::class);

    // Items
    Route::apiResource('items', ItemController::class);
    Route::patch('/items/{id}/quantity', [ItemController::class, 'updateQuantity']);

    // Borrowing
    Route::get('/borrowings', [BorrowingController::class, 'index']);
    Route::post('/borrowings', [BorrowingController::class, 'borrow']);
    Route::patch('/borrowings/{id}/return', [BorrowingController::class, 'returnItem']);

    // Admin-only routes
    Route::middleware('admin')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::get('/users', [AuthController::class, 'users']);
        Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    });
});
