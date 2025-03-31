<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $appends = ['image_url'];

    public function getImageUrlAttribute(){
        if ($this->image == "") {
            return "";
        }
        return asset('/uploads/products/small/'.$this->image);
    }
    function product_images() {
        return $this->hasMany(ProductImage::class);
    }
    function product_size() {
        return $this->hasMany(ProductSize::class);
    }
}
