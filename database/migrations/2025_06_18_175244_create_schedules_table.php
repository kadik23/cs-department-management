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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_room_id')->constrained('resources')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('teachers')->onDelete('cascade');
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
            $table->tinyInteger('day_of_week')->comment('0-6 for days of week');
            $table->integer('class_index');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
