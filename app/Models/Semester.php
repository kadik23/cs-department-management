<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    use HasFactory;

    protected $fillable = [
        'semester_name',
        'start_at',
        'end_at',
    ];

    protected $casts = [
        'start_at' => 'date:Y-m-d',
        'end_at' => 'date:Y-m-d',
    ];

    // Relationships
    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    /**
     * Get active academic / college year (e.g. "2026/2027")
     */
    public static function getActiveCollegeYear(): string
    {
        $semester = self::whereRaw('CURRENT_DATE BETWEEN start_at AND end_at')->first() ?? self::latest()->first();

        if ($semester) {
            if (preg_match('/(20\d\d)[\/\-](20\d\d)/', (string) $semester->semester_name, $matches)) {
                return "{$matches[1]}/{$matches[2]}";
            }

            if ($semester->start_at) {
                $startYear = (int) date('Y', strtotime($semester->start_at));
                $endYear = $semester->end_at ? (int) date('Y', strtotime($semester->end_at)) : $startYear + 1;
                if ($endYear <= $startYear) {
                    $endYear = $startYear + 1;
                }
                return "{$startYear}/{$endYear}";
            }
        }

        $year = (int) date('Y');
        $month = (int) date('n');
        if ($month < 8) {
            return ($year - 1) . '/' . $year;
        }
        return $year . '/' . ($year + 1);
    }
}
