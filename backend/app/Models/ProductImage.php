<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    protected $appends = ['image_url'];

    public function getImageUrlAttribute(){
        if ($this->image == "") {
            return "";
        }
        return asset('/uploads/products/small/'.$this->image);
    }
}
