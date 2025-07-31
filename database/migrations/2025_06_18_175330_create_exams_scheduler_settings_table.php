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
        Schema::create('exams_scheduler_settings', function (Blueprint $table) {
            $table->id();
            $table->integer('exam_duration')->comment('In Minutes');
            $table->time('first_exam_start_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams_scheduler_settings');
    }
};
