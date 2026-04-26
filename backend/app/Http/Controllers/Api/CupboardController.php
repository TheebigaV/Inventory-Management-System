<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cupboard;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class CupboardController extends Controller
{
    public function index()
    {
        $cupboards = Cupboard::withCount('places')->orderBy('name')->get();
        return response()->json($cupboards);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $cupboard = Cupboard::create($request->only('name', 'description'));

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'CUPBOARD_CREATED',
            'model_type' => 'Cupboard',
            'model_id' => $cupboard->id,
            'new_value' => $cupboard->toArray(),
            'description' => "Created cupboard: {$cupboard->name}",
        ]);

        return response()->json($cupboard, 201);
    }

    public function show($id)
    {
        $cupboard = Cupboard::with('places.items')->findOrFail($id);
        return response()->json($cupboard);
    }

    public function update(Request $request, $id)
    {
        $cupboard = Cupboard::findOrFail($id);
        $old = $cupboard->toArray();

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $cupboard->update($request->only('name', 'description'));

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'CUPBOARD_UPDATED',
            'model_type' => 'Cupboard',
            'model_id' => $cupboard->id,
            'previous_value' => $old,
            'new_value' => $cupboard->toArray(),
            'description' => "Updated cupboard: {$cupboard->name}",
        ]);

        return response()->json($cupboard);
    }

    public function destroy(Request $request, $id)
    {
        $cupboard = Cupboard::findOrFail($id);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'CUPBOARD_DELETED',
            'model_type' => 'Cupboard',
            'model_id' => $cupboard->id,
            'previous_value' => $cupboard->toArray(),
            'description' => "Deleted cupboard: {$cupboard->name}",
        ]);

        $cupboard->delete();

        return response()->json(['message' => 'Cupboard deleted successfully']);
    }
}
