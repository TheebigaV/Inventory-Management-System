<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user and return token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Logout user (revoke token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get authenticated user.
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Register a new user (Admin only).
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,staff',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'USER_CREATED',
            'model_type' => 'User',
            'model_id' => $user->id,
            'new_value' => ['name' => $user->name, 'email' => $user->email, 'role' => $user->role],
            'description' => "Created user: {$user->name}",
        ]);

        return response()->json($user, 201);
    }

    /**
     * List all users (Admin only).
     */
    public function users(Request $request)
    {
        $users = User::orderBy('created_at', 'desc')->get();
        return response()->json($users);
    }

    /**
     * Delete a user (Admin only).
     */
    public function deleteUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot delete yourself'], 403);
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'USER_DELETED',
            'model_type' => 'User',
            'model_id' => $user->id,
            'previous_value' => ['name' => $user->name, 'email' => $user->email, 'role' => $user->role],
            'description' => "Deleted user: {$user->name}",
        ]);

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
