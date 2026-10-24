<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AcademicLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminAnnouncementsController extends Controller
{
    public function index(Request $request)
    {
        $query = Announcement::with(['author', 'academicLevel.speciality']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('target_audience') && $request->target_audience !== 'all') {
            $query->where('target_audience', $request->target_audience);
        }

        $announcements = $query->pinnedFirst()->paginate(15)->withQueryString();
        $academicLevels = AcademicLevel::with('speciality')->get();

        return Inertia::render('admin/Announcements', [
            'announcements' => $announcements,
            'academicLevels' => $academicLevels,
            'filters' => $request->only(['search', 'category', 'priority', 'target_audience']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'priority' => 'required|in:urgent,high,normal',
            'category' => 'required|in:general,academic,exam,event,schedule',
            'target_audience' => 'required|in:all,teachers,students',
            'academic_level_id' => 'nullable|exists:academic_levels,id',
            'is_pinned' => 'nullable|boolean',
            'expires_at' => 'nullable|date',
            'attachment' => 'nullable|file|max:25600',
        ]);

        $attachmentData = [];
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('announcements', 'public');
            $attachmentData = [
                'attachment_path' => $path,
                'attachment_name' => $file->getClientOriginalName(),
                'attachment_size' => $file->getSize(),
                'attachment_mime' => $file->getMimeType(),
            ];
        }

        Announcement::create(array_merge([
            'author_id' => Auth::id(),
            'title' => $validated['title'],
            'content' => $validated['content'],
            'priority' => $validated['priority'],
            'category' => $validated['category'],
            'target_audience' => $validated['target_audience'],
            'academic_level_id' => $validated['target_audience'] === 'students' ? ($validated['academic_level_id'] ?? null) : null,
            'is_pinned' => (bool) ($request->input('is_pinned', false)),
            'expires_at' => $validated['expires_at'] ?? null,
            'published_at' => now(),
        ], $attachmentData));

        return redirect()->back()->with('success', 'Announcement published successfully.');
    }

    public function update(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'priority' => 'required|in:urgent,high,normal',
            'category' => 'required|in:general,academic,exam,event,schedule',
            'target_audience' => 'required|in:all,teachers,students',
            'academic_level_id' => 'nullable|exists:academic_levels,id',
            'is_pinned' => 'nullable|boolean',
            'expires_at' => 'nullable|date',
            'attachment' => 'nullable|file|max:25600',
        ]);

        $updateData = [
            'title' => $validated['title'],
            'content' => $validated['content'],
            'priority' => $validated['priority'],
            'category' => $validated['category'],
            'target_audience' => $validated['target_audience'],
            'academic_level_id' => $validated['target_audience'] === 'students' ? ($validated['academic_level_id'] ?? null) : null,
            'is_pinned' => (bool) ($request->input('is_pinned', false)),
            'expires_at' => $validated['expires_at'] ?? null,
        ];

        if ($request->hasFile('attachment')) {
            if ($announcement->attachment_path && Storage::disk('public')->exists($announcement->attachment_path)) {
                Storage::disk('public')->delete($announcement->attachment_path);
            }
            $file = $request->file('attachment');
            $path = $file->store('announcements', 'public');
            $updateData['attachment_path'] = $path;
            $updateData['attachment_name'] = $file->getClientOriginalName();
            $updateData['attachment_size'] = $file->getSize();
            $updateData['attachment_mime'] = $file->getMimeType();
        }

        $announcement->update($updateData);

        return redirect()->back()->with('success', 'Announcement updated successfully.');
    }

    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);

        if ($announcement->attachment_path && Storage::disk('public')->exists($announcement->attachment_path)) {
            Storage::disk('public')->delete($announcement->attachment_path);
        }

        $announcement->delete();

        return redirect()->back()->with('success', 'Announcement deleted successfully.');
    }

    public function togglePin($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->update(['is_pinned' => !$announcement->is_pinned]);

        return redirect()->back()->with('success', $announcement->is_pinned ? 'Announcement pinned.' : 'Announcement unpinned.');
    }

    public function downloadAttachment($id)
    {
        $announcement = Announcement::findOrFail($id);

        if (!$announcement->attachment_path || !Storage::disk('public')->exists($announcement->attachment_path)) {
            abort(404, 'File not found');
        }

        return Storage::disk('public')->download($announcement->attachment_path, $announcement->attachment_name);
    }

    public function previewAttachment($id)
    {
        $announcement = Announcement::findOrFail($id);

        if (!$announcement->attachment_path || !Storage::disk('public')->exists($announcement->attachment_path)) {
            abort(404, 'File not found');
        }

        $filePath = Storage::disk('public')->path($announcement->attachment_path);
        return response()->file($filePath, [
            'Content-Type' => $announcement->attachment_mime ?? 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $announcement->attachment_name . '"',
        ]);
    }
}
