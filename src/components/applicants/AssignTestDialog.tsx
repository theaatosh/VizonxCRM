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
import { useTests, useAssignStudent } from '@/hooks/useTests';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ClipboardList, Loader2 } from 'lucide-react';

interface AssignTestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    studentId: string;
}

export const AssignTestDialog: React.FC<AssignTestDialogProps> = ({
    open,
    onOpenChange,
    studentId,
}) => {
    const [selectedTestId, setSelectedTestId] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { data: testsData, isLoading: isLoadingTests } = useTests({ limit: 100 }, { enabled: open });
    const assignMutation = useAssignStudent();

    const filteredTests = testsData?.data.filter(test => 
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.type.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleAssign = () => {
        if (!selectedTestId) return;
        assignMutation.mutate(
            { testId: selectedTestId, studentId },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    setSelectedTestId('');
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        Assign Test
                    </DialogTitle>
                    <DialogDescription>
                        Select a test to assign to this student.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-4">
                        <div className="relative">
                            <Label htmlFor="search-test" className="sr-only">Search Tests</Label>
                            <input
                                id="search-test"
                                className="w-full px-3 py-2 bg-muted/50 border border-muted-foreground/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Search test names or types..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <Label>Select a Test</Label>
                        <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                            {isLoadingTests ? (
                                <div className="flex items-center justify-center py-10">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : filteredTests.map((test) => (
                                <div
                                    key={test.id}
                                    onClick={() => setSelectedTestId(test.id)}
                                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                                        selectedTestId === test.id 
                                        ? 'bg-primary/10 border-primary shadow-sm' 
                                        : 'bg-background hover:bg-muted/50 border-muted-foreground/10'
                                    }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm truncate">{test.name}</h4>
                                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                            <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase font-bold tracking-wider">
                                                {test.type}
                                            </Badge>
                                            <span>Capacity: {test.studentCapacity || 'Unlimited'}</span>
                                        </p>
                                    </div>
                                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        selectedTestId === test.id ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/20'
                                    }`}>
                                        {selectedTestId === test.id && <div className="h-2 w-2 rounded-full bg-current" />}
                                    </div>
                                </div>
                            ))}
                            {!isLoadingTests && testsData?.data.length === 0 && (
                                <div className="text-center py-10 text-muted-foreground">
                                    No tests available to assign.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={assignMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={!selectedTestId || assignMutation.isPending}
                        className="gap-2"
                    >
                        {assignMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        Assign Test
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
