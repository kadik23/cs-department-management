<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public $withinTransaction = false;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->string('priority', 20)->default('normal'); // urgent, high, normal
            $table->string('category', 30)->default('general'); // general, academic, exam, event, schedule
            $table->string('target_audience', 20)->default('all'); // all, teachers, students
            $table->foreignId('academic_level_id')->nullable()->constrained('academic_levels')->nullOnDelete();
            $table->boolean('is_pinned')->default(false);
            $table->timestamp('published_at')->useCurrent();
            $table->timestamp('expires_at')->nullable();
            $table->string('attachment_path')->nullable();
            $table->string('attachment_name')->nullable();
            $table->unsignedBigInteger('attachment_size')->nullable();
            $table->string('attachment_mime', 100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
