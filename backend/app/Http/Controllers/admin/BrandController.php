<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BrandController extends Controller
{
    //method will return all categories
    public function index() {
        $brand = Brand::orderBy('created_at', 'DESC')->get();
        return response()->json([
            'status' =>200,
            'data' => $brand
        ]);
    }
    //method will store a brand in db
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required'
        ]);

        if( $validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->error()
            ], 400);
        }
        $brand = new Brand();
        $brand->name = $request->name;
        $brand->status = $request->status;
        $brand->save();

        return response()->json([
            'status' => 200,
            'message' => 'Brand added Successfull',
            'data' => $brand
        ], 200);
    }
    //method will return a single Brand
    public function show($id) {
        $brand = Brand::find($id);
        if($brand == null){
            return response()->json([
                'status' => 404,
                'message' => 'Brand not found!!!',
                'data' => $brand
            ], 404);
        }
        return response()->json([
            'status' => 200,
            'data' => $brand
        ], 200);
    }
    //method will update a single category
    public function update($id, Request $request) {

        $brand = Brand::find($id);
        if($brand == null){
            return response()->json([
                'status' => 404,
                'message' => 'Brand not found!!!',
                'data' => $brand
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

        
        $brand->name = $request->name;
        $brand->status = $request->status;
        $brand->save();

        return response()->json([
            'status' => 200,
            'message' => 'Brand Updated Successfull',
            'data' => $brand
        ], 200);
    }
    //method will delete a single category
    public function destroy($id) {
        $brand = Brand::find($id);
        if($brand == null){
            return response()->json([
                'status' => 404,
                'message' => 'Brand not found!!!',
                'data' => $brand
            ], 404);
        }

        $brand->delete();
        
        return response()->json([
            'status' => 200,
            'message' => 'Brand delete Successfull',
            'data' => $brand
        ], 200);
    }
}
