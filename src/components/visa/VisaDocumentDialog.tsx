import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    useUploadVisaDocument, 
    useCreateVisaDocument, 
    useUpdateVisaDocument,
    useVisaApplication 
} from '@/hooks/useVisaApplications';
import { useStudentDocuments } from '@/hooks/useStudents';
import { fileService } from '@/services/file.service';
import { Upload, FileText, CheckCircle2, Link as LinkIcon, Loader2, Pencil, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VisaDocument } from '@/types/visaApplication.types';

const DOCUMENT_TYPES = [
    'Passport',
    'Transcript',
    'VisaForm',
    'Photo',
    'Certificate',
    'Bank Statement',
    'Offer Letter',
    'Other'
];

const docSchema = z.object({
    documentType: z.string().min(1, 'Document type is required'),
    studentDocumentId: z.string().optional(),
});

interface VisaDocumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    visaApplicationId: string;
    studentId: string;
    workflowId?: string;
    visaDocument?: VisaDocument | null;
}

export function VisaDocumentDialog({ 
    open, 
    onOpenChange, 
    visaApplicationId, 
    studentId,
    workflowId,
    visaDocument
}: VisaDocumentDialogProps) {
    const isEdit = !!visaDocument;

    const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    
    const { data: visa } = useVisaApplication(visaApplicationId);
    const uploadMutation = useUploadVisaDocument();
    const linkMutation = useCreateVisaDocument();
    const updateMutation = useUpdateVisaDocument();
    const { data: studentDocuments, isLoading: isLoadingDocs } = useStudentDocuments(studentId);

    const form = useForm({
        resolver: zodResolver(docSchema),
        defaultValues: {
            documentType: '',
            studentDocumentId: '',
        },
    });

    useEffect(() => {
        if (visaDocument && open) {
            form.reset({
                documentType: visaDocument.documentType || '',
                studentDocumentId: visaDocument.studentDocumentId || '',
            });
            if (visaDocument.studentDocumentId) {
                setActiveTab('link');
            } else {
                setActiveTab('upload');
            }
        } else if (!open) {
            form.reset({
                documentType: '',
                studentDocumentId: '',
            });
            setFile(null);
            setActiveTab('upload');
        }
    }, [visaDocument, open, form]);

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

    const onSubmit = async (values: z.infer<typeof docSchema>) => {
        try {
            if (isEdit && visaDocument) {
                let updateData: any = {
                    visaApplicationId,
                    documentType: values.documentType,
                    workflowId,
                };

                if (activeTab === 'upload') {
                    if (file) {
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('category', 'Other');
                        formData.append('studentId', studentId);
                        formData.append('visaApplicationId', visaApplicationId);
                        const uploadResponse = await fileService.uploadFile(formData);
                        updateData.filePath = uploadResponse.filePath;
                    }
                    // If we are in upload tab, we should clear studentDocumentId
                    updateData.studentDocumentId = null;
                } else {
                    updateData.studentDocumentId = values.studentDocumentId;
                    // API suggests providing either studentDocumentId OR documentType/filePath
                    delete updateData.documentType;
                    delete updateData.filePath;
                }

                await updateMutation.mutateAsync({ id: visaDocument.id, data: updateData });
            } else {
                if (activeTab === 'upload') {
                    if (!file) return;
                    await uploadMutation.mutateAsync({
                        visaApplicationId,
                        studentId, // Added studentId
                        file,
                        documentType: values.documentType,
                        workflowId,
                    });
                } else {
                    if (!values.studentDocumentId) return;
                    await linkMutation.mutateAsync({
                        visaApplicationId,
                        studentDocumentId: values.studentDocumentId,
                        workflowId,
                    });
                }
            }
            handleClose();
        } catch {
            // Error handled in hook
        }
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    const isPending = uploadMutation.isPending || linkMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={(val) => !isPending && (val ? onOpenChange(val) : handleClose())}>
            <DialogContent className="sm:max-w-[500px] rounded-3xl !p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-8 bg-muted/30 pb-6">
                    <DialogTitle className="text-2xl font-black flex items-center gap-3 text-foreground">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            {isEdit ? <Pencil className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                        </div>
                        {isEdit ? 'Update Visa Document' : 'Add Visa Document'}
                    </DialogTitle>
                    <DialogDescription className="font-medium text-muted-foreground/80">
                        {isEdit ? 'Modify the existing document details or replace the file.' : 'Upload a new file or link an existing student document to this visa application.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-8 py-4">
                    <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-12 rounded-2xl bg-muted/50 p-1 mb-6">
                            <TabsTrigger value="upload" className="rounded-xl font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <Upload className="h-4 w-4" />
                                Upload New
                            </TabsTrigger>
                            <TabsTrigger value="link" className="rounded-xl font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <LinkIcon className="h-4 w-4" />
                                Link Existing
                            </TabsTrigger>
                        </TabsList>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="documentType"
                                    render={({ field }) => (
                                        <FormItem className={activeTab === 'link' ? 'opacity-50 pointer-events-none' : ''}>
                                            <FormLabel className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground/70">Document Category</FormLabel>
                                            <Select 
                                                onValueChange={field.onChange} 
                                                defaultValue={field.value}
                                                disabled={isPending || activeTab === 'link'}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-12 rounded-2xl border-muted-foreground/20 bg-muted/5 focus:ring-primary/20 transition-all">
                                                        <SelectValue placeholder="What are you adding?" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-none shadow-xl">
                                                    {DOCUMENT_TYPES.map((type) => (
                                                        <SelectItem key={type} value={type} className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors">
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <TabsContent value="upload" className="mt-0 animate-in fade-in zoom-in-95 duration-200">
                                    <div 
                                        className={`relative border-2 border-dashed rounded-[2rem] p-10 transition-all flex flex-col items-center justify-center gap-4 ${
                                            dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
                                        } ${file ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-muted/5'}`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <Input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
                                            onChange={handleFileChange}
                                            disabled={isPending}
                                        />
                                        
                                        {file ? (
                                            <>
                                                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm transition-transform scale-110">
                                                    <CheckCircle2 className="h-8 w-8" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-black text-sm truncate max-w-[250px] uppercase tracking-tight text-foreground">{file.name}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">{(file.size / (1024 * 1024)).toFixed(2)} MB &bull; File ready</p>
                                                </div>
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="relative z-30 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl px-4"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFile(null);
                                                    }}
                                                    disabled={isPending}
                                                >
                                                    Discard file
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                                    <Upload className="h-8 w-8" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-bold text-sm text-foreground">
                                                        {isEdit ? 'Drop new file to replace' : 'Drop document here'}
                                                    </p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2 opacity-60">
                                                        PDF, JPG or PNG &bull; Max 5MB
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="link" className="mt-0 animate-in fade-in zoom-in-95 duration-200">
                                    <FormField
                                        control={form.control}
                                        name="studentDocumentId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground/70">Already Uploaded Files</FormLabel>
                                                <ScrollArea className="h-[240px] rounded-[2rem] border-2 border-muted-foreground/10 bg-muted/5 p-2">
                                                    {isLoadingDocs ? (
                                                        <div className="flex h-40 items-center justify-center">
                                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                        </div>
                                                    ) : !studentDocuments || studentDocuments.length === 0 ? (
                                                        <div className="flex h-40 flex-col items-center justify-center text-center opacity-40">
                                                            <FileText className="h-10 w-10 mb-2" />
                                                            <p className="text-xs font-bold uppercase tracking-widest">No files available</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2 p-2">
                                                            {studentDocuments.map((doc: any) => (
                                                                <div 
                                                                    key={doc.id}
                                                                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2 group/item ${
                                                                        field.value === doc.id 
                                                                        ? 'bg-primary/10 border-primary shadow-md' 
                                                                        : 'bg-background hover:bg-muted/50 border-transparent'
                                                                    }`}
                                                                    onClick={() => field.onChange(doc.id)}
                                                                >
                                                                    <div className={`p-2 rounded-xl transition-colors ${field.value === doc.id ? 'bg-primary text-primary-foreground' : 'bg-muted group-hover/item:bg-muted-foreground/10'}`}>
                                                                        <FileText className="h-4 w-4" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-black uppercase tracking-tight truncate text-foreground">{doc.documentType}</p>
                                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                                                            {new Date(doc.uploadedAt).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                    {field.value === doc.id && <CheckCircle2 className="h-5 w-5 text-primary animate-in zoom-in" />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </ScrollArea>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>

                                <DialogFooter className="pt-6 border-t gap-3 sm:gap-0 mt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleClose}
                                        disabled={isPending}
                                        className="rounded-2xl font-bold h-12 hover:bg-muted"
                                    >
                                        Discard
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={isPending || (activeTab === 'upload' && !file && !isEdit) || (activeTab === 'link' && !form.watch('studentDocumentId')) || (activeTab === 'upload' && !form.watch('documentType'))}
                                        className="min-w-[150px] rounded-2xl h-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 gap-2 transition-all active:scale-95"
                                    >
                                        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {isEdit ? (isPending ? 'Updating...' : 'Save Changes') : (activeTab === 'upload' ? (isPending ? 'Uploading...' : 'Upload Now') : (isPending ? 'Linking...' : 'Link File'))}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}


