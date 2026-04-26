<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cupboard extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function places()
    {
        return $this->hasMany(Place::class);
    }

    public function items()
    {
        return $this->hasManyThrough(Item::class, Place::class);
    }
}
