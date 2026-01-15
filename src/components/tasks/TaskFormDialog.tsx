import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks';
import { useStudents } from '@/hooks/useStudents';
import { useLeads } from '@/hooks/useLeads';
import { useUsers } from '@/hooks/useUsers';
import { Task, TaskPriority, TaskStatus, RelatedEntityType } from '@/types/task.types';

// Helper to check if string is a valid date
const isValidDate = (dateString?: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

const taskFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.nativeEnum(TaskPriority),
    status: z.nativeEnum(TaskStatus),
    dueDate: z.date({ required_error: "Due date is required" }),
    assignedTo: z.string().min(1, "Assignee is required"),
    relatedEntityType: z.nativeEnum(RelatedEntityType),
    relatedEntityId: z.string().min(1, "Related entity is required"),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task?: Task | null;
}

export function TaskFormDialog({
    open,
    onOpenChange,
    task
}: TaskFormDialogProps) {
    const isEditing = !!task;

    // Hooks
    const createTask = useCreateTask();
    const updateTask = useUpdateTask();

    // State to debounce search if needed, but for now we'll fetch list
    const [searchStudent, setSearchStudent] = useState("");
    const [searchLead, setSearchLead] = useState("");

    // Queries
    const { data: usersData } = useUsers({ limit: 100 });
    const { data: studentsData } = useStudents({ limit: 50, search: searchStudent });
    const { data: leadsData } = useLeads({ limit: 50, search: searchLead });

    const staffMembers = usersData?.data || [];
    const students = studentsData?.data || [];
    const leads = leadsData?.data || [];

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: TaskPriority.MEDIUM,
            status: TaskStatus.PENDING,
            dueDate: new Date(),
            assignedTo: '',
            relatedEntityType: RelatedEntityType.LEAD, // Default to Lead
            relatedEntityId: '',
        },
    });

    const watchedEntityType = form.watch('relatedEntityType');

    // Reset when opening/closing or changing task
    useEffect(() => {
        if (open) {
            if (task) {
                form.reset({
                    title: task.title,
                    description: task.description || '',
                    priority: task.priority,
                    status: task.status,
                    dueDate: isValidDate(task.dueDate) ? new Date(task.dueDate!) : new Date(),
                    assignedTo: task.assignedTo,
                    relatedEntityType: task.relatedEntityType as RelatedEntityType,
                    relatedEntityId: task.relatedEntityId,
                });
            } else {
                form.reset({
                    title: '',
                    description: '',
                    priority: TaskPriority.MEDIUM,
                    status: TaskStatus.PENDING,
                    dueDate: new Date(),
                    assignedTo: '',
                    relatedEntityType: RelatedEntityType.LEAD,
                    relatedEntityId: '',
                });
            }
        }
    }, [open, task, form]);

    const onSubmit = async (values: TaskFormValues) => {
        try {
            const payload = {
                title: values.title,
                description: values.description,
                priority: values.priority,
                status: values.status,
                dueDate: values.dueDate.toISOString(),
                assignedTo: values.assignedTo,
                relatedEntityType: values.relatedEntityType,
                relatedEntityId: values.relatedEntityId,
            };

            if (isEditing && task) {
                await updateTask.mutateAsync({
                    id: task.id,
                    data: payload
                });
            } else {
                await createTask.mutateAsync(payload);
            }
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        }
    };

    const isLoading = createTask.isPending || updateTask.isPending;

    // Helper to get selected entity name for display
    const getSelectedEntityName = () => {
        const id = form.getValues('relatedEntityId');
        if (!id) return null;

        if (watchedEntityType === RelatedEntityType.STUDENT) {
            const s = students.find(x => x.id === id);
            return s ? `${s.firstName} ${s.lastName}` : 'Unknown Student';
        } else {
            const l = leads.find(x => x.id === id);
            return l ? `${l.firstName} ${l.lastName}` : 'Unknown Lead';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Task' : 'New Task'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update task details and status.'
                            : 'Create a new task assigned to a team member.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Task title..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Priority */}
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                                                <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                                                <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Status */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
                                                <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                                                <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Due Date */}
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Due Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Assignee */}
                            <FormField
                                control={form.control}
                                name="assignedTo"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Assignee</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? staffMembers.find((u) => u.id === field.value)?.name || "Unknown Staff"
                                                            : "Select staff"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search staff..." />
                                                    <CommandEmpty>No staff found.</CommandEmpty>
                                                    <CommandGroup className="max-h-[300px] overflow-auto">
                                                        {staffMembers.map((user) => (
                                                            <CommandItem
                                                                value={user.name}
                                                                key={user.id}
                                                                onSelect={() => form.setValue("assignedTo", user.id)}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        user.id === field.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {user.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Task details..."
                                            className="resize-none"
                                            rows={2}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Linked Entity */}
                        <div className="grid grid-cols-3 gap-4 border-t pt-4">
                            <FormField
                                control={form.control}
                                name="relatedEntityType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                form.setValue('relatedEntityId', ''); // Reset ID when type changes
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={RelatedEntityType.LEAD}>Lead</SelectItem>
                                                <SelectItem value={RelatedEntityType.STUDENT}>Student</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="relatedEntityId"
                                render={({ field }) => (
                                    <FormItem className="col-span-2 flex flex-col">
                                        <FormLabel>
                                            {watchedEntityType === RelatedEntityType.LEAD ? 'Select Lead' : 'Select Student'}
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? getSelectedEntityName() || "Select Entity"
                                                            : "Select " + (watchedEntityType === RelatedEntityType.LEAD ? 'Lead' : 'Student')}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search..."
                                                        onValueChange={(val) => {
                                                            if (watchedEntityType === RelatedEntityType.LEAD) setSearchLead(val);
                                                            else setSearchStudent(val);
                                                        }}
                                                    />
                                                    <CommandEmpty>No results found.</CommandEmpty>
                                                    <CommandGroup className="max-h-[300px] overflow-auto">
                                                        {watchedEntityType === RelatedEntityType.LEAD ? (
                                                            leads.map((lead) => (
                                                                <CommandItem
                                                                    value={`${lead.firstName} ${lead.lastName}`}
                                                                    key={lead.id}
                                                                    onSelect={() => form.setValue("relatedEntityId", lead.id)}
                                                                >
                                                                    <Check className={cn("mr-2 h-4 w-4", lead.id === field.value ? "opacity-100" : "opacity-0")} />
                                                                    {lead.firstName} {lead.lastName}
                                                                </CommandItem>
                                                            ))
                                                        ) : (
                                                            students.map((student) => (
                                                                <CommandItem
                                                                    value={`${student.firstName} ${student.lastName}`}
                                                                    key={student.id}
                                                                    onSelect={() => form.setValue("relatedEntityId", student.id)}
                                                                >
                                                                    <Check className={cn("mr-2 h-4 w-4", student.id === field.value ? "opacity-100" : "opacity-0")} />
                                                                    {student.firstName} {student.lastName}
                                                                </CommandItem>
                                                            ))
                                                        )}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Task'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
