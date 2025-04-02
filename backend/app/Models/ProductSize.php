<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSize extends Model
{
    public function size()
    {
        return $this->belongsTo(Size::class);
    }
}
