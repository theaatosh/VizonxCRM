import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUploadStudentDocument } from '@/hooks/useStudents';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const DOCUMENT_TYPES = [
    'Passport',
    'Transcript',
    'VisaForm',
    'Photo',
    'Certificate',
    'Other'
];

const uploadSchema = z.object({
    documentType: z.string().min(1, 'Document type is required'),
});

interface DocumentUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    studentId: string;
}

export function DocumentUploadDialog({ open, onOpenChange, studentId }: DocumentUploadDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const uploadMutation = useUploadStudentDocument();

    const form = useForm({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            documentType: '',
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const onSubmit = async (values: { documentType: string }) => {
        if (!file || !studentId) return;

        try {
            await uploadMutation.mutateAsync({
                studentId,
                file,
                documentType: values.documentType,
                category: values.documentType, // Using type as category for now
            });
            onOpenChange(false);
            setFile(null);
            form.reset();
        } catch {
            // Error is handled in hook
        }
    };

    const isUploading = uploadMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={(val) => !isUploading && onOpenChange(val)}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>
                        Select a document type and upload a file for this applicant.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        <FormField
                            control={form.control}
                            name="documentType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Document Type</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                        disabled={isUploading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select document type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {DOCUMENT_TYPES.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div 
                            className={`relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center gap-4 ${
                                dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
                            } ${file ? 'bg-success/5 border-success/30' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <Input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />
                            
                            {file ? (
                                <>
                                    <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium text-sm truncate max-w-[250px]">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-xs text-destructive hover:bg-destructive/10"
                                        onClick={() => setFile(null)}
                                        disabled={isUploading}
                                    >
                                        Remove file
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Upload className="h-6 w-6" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium text-sm">Click or drag file to upload</p>
                                        <p className="text-xs text-muted-foreground mt-1 text-balance">
                                            Supported: JPG, PNG, PDF (Max 5MB)
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isUploading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={!file || !form.getValues('documentType') || isUploading}
                                className="min-w-[100px]"
                            >
                                {isUploading ? 'Uploading...' : 'Upload File'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
