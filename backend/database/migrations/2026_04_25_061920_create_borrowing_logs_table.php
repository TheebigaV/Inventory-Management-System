<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('borrowing_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('borrower_name');
            $table->string('borrower_contact')->nullable();
            $table->integer('quantity_borrowed')->default(1);
            $table->timestamp('borrow_date');
            $table->timestamp('expected_return_date')->nullable();
            $table->timestamp('returned_at')->nullable();
            $table->string('status')->default('borrowed'); // borrowed, returned, overdue
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('borrowing_logs');
    }
};
