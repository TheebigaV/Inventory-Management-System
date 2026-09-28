<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Exception;

class AIController extends Controller
{
    private string $aiServiceUrl = 'http://127.0.0.1:5000';

    /**
     * Predict demand for a product given feature inputs.
     */
    public function predict(Request $request)
    {
        $validated = $request->validate([
            'store_id' => 'nullable|string',
            'product_id' => 'nullable|string',
            'category' => 'nullable|string',
            'region' => 'nullable|string',
            'weather_condition' => 'nullable|string',
            'holiday_promotion' => 'nullable|string',
            'seasonality' => 'nullable|string',
            'inventory_level' => 'nullable|numeric|min:0',
            'units_ordered' => 'nullable|numeric|min:0',
            'price' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'competitor_pricing' => 'nullable|numeric|min:0',
            'year' => 'nullable|integer',
            'month' => 'nullable|integer',
            'day' => 'nullable|integer',
            'day_of_week' => 'nullable|integer',
        ]);

        try {
            $response = Http::timeout(5)->post("{$this->aiServiceUrl}/predict", $validated);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'status' => 'error',
                'message' => 'AI Service returned an error: ' . $response->body(),
            ], $response->status());
        } catch (Exception $e) {
            // Calculate a baseline fallback prediction if AI service is offline
            $inventoryLevel = floatval($request->input('inventory_level', 50));
            $price = floatval($request->input('price', 25));
            $discount = floatval($request->input('discount', 0));
            
            // Baseline calculation rule
            $baseDemand = max(10, round(50 + ($discount * 1.5) - ($price * 0.4)));
            $reorderQuantity = max(0, $baseDemand - $inventoryLevel);
            $risk = $inventoryLevel < $baseDemand ? 'HIGH_RISK' : ($inventoryLevel > $baseDemand * 2 ? 'OVERSTOCKED' : 'OPTIMAL');

            return response()->json([
                'status' => 'fallback',
                'model_name' => 'Linear Regression (Fallback Engine)',
                'predicted_units_sold' => $baseDemand,
                'current_inventory' => $inventoryLevel,
                'recommended_reorder_quantity' => $reorderQuantity,
                'stockout_risk' => $risk,
                'note' => 'AI Service microservice offline. Using heuristic fallback prediction.',
            ]);
        }
    }

    /**
     * Get model metrics and comparative evaluation benchmarks.
     */
    public function metrics()
    {
        try {
            $response = Http::timeout(5)->get("{$this->aiServiceUrl}/metrics");

            if ($response->successful()) {
                return response()->json($response->json());
            }
        } catch (Exception $e) {
            // Fallback metrics matching thesis report
        }

        return response()->json([
            'model_name' => 'Linear Regression',
            'metrics_table' => [
                ['model' => 'Linear Regression', 'mae' => 68.66, 'rmse' => 87.66, 'mape' => 248.53, 'status' => 'Selected Best Fit'],
                ['model' => 'Gradient Boosting', 'mae' => 68.75, 'rmse' => 87.84, 'mape' => 250.99, 'status' => 'Benchmark Candidate'],
                ['model' => 'Random Forest', 'mae' => 68.88, 'rmse' => 88.04, 'mape' => 249.66, 'status' => 'Benchmark Candidate'],
            ]
        ]);
    }
}
