<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BorrowingLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id', 'user_id', 'borrower_name', 'borrower_contact',
        'quantity_borrowed', 'borrow_date', 'expected_return_date',
        'returned_at', 'status', 'notes'
    ];

    protected $casts = [
        'borrow_date' => 'datetime',
        'expected_return_date' => 'datetime',
        'returned_at' => 'datetime',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
