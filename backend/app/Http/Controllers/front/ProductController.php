<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function getProducts(Request $request) {
        $products = Product::orderBy('created_at','DESC')
                        ->where('status',1);
        //api category
        if (!empty($request->category)) {
            $catArray = explode(',',$request->category);
            $products = $products->whereIn('category_id',$catArray);
        }
        //api brand
        if (!empty($request->brand)) {
            $brandArray = explode(',',$request->brand);
            $products = $products->whereIn('brand_id',$brandArray);
        }
        $products = $products->get();
        return response()->json([
            'status' => 200,
            'data' => $products
        ],200);
    }
    public function latestProducts(){
        $products = Product::orderBy('created_at','DESC')
                    ->where('status',1)
                    ->limit(8)
                    ->get();
        return response()->json([
            'status' => 200,
            'data' => $products
        ],200);
    }

    public function featuredProducts(){
        $products = Product::orderBy('created_at','DESC')
                    ->where('is_Featured','yes')
                    ->limit(8)
                    ->get();
        return response()->json([
            'status' => 200,
            'data' => $products
        ],200);
    }
    public function getCategories() {
        $categories = Category::orderBy('name','ASC')
            ->where('status',1)
            ->get();
        return response()->json([
            'status' => 200,
            'data' => $categories
        ],200);
    }
    public function getBrands() {
        $brands = Brand::orderBy('name','ASC')
            ->where('status',1)
            ->get();
        return response()->json([
            'status' => 200,
            'data' => $brands
        ],200);
    }
    public function getProduct ($id) {
        $product = Product::with(['product_images', 'product_size.size'])->find($id);
        if ( $product == null ) {
            return response()->json([
                'status' => 404,
                'data' => 'Product not found'
            ],404);
        }
        return response()->json([
            'status' => 200,
            'data' => $product
        ],200);
    }
}
