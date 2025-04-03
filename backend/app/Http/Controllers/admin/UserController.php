<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index()
    {
        try {
            $users = User::orderBy('created_at', 'DESC')->get();
            return response()->json([
                'status' => 200,
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error fetching users: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'status' => 404,
                    'message' => 'User not found'
                ], 404);
            }

            $user->delete();
            return response()->json([
                'status' => 200,
                'message' => 'User deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error deleting user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateRole($id, Request $request)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'status' => 404,
                    'message' => 'User not found'
                ], 404);
            }

            $user->role = $request->role;
            $user->save();

            return response()->json([
                'status' => 200,
                'message' => 'User role updated successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error updating user role: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update($id, Request $request)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'status' => 404,
                    'message' => 'User not found'
                ], 404);
            }

            // Validate the request
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id,
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 400);
            }

            // Update user
            $user->name = $request->name;
            $user->email = $request->email;
            $user->save();

            return response()->json([
                'status' => 200,
                'message' => 'User updated successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error updating user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'role' => 'required|in:user,admin'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'errors' => $validator->errors()
                ], 400);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'User created successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            \Log::error('User creation error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while creating user'
            ], 500);
        }
    }
} 