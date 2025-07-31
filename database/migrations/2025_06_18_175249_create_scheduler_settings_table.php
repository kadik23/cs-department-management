<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public $withinTransaction = false;
    
    public function up(): void
    {
        Schema::create('scheduler_settings', function (Blueprint $table) {
            $table->id();
            $table->integer('class_duration')->comment('In Minutes');
            $table->time('first_class_start_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scheduler_settings');
    }
};
