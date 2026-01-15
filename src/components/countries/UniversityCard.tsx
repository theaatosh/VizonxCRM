import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Building2,
    MoreHorizontal,
    ChevronDown,
    ChevronRight,
    GraduationCap,
    Edit,
    Trash2,
} from 'lucide-react';
import { CoursesTable } from './CoursesTable';
import { useUniversityCourses } from '@/hooks/useUniversities';
import type { University } from '@/types/university.types';

interface UniversityCardProps {
    university: University;
    onEdit: (university: University) => void;
    onDelete: (university: University) => void;
}

export function UniversityCard({ university, onEdit, onDelete }: UniversityCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const { data: courses, isLoading: coursesLoading } = useUniversityCourses(
        isExpanded ? university.id : ''
    );

    const courseCount = courses?.length || 0;

    return (
        <Card className="shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover group">
            {/* Header with gradient */}
            <CardHeader className="p-0">
                <div className="bg-gradient-to-r from-primary/8 via-accent/30 to-primary/5 p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            {/* University Icon */}
                            <div className="h-12 w-12 rounded-xl bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-sm border border-border/50">
                                <Building2 className="h-6 w-6 text-primary" />
                            </div>

                            {/* University Info */}
                            <div className="space-y-1">
                                <h3 className="font-semibold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
                                    {university.name}
                                </h3>
                                {university.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                        {university.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEdit(university)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit University
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => onDelete(university)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-y border-border/50">
                    <div className="flex items-center gap-4">
                        {/* Course Count */}
                        <div className="flex items-center gap-1.5 text-sm">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            <span className="font-medium">{courseCount}</span>
                            <span className="text-muted-foreground">courses</span>
                        </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 text-muted-foreground hover:text-foreground"
                            >
                                {isExpanded ? (
                                    <>
                                        <ChevronDown className="h-4 w-4" />
                                        Hide Courses
                                    </>
                                ) : (
                                    <>
                                        <ChevronRight className="h-4 w-4" />
                                        View Courses
                                    </>
                                )}
                            </Button>
                        </CollapsibleTrigger>
                    </Collapsible>
                </div>

                {/* Description (if exists) */}
                {university.description && (
                    <div className="px-4 py-3 border-b border-border/50">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {university.description}
                        </p>
                    </div>
                )}

                {/* Collapsible Courses Section */}
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                    <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                        <div className="border-t border-border/50">
                            <CoursesTable
                                universityId={university.id}
                                courses={courses || []}
                                isLoading={coursesLoading}
                            />
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
}

// Loading skeleton for university cards
export function UniversityCardSkeleton() {
    return (
        <Card className="shadow-card overflow-hidden">
            <CardHeader className="p-0">
                <div className="bg-gradient-to-r from-primary/5 to-accent/20 p-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-48" />
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-14" />
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="px-4 py-3 bg-muted/30 border-y border-border/50">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-28" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
