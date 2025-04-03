<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\ShippingCharge;
use Illuminate\Http\Request;

class ShippingController extends Controller
{
    public function getShipping() {
        $shipping = ShippingCharge::first();
        return response()->json([
            'status' => 200,
            'data' => $shipping
        ],200);
    }
}
