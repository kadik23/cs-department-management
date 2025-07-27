<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository
{
    protected $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Get all records
     */
    public function all(): Collection
    {
        return $this->model->all();
    }

    /**
     * Get all records with relationships
     */
    public function allWith(array $relations): Collection
    {
        return $this->model->with($relations)->get();
    }

    /**
     * Find record by ID
     */
    public function find(int $id)
    {
        return $this->model->find($id);
    }

    /**
     * Find record by ID with relationships
     */
    public function findWith(int $id, array $relations)
    {
        return $this->model->with($relations)->find($id);
    }

    /**
     * Find record by ID or fail
     */
    public function findOrFail(int $id)
    {
        return $this->model->findOrFail($id);
    }

    /**
     * Create new record
     */
    public function create(array $data)
    {
        return $this->model->create($data);
    }

    /**
     * Update record
     */
    public function update(int $id, array $data)
    {
        $record = $this->findOrFail($id);
        $record->update($data);
        return $record;
    }

    /**
     * Delete record
     */
    public function delete(int $id): bool
    {
        $record = $this->findOrFail($id);
        return $record->delete();
    }

    /**
     * Search records
     */
    public function search(string $search, array $columns = []): Collection
    {
        $query = $this->model->query();
        
        if (!empty($columns)) {
            $query->where(function($q) use ($search, $columns) {
                foreach ($columns as $column) {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            });
        }
        
        return $query->get();
    }

    /**
     * Search records with relationships
     */
    public function searchWith(string $search, array $relations, array $columns = []): Collection
    {
        $query = $this->model->with($relations);
        
        if (!empty($columns)) {
            $query->where(function($q) use ($search, $columns) {
                foreach ($columns as $column) {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            });
        }
        
        return $query->get();
    }

    /**
     * Get paginated results
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    /**
     * Get paginated results with search
     */
    public function paginateWithSearch(string $search, array $columns, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query();
        
        if (!empty($columns)) {
            $query->where(function($q) use ($search, $columns) {
                foreach ($columns as $column) {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            });
        }
        
        return $query->paginate($perPage);
    }
} 