<?php

namespace App\Repositories;

use App\Models\Resource;
use Illuminate\Database\Eloquent\Collection;

class ResourceRepository extends BaseRepository
{
    public function __construct(Resource $model)
    {
        parent::__construct($model);
    }

    /**
     * Get resources with formatted data
     */
    public function getResourcesWithData(string $search = null): array
    {
        $query = $this->model->query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('resource_type', 'like', "%{$search}%")
                  ->orWhere('resource_number', 'like', "%{$search}%");
            });
        }

        $resources = $query->get();
        
        return $resources->map(function($resource) {
            return [
                'id' => $resource->id,
                'resource_type' => $resource->resource_type,
                'resource_number' => $resource->resource_number,
            ];
        })->toArray();
    }

    /**
     * Get resources by type
     */
    public function getResourcesByType(string $type): Collection
    {
        return $this->model->where('resource_type', $type)->get();
    }

    /**
     * Get available classrooms
     */
    public function getAvailableClassrooms(): array
    {
        $classrooms = $this->model->where('resource_type', 'classroom')->get();
        
        return $classrooms->map(function($classroom) {
            return [
                'id' => $classroom->id,
                'resource_type' => $classroom->resource_type,
                'resource_number' => $classroom->resource_number
            ];
        })->toArray();
    }

    /**
     * Get resources count by type
     */
    public function getResourcesCountByType(): array
    {
        return $this->model->selectRaw('resource_type, count(*) as count')
            ->groupBy('resource_type')
            ->pluck('count', 'resource_type')
            ->toArray();
    }

    /**
     * Get resource with lectures
     */
    public function getResourceWithLectures(int $resourceId)
    {
        return $this->model->with(['lectures.subject', 'lectures.teacher.user'])
            ->find($resourceId);
    }

    /**
     * Get resources for selection
     */
    public function getResourcesForSelection(): array
    {
        $resources = $this->model->get();
        
        return $resources->map(function($resource) {
            return [
                'id' => $resource->id,
                'name' => $resource->resource_type . ' - ' . $resource->resource_number,
                'resource_type' => $resource->resource_type,
                'resource_number' => $resource->resource_number
            ];
        })->toArray();
    }
} 