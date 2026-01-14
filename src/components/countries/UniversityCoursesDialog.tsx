import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Plus,
    Edit,
    Trash2,
    MoreHorizontal,
    GraduationCap,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUniversityCourses, useDeleteCourse } from '@/hooks/useUniversities';
import { CourseFormDialog } from './CourseFormDialog';
import type { University, Course } from '@/types/university.types';

interface UniversityCoursesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    university: University | null;
}

export function UniversityCoursesDialog({
    open,
    onOpenChange,
    university
}: UniversityCoursesDialogProps) {
    const [courseFormOpen, setCourseFormOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const {
        data: courses,
        isLoading,
        isError
    } = useUniversityCourses(university?.id || '');

    const deleteCourse = useDeleteCourse();

    const handleAddCourse = () => {
        setSelectedCourse(null);
        setCourseFormOpen(true);
    };

    const handleEditCourse = (course: Course) => {
        setSelectedCourse(course);
        setCourseFormOpen(true);
    };

    const handleDeleteCourse = async (course: Course) => {
        if (!university) return;
        if (confirm(`Are you sure you want to delete ${course.name}?`)) {
            await deleteCourse.mutateAsync({
                universityId: university.id,
                courseId: course.id
            });
        }
    };

    if (!university) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            Courses at {university.name}
                        </DialogTitle>
                        <DialogDescription>
                            View and manage courses offered by this university.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end mb-4">
                        <Button className="gap-2" onClick={handleAddCourse}>
                            <Plus className="h-4 w-4" />
                            Add Course
                        </Button>
                    </div>

                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course Name</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Tuition Fee</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    [...Array(3)].map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : isError ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-destructive">
                                            Failed to load courses.
                                        </TableCell>
                                    </TableRow>
                                ) : !courses?.length ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No courses found. Click "Add Course" to create one.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    courses.map((course) => (
                                        <TableRow key={course.id}>
                                            <TableCell>
                                                <div className="font-medium">{course.name}</div>
                                                {course.department && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {course.department}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>{course.level || '-'}</TableCell>
                                            <TableCell>{course.duration || '-'}</TableCell>
                                            <TableCell>
                                                {course.tuitionFee
                                                    ? `${course.tuitionFee} ${course.currency}`
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={course.isActive
                                                        ? 'bg-success/10 text-success border-success/20'
                                                        : 'bg-muted text-muted-foreground'
                                                    }
                                                >
                                                    {course.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => handleDeleteCourse(course)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

            <CourseFormDialog
                open={courseFormOpen}
                onOpenChange={setCourseFormOpen}
                course={selectedCourse}
                universityId={university.id}
            />
        </>
    );
}
