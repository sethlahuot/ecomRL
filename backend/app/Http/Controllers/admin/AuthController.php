<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function authenticate(Request $request){
        $validator = Validator::make($request->all(),[
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->error()
            ], 400);
        }
        if(Auth::attempt(['email' => $request->email,'password' => $request->password])){

            $user = User::find(Auth::user()->id);

            if($user->role == 'admin') {

                $token = $user->createToken('token')->plainTextToken;

                return response()->json([
                    'status' => 200,
                    'token' => $token,
                    'id' => $user->id,
                    'name' => $user->name
                ], 200);

            }else{
            return response()->json([
                'status' => 401,
                'message' => 'You are not the Admin!!!'
            ], 401);
        }
        }else{
            return response()->json([
                'status' => 401,
                'message' => 'Either email/password is incorrect!!!'
            ], 401);
        }
    }

    public function changePassword(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                'current_password' => 'required',
                'new_password' => 'required|min:6',
                'confirm_password' => 'required|same:new_password'
            ]);

            if($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'errors' => $validator->errors()
                ], 400);
            }

            $user = $request->user();
            
            if(!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Current password is incorrect'
                ], 400);
            }

            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'status' => 200,
                'message' => 'Password changed successfully'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Admin password change error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while changing password'
            ], 500);
        }
    }

    public function getUserInfo(Request $request) {
        $user = $request->user();
        
        return response()->json([
            'status' => 200,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email
            ]
        ], 200);
    }

    public function changeUserPassword(Request $request, $userId) {
        try {
            $validator = Validator::make($request->all(), [
                'new_password' => 'required|min:6',
                'confirm_password' => 'required|same:new_password'
            ]);

            if($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'errors' => $validator->errors()
                ], 400);
            }

            $user = User::find($userId);
            
            if (!$user) {
                return response()->json([
                    'status' => 404,
                    'message' => 'User not found'
                ], 404);
            }

            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'status' => 200,
                'message' => 'User password changed successfully'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Admin change user password error: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while changing user password'
            ], 500);
        }
    }
}
