import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useClasses, useEnrollStudent } from '@/hooks/useClasses';
import { Label } from '@/components/ui/label';
import { BookOpen, Loader2 } from 'lucide-react';

interface AssignClassDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    studentId: string;
}

export const AssignClassDialog: React.FC<AssignClassDialogProps> = ({
    open,
    onOpenChange,
    studentId,
}) => {
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { data: classesData, isLoading: isLoadingClasses } = useClasses({ limit: 100 });
    const enrollMutation = useEnrollStudent();

    const filteredClasses = classesData?.data.filter(cls => 
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.instructorName?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleAssign = () => {
        if (!selectedClassId) return;
        enrollMutation.mutate(
            { classId: selectedClassId, studentId },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    setSelectedClassId('');
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Assign Class
                    </DialogTitle>
                    <DialogDescription>
                        Select a class to enroll this student in.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-4">
                        <div className="relative">
                            <Label htmlFor="search-class" className="sr-only">Search Classes</Label>
                            <input
                                id="search-class"
                                className="w-full px-3 py-2 bg-muted/50 border border-muted-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Search classes or instructors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <Label>Select a Class</Label>
                        <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                            {isLoadingClasses ? (
                                <div className="flex items-center justify-center py-10">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : filteredClasses.map((cls) => (
                                <div
                                    key={cls.id}
                                    onClick={() => setSelectedClassId(cls.id)}
                                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                                        selectedClassId === cls.id 
                                        ? 'bg-primary/10 border-primary shadow-sm' 
                                        : 'bg-background hover:bg-muted/50 border-muted-foreground/10'
                                    }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm truncate">{cls.name}</h4>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <span className="font-medium text-primary/80">{cls.instructorName || 'Unknown'}</span>
                                            <span className="opacity-40">•</span>
                                            <span>{cls.schedule?.length ? `${cls.schedule.length} sessions` : 'No schedule'}</span>
                                        </p>
                                    </div>
                                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        selectedClassId === cls.id ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/20'
                                    }`}>
                                        {selectedClassId === cls.id && <div className="h-2 w-2 rounded-full bg-current" />}
                                    </div>
                                </div>
                            ))}
                            {!isLoadingClasses && classesData?.data.length === 0 && (
                                <div className="text-center py-10 text-muted-foreground">
                                    No classes available to assign.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={enrollMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={!selectedClassId || enrollMutation.isPending}
                        className="gap-2"
                    >
                        {enrollMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        Assign Class
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
