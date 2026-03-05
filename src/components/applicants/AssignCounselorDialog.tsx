import { useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserCheck, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUsers } from '@/hooks/useUsers';
import { useAssignCounselor } from '@/hooks/useStudents';
import type { Student } from '@/types/student.types';

interface AssignCounselorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    applicant: Student | null;
}

export function AssignCounselorDialog({ open, onOpenChange, applicant }: AssignCounselorDialogProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCounselorId, setSelectedCounselorId] = useState<string | null>(null);

    const { data: usersData, isLoading: isLoadingUsers } = useUsers({
        limit: 100, // Fetch more to filter locally if needed, or adjust as per API
    });

    const assignCounselor = useAssignCounselor();

    // Filter users with role 'counselor' (case-insensitive)
    const counselors = useMemo(() => {
        if (!usersData?.data) return [];

        return usersData.data.filter(user => {
            // Use the typed object structure where role is an object with a name property
            const roleName = user.role?.name || '';
            const roleMatch = roleName.toUpperCase() === 'COUNSELOR' ||
                roleName.toLowerCase() === 'counselor';

            const searchMatch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());

            return roleMatch && searchMatch;
        });
    }, [usersData?.data, searchQuery]);

    const handleAssign = async () => {
        if (!applicant || !selectedCounselorId) return;

        try {
            await assignCounselor.mutateAsync({
                studentId: applicant.id,
                counselorId: selectedCounselorId,
            });
            onOpenChange(false);
            setSelectedCounselorId(null);
            setSearchQuery('');
        } catch (error) {
            // Error is handled in the hook's toast
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Assign Counselor</DialogTitle>
                    <DialogDescription>
                        Select a counselor to assign to {applicant?.firstName} {applicant?.lastName}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search counselors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <ScrollArea className="h-[250px] pr-4">
                        {isLoadingUsers ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : counselors.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No counselors found.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {counselors.map((counselor) => (
                                    <div
                                        key={counselor.id}
                                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${selectedCounselorId === counselor.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-transparent hover:bg-accent'
                                            }`}
                                        onClick={() => setSelectedCounselorId(counselor.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${counselor.name}`} />
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {getInitials(counselor.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{counselor.name}</span>
                                                <span className="text-xs text-muted-foreground">{counselor.email}</span>
                                            </div>
                                        </div>
                                        {selectedCounselorId === counselor.id && (
                                            <UserCheck className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={!selectedCounselorId || assignCounselor.isPending}
                    >
                        {assignCounselor.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Confirm Assignment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
