<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::withCount('items')->orderBy('name')->get();
        return response()->json($suppliers);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ]);

        $supplier = Supplier::create($request->only('name', 'contact_person', 'email', 'phone', 'address'));

        ActivityLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'SUPPLIER_CREATED',
            'model_type' => 'Supplier',
            'model_id' => $supplier->id,
            'new_value' => $supplier->toArray(),
            'description' => "Created supplier: {$supplier->name}",
        ]);

        return response()->json($supplier, 201);
    }

    public function show($id)
    {
        $supplier = Supplier::with('items')->findOrFail($id);
        return response()->json($supplier);
    }

    public function update(Request $request, $id)
    {
        $supplier = Supplier::findOrFail($id);
        $old = $supplier->toArray();

        $request->validate([
            'name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ]);

        $supplier->update($request->only('name', 'contact_person', 'email', 'phone', 'address'));

        ActivityLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'SUPPLIER_UPDATED',
            'model_type' => 'Supplier',
            'model_id' => $supplier->id,
            'previous_value' => $old,
            'new_value' => $supplier->toArray(),
            'description' => "Updated supplier: {$supplier->name}",
        ]);

        return response()->json($supplier);
    }

    public function destroy(Request $request, $id)
    {
        $supplier = Supplier::findOrFail($id);

        ActivityLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'SUPPLIER_DELETED',
            'model_type' => 'Supplier',
            'model_id' => $supplier->id,
            'previous_value' => $supplier->toArray(),
            'description' => "Deleted supplier: {$supplier->name}",
        ]);

        $supplier->delete();

        return response()->json(['message' => 'Supplier deleted successfully']);
    }
}
