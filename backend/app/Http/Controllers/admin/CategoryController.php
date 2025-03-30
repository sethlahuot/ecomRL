<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    //method will return all categories
    public function index() {
        $categories = Category::orderBy('created_at', 'DESC')->get();
        return response()->json([
            'status' =>200,
            'data' => $categories
        ]);
    }
    //method will store a category in db
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'status' => 'required'
        ]);

        if( $validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->error()
            ], 400);
        }

        $category = new Category();
        $category->name = $request->name;
        $category->status = $request->status;
        $category->save();

        return response()->json([
            'status' => 200,
            'message' => 'Category added Successfull',
            'data' => $category
        ], 200);
    }
    //method will return a single category
    public function show($id) {
        $category = Category::find($id);
        if($category == null){
            return response()->json([
                'status' => 404,
                'message' => 'Category not found!!!',
                'data' => $category
            ], 404);
        }
        return response()->json([
            'status' => 200,
            'data' => $category
        ], 200);
    }
    //method will update a single category
    public function update($id, Request $request) {

        $category = Category::find($id);
        if($category == null){
            return response()->json([
                'status' => 404,
                'message' => 'Category not found!!!',
                'data' => $category
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required'
        ]);

        if( $validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->error()
            ], 400);
        }

        
        $category->name = $request->name;
        $category->status = $request->status;
        $category->save();

        return response()->json([
            'status' => 200,
            'message' => 'Category Updated Successfull',
            'data' => $category
        ], 200);
    }
    //method will delete a single category
    public function destroy($id) {
        $category = Category::find($id);
        if($category == null){
            return response()->json([
                'status' => 404,
                'message' => 'Category not found!!!',
                'data' => $category
            ], 404);
        }

        $category->delete();
        
        return response()->json([
            'status' => 200,
            'message' => 'Category delete Successfull',
            'data' => $category
        ], 200);
    }
}
