<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Place;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    public function index(Request $request)
    {
        $query = Place::with('cupboard')->withCount('items');

        if ($request->has('cupboard_id')) {
            $query->where('cupboard_id', $request->cupboard_id);
        }

        $places = $query->orderBy('name')->get();
        return response()->json($places);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cupboard_id' => 'required|exists:cupboards,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $place = Place::create($request->only('cupboard_id', 'name', 'description'));

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'PLACE_CREATED',
            'model_type' => 'Place',
            'model_id' => $place->id,
            'new_value' => $place->toArray(),
            'description' => "Created place: {$place->name}",
        ]);

        return response()->json($place->load('cupboard'), 201);
    }

    public function show($id)
    {
        $place = Place::with(['cupboard', 'items'])->findOrFail($id);
        return response()->json($place);
    }

    public function update(Request $request, $id)
    {
        $place = Place::findOrFail($id);
        $old = $place->toArray();

        $request->validate([
            'cupboard_id' => 'required|exists:cupboards,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $place->update($request->only('cupboard_id', 'name', 'description'));

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'PLACE_UPDATED',
            'model_type' => 'Place',
            'model_id' => $place->id,
            'previous_value' => $old,
            'new_value' => $place->toArray(),
            'description' => "Updated place: {$place->name}",
        ]);

        return response()->json($place->load('cupboard'));
    }

    public function destroy(Request $request, $id)
    {
        $place = Place::findOrFail($id);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'PLACE_DELETED',
            'model_type' => 'Place',
            'model_id' => $place->id,
            'previous_value' => $place->toArray(),
            'description' => "Deleted place: {$place->name}",
        ]);

        $place->delete();

        return response()->json(['message' => 'Place deleted successfully']);
    }
}
