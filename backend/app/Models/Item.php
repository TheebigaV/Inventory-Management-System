<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'place_id', 'name', 'code', 'quantity',
        'serial_number', 'image_path', 'description', 'status'
    ];

    public function place()
    {
        return $this->belongsTo(Place::class);
    }

    public function borrowingLogs()
    {
        return $this->hasMany(BorrowingLog::class);
    }
}
