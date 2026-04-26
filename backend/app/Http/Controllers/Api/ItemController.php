<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with('place.cupboard');

        if ($request->has('place_id')) {
            $query->where('place_id', $request->place_id);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('serial_number', 'like', "%{$search}%");
            });
        }

        $items = $query->orderBy('name')->get();
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $request->validate([
            'place_id' => 'required|exists:places,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:items',
            'quantity' => 'required|integer|min:0',
            'serial_number' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:in-store,borrowed,damaged,missing',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->only('place_id', 'name', 'code', 'quantity', 'serial_number', 'description', 'status');

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('items', 'public');
        }

        $item = Item::create($data);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'ITEM_CREATED',
            'model_type' => 'Item',
            'model_id' => $item->id,
            'new_value' => $item->toArray(),
            'description' => "Created item: {$item->name} (Code: {$item->code})",
        ]);

        return response()->json($item->load('place.cupboard'), 201);
    }

    public function show($id)
    {
        $item = Item::with(['place.cupboard', 'borrowingLogs.user'])->findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = Item::findOrFail($id);
        $old = $item->toArray();

        $request->validate([
            'place_id' => 'required|exists:places,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:items,code,' . $id,
            'quantity' => 'required|integer|min:0',
            'serial_number' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:in-store,borrowed,damaged,missing',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->only('place_id', 'name', 'code', 'quantity', 'serial_number', 'description', 'status');

        if ($request->hasFile('image')) {
            // Delete old image
            if ($item->image_path) {
                Storage::disk('public')->delete($item->image_path);
            }
            $data['image_path'] = $request->file('image')->store('items', 'public');
        }

        $item->update($data);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'ITEM_UPDATED',
            'model_type' => 'Item',
            'model_id' => $item->id,
            'previous_value' => $old,
            'new_value' => $item->toArray(),
            'description' => "Updated item: {$item->name}",
        ]);

        return response()->json($item->load('place.cupboard'));
    }

    public function destroy(Request $request, $id)
    {
        $item = Item::findOrFail($id);

        if ($item->image_path) {
            Storage::disk('public')->delete($item->image_path);
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'ITEM_DELETED',
            'model_type' => 'Item',
            'model_id' => $item->id,
            'previous_value' => $item->toArray(),
            'description' => "Deleted item: {$item->name} (Code: {$item->code})",
        ]);

        $item->delete();

        return response()->json(['message' => 'Item deleted successfully']);
    }

    /**
     * Update only the quantity of an item.
     */
    public function updateQuantity(Request $request, $id)
    {
        $item = Item::findOrFail($id);
        $old = $item->quantity;

        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $item->update(['quantity' => $request->quantity]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'QUANTITY_UPDATED',
            'model_type' => 'Item',
            'model_id' => $item->id,
            'previous_value' => ['quantity' => $old],
            'new_value' => ['quantity' => $request->quantity],
            'description' => "Updated quantity of {$item->name} from {$old} to {$request->quantity}",
        ]);

        return response()->json($item);
    }
}
