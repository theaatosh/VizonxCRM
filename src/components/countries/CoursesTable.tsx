import { useState } from 'react';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    GraduationCap,
    Clock,
    DollarSign,
} from 'lucide-react';
import { CourseFormDialog } from './CourseFormDialog';
import { useDeleteCourse } from '@/hooks/useUniversities';
import type { Course } from '@/types/university.types';

interface CoursesTableProps {
    universityId: string;
    courses: Course[];
    isLoading: boolean;
}

export function CoursesTable({ universityId, courses, isLoading }: CoursesTableProps) {
    const [courseFormOpen, setCourseFormOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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
        if (confirm(`Are you sure you want to delete "${course.name}"?`)) {
            await deleteCourse.mutateAsync({
                universityId,
                courseId: course.id
            });
        }
    };

    // Format fees
    const formatFees = (fees: number | string) => {
        const numFees = typeof fees === 'string' ? parseFloat(fees) : fees;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(numFees);
    };

    return (
        <div className="p-4 bg-background/50">
            {/* Header with Add button */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-sm">Courses</h4>
                    <Badge variant="secondary" className="text-xs">
                        {courses.length}
                    </Badge>
                </div>
                <Button size="sm" className="gap-1.5 h-8" onClick={handleAddCourse}>
                    <Plus className="h-3.5 w-3.5" />
                    Add Course
                </Button>
            </div>

            {/* Courses Table */}
            <div className="rounded-lg border border-border/60 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="font-medium">Course</TableHead>
                            <TableHead className="font-medium">Fees</TableHead>
                            <TableHead className="font-medium">Duration</TableHead>
                            <TableHead className="font-medium">Intake</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeletons
                            [...Array(3)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <div className="space-y-1.5">
                                            <Skeleton className="h-4 w-40" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                </TableRow>
                            ))
                        ) : courses.length === 0 ? (
                            // Empty state
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <GraduationCap className="h-8 w-8 opacity-50" />
                                        <p className="text-sm">No courses available</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-1 gap-1.5"
                                            onClick={handleAddCourse}
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Add First Course
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            // Course rows
                            courses.map((course) => (
                                <TableRow key={course.id} className="group">
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-sm">{course.name}</p>
                                            {course.requirements && (
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {course.requirements}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm font-medium text-primary">
                                            <DollarSign className="h-3.5 w-3.5" />
                                            {formatFees(course.fees).replace('$', '')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {course.duration ? (
                                            <div className="flex items-center gap-1 text-sm">
                                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                {course.duration}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {course.intakePeriods ? (
                                            <Badge variant="outline" className="text-xs font-normal">
                                                {course.intakePeriods}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
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

            {/* Course Form Dialog */}
            <CourseFormDialog
                open={courseFormOpen}
                onOpenChange={setCourseFormOpen}
                course={selectedCourse}
                universityId={universityId}
            />
        </div>
    );
}
