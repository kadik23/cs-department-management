# Repository Pattern Implementation

This directory contains the repository pattern implementation for the CS Department Management system. The repository pattern helps eliminate repeated queries in controllers and provides a clean separation of concerns.

## Structure

### Base Repository
- `BaseRepository.php` - Abstract base class providing common CRUD operations

### Specific Repositories
- `StudentRepository.php` - Handles student-related queries
- `GroupRepository.php` - Handles group-related queries
- `SpecialityRepository.php` - Handles speciality-related queries
- `SubjectRepository.php` - Handles subject-related queries
- `LectureRepository.php` - Handles lecture-related queries
- `UserRepository.php` - Handles user-related queries

## Usage

### In Controllers

Instead of writing repeated queries like:
```php
$students = Student::with(['user', 'group', 'academicLevel'])
    ->select('students.*')
    ->join('users', 'users.id', '=', 'students.user_id')
    ->leftJoin('groups', 'group_id', '=', 'groups.id')
    ->get();
```

You can now use:
```php
class AdminStudentsController extends Controller
{
    protected $studentRepository;

    public function __construct(StudentRepository $studentRepository)
    {
        $this->studentRepository = $studentRepository;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $students = $this->studentRepository->getStudentsWithData($search);
        
        return Inertia::render('admin/Students', [
            'students' => $students,
            'search' => $search
        ]);
    }
}
```

### Available Methods

#### Base Repository Methods
- `all()` - Get all records
- `allWith(array $relations)` - Get all records with relationships
- `find(int $id)` - Find record by ID
- `findWith(int $id, array $relations)` - Find record by ID with relationships
- `findOrFail(int $id)` - Find record by ID or fail
- `create(array $data)` - Create new record
- `update(int $id, array $data)` - Update record
- `delete(int $id)` - Delete record
- `search(string $search, array $columns = [])` - Search records
- `searchWith(string $search, array $relations, array $columns = [])` - Search records with relationships
- `paginate(int $perPage = 15)` - Get paginated results
- `paginateWithSearch(string $search, array $columns, int $perPage = 15)` - Get paginated results with search

#### Student Repository Methods
- `getStudentsWithRelations(string $search = null)` - Get students with relationships
- `getStudentsWithData(string $search = null)` - Get students with formatted data
- `getStudentsByGroup(int $groupId)` - Get students by group
- `getStudentsByAcademicLevel(int $academicLevelId)` - Get students by academic level
- `getStudentProfile(int $studentId)` - Get student with full profile data
- `getStudentAttendanceStats(int $studentId)` - Get student attendance statistics

#### Group Repository Methods
- `getGroupsWithRelations(string $search = null)` - Get groups with relationships
- `getGroupsWithData(string $search = null)` - Get groups with formatted data
- `getGroupsByAcademicLevel(int $academicLevelId)` - Get groups by academic level
- `getGroupsByAcademicLevelWithData(int $academicLevelId)` - Get groups by academic level with formatted data
- `getAvailableResponsibles()` - Get available responsible users
- `getGroupWithDetails(int $groupId)` - Get group with full details
- `getGroupsCountByAcademicLevel()` - Get groups count by academic level

#### Speciality Repository Methods
- `getSpecialitiesWithData(string $search = null)` - Get specialities with formatted data
- `getSpecialitiesWithAcademicLevels()` - Get specialities with academic levels
- `getSpecialityWithDetails(int $specialityId)` - Get speciality with full details
- `getSpecialitiesCount()` - Get specialities count
- `getSpecialitiesWithStudentCount()` - Get specialities with student count

#### Subject Repository Methods
- `getSubjectsWithData(string $search = null)` - Get subjects with formatted data
- `getSubjectsWithTeachers()` - Get subjects with teachers
- `getSubjectsByTeacher(int $teacherId)` - Get subjects by teacher
- `getSubjectsWithAcademicLevels()` - Get subjects with academic levels
- `getSubjectWithDetails(int $subjectId)` - Get subject with full details
- `getSubjectsCount()` - Get subjects count
- `getSubjectsWithTeacherCount()` - Get subjects with teacher count
- `getSubjectsByAcademicLevel(int $academicLevelId)` - Get subjects by academic level

#### Lecture Repository Methods
- `getLecturesWithRelations(string $search = null)` - Get lectures with relationships
- `getLecturesWithData(string $search = null)` - Get lectures with formatted data
- `getLecturesByTeacher(int $teacherId)` - Get lectures by teacher
- `getLecturesByAcademicLevel(int $academicLevelId)` - Get lectures by academic level
- `getLecturesByDay(int $dayOfWeek)` - Get lectures by day of week
- `getAcademicLevelsWithSpecialities()` - Get academic levels with specialities
- `getGroupsWithAcademicLevels()` - Get groups with academic levels
- `getClassroomResources()` - Get classroom resources
- `getSubjectsForSelection()` - Get subjects for selection
- `getTeachersForSelection()` - Get teachers for selection
- `getSchedulerSettings()` - Get scheduler settings

#### User Repository Methods
- `getUsersByRole(string $role)` - Get users by role
- `getUsersWithRoles()` - Get users with role relationships
- `getStudents()` - Get students (users with student role)
- `getTeachers()` - Get teachers (users with teacher role)
- `getAdministrators()` - Get administrators (users with administrator role)
- `getUsersForSelection()` - Get users for selection
- `getStudentsForSelection()` - Get students for selection
- `getUserWithProfile(int $userId)` - Get user with full profile
- `searchUsers(string $search)` - Search users by name or username
- `getUsersCountByRole()` - Get users count by role

## Benefits

1. **Code Reusability** - Common queries are centralized and can be reused across controllers
2. **Maintainability** - Changes to query logic only need to be made in one place
3. **Testability** - Repositories can be easily mocked for testing
4. **Clean Controllers** - Controllers become thinner and focused on HTTP concerns
5. **Consistency** - Standardized way of handling data access across the application

## Adding New Repositories

To add a new repository:

1. Create a new repository class extending `BaseRepository`
2. Add specific methods for your model's queries
3. Register the repository in `RepositoryServiceProvider`
4. Inject the repository into your controllers

Example:
```php
class NewModelRepository extends BaseRepository
{
    public function __construct(NewModel $model)
    {
        parent::__construct($model);
    }

    public function getCustomData(string $search = null): array
    {
        // Your custom query logic here
        return $this->model->where('column', 'like', "%{$search}%")->get()->toArray();
    }
}
```

## Service Provider Registration

The repositories are automatically registered via dependency injection in `RepositoryServiceProvider`. This allows you to inject repositories directly into your controllers without manual instantiation. 