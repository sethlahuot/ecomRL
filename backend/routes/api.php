<?php

use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\admin\BrandController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\OrderController as AdminOrderController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\ShippingController;
use App\Http\Controllers\admin\SizeController;
use App\Http\Controllers\admin\TempImageController;
use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\OrderController;
use App\Http\Controllers\front\ProductController as FrontProductController;
use App\Http\Controllers\front\ShippingController as FrontShippingController;
use App\Http\Controllers\admin\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/admin/login',[AuthController::class, 'authenticate']);
Route::get('get-latest-Products',[FrontProductController::class, 'latestProducts']);
Route::get('get-featured-Products',[FrontProductController::class, 'featuredProducts']);
Route::get('get-categories',[FrontProductController::class, 'getCategories']);
Route::get('get-brands',[FrontProductController::class, 'getBrands']);
Route::get('get-products',[FrontProductController::class, 'getProducts']);
Route::get('get-product/{id}',[FrontProductController::class, 'getProduct']);
Route::post('register',[AccountController::class, 'register']);
Route::post('login',[AccountController::class, 'authenticate']);
Route::get('get-shipping-front',[FrontShippingController::class, 'getShipping']);


Route::group(['middleware' => ['auth:sanctum','checkUserRole']],function(){
    Route::post('save_order',[OrderController::class, 'saveOrder']);
    Route::get('get-order-details/{id}',[AccountController::class, 'getOrderDetails']);
    Route::get('get-orders',[AccountController::class, 'getOrders']);
    Route::post('change-password',[AccountController::class, 'changePassword']);
    Route::get('user-info',[AccountController::class, 'getUserInfo']);
    Route::post('update-profile',[AccountController::class, 'updateProfile']);
});

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');latesProducts

Route::group(['middleware' => ['auth:sanctum','checkAdminRole']],function(){
    // Route::get('categories',[CategoryController::class,'index']);
    // Route::get('categories/{id}',[CategoryController::class,'show']);
    // Route::put('categories/{id}',[CategoryController::class,'update']);
    // Route::delete('categories/{id}',[CategoryController::class,'destroy']);
    // Route::post('categories',[CategoryController::class,'store']);
    
    Route::resource('categories',CategoryController::class);
    Route::resource('brands',BrandController::class);
    Route::get('sizes',[SizeController::class, 'index']);
    Route::resource('products',ProductController::class);
    Route::post('temp-images',[TempImageController::class, 'store']);
    Route::post('save-product-image',[ProductController::class, 'saveProductImage']);
    Route::post('change-product-default-image',[ProductController::class, 'updateDefaultImage']);
    Route::post('delete-product-image',[ProductController::class, 'deleteProductImage']);

    Route::get('orders',[AdminOrderController::class, 'index']);
    Route::get('orders/{id}',[AdminOrderController::class, 'detail']);
    Route::post('update-order/{id}',[AdminOrderController::class, 'updateOrder']);

    Route::get('get-shipping',[ShippingController::class, 'getShipping']);
    Route::post('save-shipping',[ShippingController::class, 'updateShipping']);
    Route::post('admin/change-password',[AuthController::class, 'changePassword']);
    Route::get('admin/user-info',[AuthController::class, 'getUserInfo']);
    
    // User management routes
    Route::get('users',[UserController::class, 'index']);
    Route::delete('users/{id}',[UserController::class, 'destroy']);
    Route::patch('users/{id}/role',[UserController::class, 'updateRole']);
    Route::put('users/{id}',[UserController::class, 'update']);
    Route::post('/users/{userId}/change-password', [AuthController::class, 'changeUserPassword']);
    Route::post('/users', [App\Http\Controllers\admin\UserController::class, 'store']);
});
