<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSize;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductController extends Controller
{

    //this method return all product
    public function index(){
        $products = Product::orderBy('created_at', 'DESC')
                    ->with(['product_images','product_size'])
                    ->get();
        return response()->json([
            'status' => 200,
            'data' => $products
        ], 200);
    }

    //this method return new pro
    public function store(Request $request){

        //Validate the request
        $validator = Validator::make($request->all(),[
            'title' => 'required',
            'price' => 'required|numeric',
            'category' => 'required|integer',
            'sku' => 'required|unique:products,sku',
            'is_featured' => 'required',
            'status' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }
        //store product
        $product = new Product();
        $product->title = $request->title;
        $product->price = $request->price;
        $product->compare_price = $request->compare_price;
        $product->category_id = $request->category;
        $product->brand_id = $request->brand;
        $product->sku = $request->sku;
        $product->qty = $request->qty;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;
        $product->barcode = $request->barcode;
        $product->save();
        //save product image
        if(!empty($request->gallery)) {
            foreach ($request->gallery as $key => $tempImageId) {
                $tempImage = TempImage::find($tempImageId);
                
                //Large thumbnail
                $extArray = explode('.',$tempImage->name);
                $ext = end($extArray);

                $imageName = $product->id.'-'.time().'.'.$ext; //name
                $manager = new ImageManager(Driver::class);
                $img = $manager->read(public_path('uploads/temp/'.$tempImage->name));
                $img->scaleDown(1200);
                $img->save(public_path('uploads/Products/large/'.$imageName));
                //Small thumbnail

                $manager = new ImageManager(Driver::class);
                $img = $manager->read(public_path('uploads/temp/'.$tempImage->name));
                $img->coverDown(400,460);
                $img->save(public_path('uploads/Products/small/'.$imageName));

                $productImage = new ProductImage();
                $productImage->image = $imageName;
                $productImage->product_id = $product->id;
                $productImage->save();

                if ($key == 0) {
                    $product->image = $imageName;
                    $product->save();
                }
            }
        }
        // [
        //     1,2
        // ]

        return response()->json([
            'status' => 200,
            'message' => 'Product has created successfully'
        ], 200);

    }

    //this method return new pro
    public function show($id) {
        $product = Product::with(['product_images','product_size'])
                            ->find($id);

        if($product == null){
            return response()->json([
                'status' => 404,
                'message' => 'Product not found'
            ], 404);
        }
        
        $prodcutSize = $product->product_size()->pluck('size_id');

        return response()->json([
            'status' => 200,
            'data' => $product,
            'prodcutSizes' => $prodcutSize
        ],200);
        
    }
    //this method return new pro
    public function update($id, Request $request) {

        $product = Product::find($id);

        if ($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Product not found'
            ], 404);
        }
        //Validate the request
        $validator = Validator::make($request->all(),[
            'title' => 'required',
            'price' => 'required|numeric',
            'category' => 'required|integer',
            'sku' => 'required|unique:products,sku,'.$id.',id',
            'is_featured' => 'required',
            'status' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }
        //update product
        $product->title = $request->title;
        $product->price = $request->price;
        $product->compare_price = $request->compare_price;
        $product->category_id = $request->category;
        $product->brand_id = $request->brand;
        $product->sku = $request->sku;
        $product->qty = $request->qty;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;
        $product->barcode = $request->barcode;
        $product->save();

        if (!empty($request->sizes)) {
            ProductSize::where('product_id',$product->id)->delete();
            foreach ($request->sizes as $sizeId) {
                $prodcutSize = new ProductSize();
                $prodcutSize->size_id = $sizeId;
                $prodcutSize->product_id = $product->id;
                $prodcutSize->save();
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Product has update successfully'
        ], 200);

    }
    //this method return new pro
    public function destroy($id){
        $product = Product::find($id);

        if($product == null){
            return response()->json([
                'status' => 404,
                'message' => 'Product not found'
            ], 404);
        }
        $product->delete();
        
        return response()->json([
            'status' => 200,
            'message' => 'Product has deleted !!!!!'
        ], 200);
    }

    public function saveProductImage(Request $request) {
        $validator = Validator::make($request->all(),[
            'image' => 'required|image|mimes:png,jpg,gif',
            'product_id' => 'required|exists:products,id'
        ]);
        
        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);
        }
      
        $image = $request->file('image');
        $imageName = $request->product_id.'-'.time().'.'.$image->extension();

        //Large thumbnail
        $manager = new ImageManager(Driver::class);
        $img = $manager->read($image->getPathName());
        $img->scaleDown(1200);
        $img->save(public_path('uploads/Products/large/'.$imageName));
        
        //Small thumbnail
        $manager = new ImageManager(Driver::class);
        $img = $manager->read($image->getPathName());
        $img->coverDown(400,460);
        $img->save(public_path('uploads/Products/small/'.$imageName));

        //insert a record in product
        $productImage = new ProductImage();
        $productImage->image = $imageName;
        $productImage->product_id = $request->product_id;
        $productImage->save();

        return response()->json([
            'status' => 200,
            'message' => 'Image has been uploaded successfully.',
            'data' => $productImage
        ],200);        
    }

    public function updateDefaultImage(Request $request) {
        $product = Product::find($request->product_id);
        $product->image = $request->image;
        $product->save();

        return response()->json([
            'status' => 200,
            'message' => 'Product default image changed successfully.'
        ],200);  
    }

    public function deleteProductImage(Request $request) {
        $validator = Validator::make($request->all(),[
            'product_id' => 'required|exists:products,id',
            'image' => 'required|string'
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);
        }

        $productImage = ProductImage::where('product_id', $request->product_id)
                                  ->where('image', $request->image)
                                  ->first();

        if($productImage) {
            // Delete physical files
            if(file_exists(public_path('uploads/Products/large/'.$request->image))) {
                unlink(public_path('uploads/Products/large/'.$request->image));
            }
            if(file_exists(public_path('uploads/Products/small/'.$request->image))) {
                unlink(public_path('uploads/Products/small/'.$request->image));
            }

            // Delete database record
            $productImage->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Image has been deleted successfully.'
            ],200);
        }

        return response()->json([
            'status' => 404,
            'message' => 'Image not found.'
        ],404);
    }
}
