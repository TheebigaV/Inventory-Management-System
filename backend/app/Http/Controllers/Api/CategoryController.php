<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('items')->orderBy('name')->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:categories,code',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($request->only('name', 'code', 'description'));

        ActivityLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'CATEGORY_CREATED',
            'model_type' => 'Category',
            'model_id' => $category->id,
            'new_value' => $category->toArray(),
            'description' => "Created category: {$category->name}",
        ]);

        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = Category::with('items')->findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $old = $category->toArray();

        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:categories,code,' . $id,
            'description' => 'nullable|string',
        ]);

        $category->update($request->only('name', 'code', 'description'));

        ActivityLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'CATEGORY_UPDATED',
            'model_type' => 'Category',
            'model_id' => $category->id,
            'previous_value' => $old,
            'new_value' => $category->toArray(),
            'description' => "Updated category: {$category->name}",
        ]);

        return response()->json($category);
    }

    public function destroy(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        ActivityLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'CATEGORY_DELETED',
            'model_type' => 'Category',
            'model_id' => $category->id,
            'previous_value' => $category->toArray(),
            'description' => "Deleted category: {$category->name}",
        ]);

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
