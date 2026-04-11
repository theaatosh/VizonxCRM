import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useVisaApplication } from "@/hooks/useVisaApplications";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Plane, 
  Globe, 
  Calendar, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  User,
  Phone,
  Mail,
  Milestone,
  FileCheck,
  Loader2,
  ChevronRight,
  MoreVertical,
  Activity,
  ArrowRight,
  Plus,
  Trash2,
  Pencil
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useAdvanceVisaStep, useDeleteVisaDocument } from "@/hooks/useVisaApplications";
import { VisaDocumentDialog } from "@/components/visa/VisaDocumentDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const statusColors: Record<string, string> = {
  Approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "In Process": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  UnderReview: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  Submitted: "bg-primary/10 text-primary border-primary/20",
};

const statusIcons: Record<string, React.ReactNode> = {
  Approved: <CheckCircle className="h-3.5 w-3.5" />,
  Pending: <Clock className="h-3.5 w-3.5" />,
  "In Process": <Plane className="h-3.5 w-3.5" />,
  "UnderReview": <Clock className="h-3.5 w-3.5" />,
  Rejected: <XCircle className="h-3.5 w-3.5" />,
  Submitted: <FileText className="h-3.5 w-3.5" />,
};

interface AdvanceStepDialogProps {
  visaId: string;
  nextStepId: string;
  nextStepName: string;
}

const AdvanceStepDialog = ({ visaId, nextStepId, nextStepName }: AdvanceStepDialogProps) => {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const advanceStepMutation = useAdvanceVisaStep();

  const handleAdvance = () => {
    advanceStepMutation.mutate(
      { id: visaId, data: { expectedStepId: nextStepId, notes } },
      {
        onSuccess: () => {
          setOpen(false);
          setNotes("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 gap-1.5 rounded-xl font-bold px-4 active:scale-95 transition-all shadow-sm">
          <ChevronRight className="h-4 w-4" />
          Advance to {nextStepName}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl backdrop-blur-sm bg-background/95">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold">
            <div className="p-2 rounded-xl bg-primary/10">
              <Milestone className="h-5 w-5 text-primary" />
            </div>
            Update Status
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Confirm advancement to <span className="font-bold text-foreground underline decoration-primary/30 underline-offset-4">{nextStepName}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="space-y-2.5">
            <Label htmlFor="notes" className="text-sm font-bold text-foreground/80 ml-1">Internal Notes</Label>
            <Textarea
              id="notes"
              placeholder="e.g., 'All certificates verified', 'Ready for bio-metrics'..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[140px] resize-none rounded-2xl border-muted-foreground/20 focus:border-primary/50 transition-all bg-muted/5 font-medium"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-bold">
            Stay here
          </Button>
          <Button 
            onClick={handleAdvance} 
            disabled={advanceStepMutation.isPending}
            className="rounded-xl px-6 font-bold shadow-md shadow-primary/10 gap-2"
          >
            {advanceStepMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            Confirm Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const VisaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  
  const { data: visa, isLoading, isError, error } = useVisaApplication(id || "");
  const deleteDocMutation = useDeleteVisaDocument();

  const handleEditDocument = (doc: any) => {
    setSelectedDocument(doc);
    setDocDialogOpen(true);
  };

  const handleDeleteDocument = (docId: string) => {
    if (window.confirm("Are you sure you want to remove this document from the visa application?")) {
      deleteDocMutation.mutate(docId);
    }
  };


  if (isLoading) {
    return (
      <DashboardLayout title="Visa Details" subtitle="Loading application...">
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-center px-2">
             <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-64" />
             </div>
             <Skeleton className="h-11 w-40 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
               <Skeleton className="h-64 w-full rounded-3xl" />
               <Skeleton className="h-96 w-full rounded-3xl" />
            </div>
            <Skeleton className="h-full w-full rounded-3xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !visa) {
    return (
      <DashboardLayout title="Visa Details" subtitle="Error loading application">
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed rounded-[2rem] bg-muted/20 backdrop-blur-sm m-4">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6 ring-8 ring-destructive/5">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Application Unavailable</h3>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            {(error as any)?.message || "The visa application you're looking for was not found or has been moved."}
          </p>
          <Button onClick={() => navigate("/visas")} variant="outline" className="gap-2 rounded-xl px-6 font-bold">
            <ArrowLeft className="h-4 w-4" />
            Return to Visas
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Visa Detailed View" 
      subtitle={`Student ID: ${visa.studentId.substring(0, 8)}...`}
    >
      {/* Premium Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative px-1">
        <div className="flex flex-col gap-1.5 flex-1">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/visas")} 
            className="w-fit flex items-center gap-2 pl-0 hover:bg-transparent hover:text-primary -ml-1 h-auto py-1 text-muted-foreground group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to active visas</span>
          </Button>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              {visa.student?.firstName} {visa.student?.lastName}
            </h1>
            <Badge variant="outline" className={`gap-1.5 py-1.5 px-4 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm border-2 ${statusColors[visa.status] || "bg-muted text-muted-foreground"}`}>
              {statusIcons[visa.status]}
              {visa.status}
            </Badge>
          </div>
          <div className="flex items-center flex-wrap gap-4 mt-2 text-muted-foreground">
             <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-xl border border-border/50">
               <Plane className="h-4 w-4 text-primary" />
               <span className="text-sm font-bold text-foreground/80">{visa.visaType?.name}</span>
             </div>
             <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-xl border border-border/50">
               <Globe className="h-4 w-4 text-primary" />
               <span className="text-sm font-bold text-foreground/80">{visa.destinationCountry}</span>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-xl shadow-sm h-11 w-11 hover:bg-muted/50 transition-all active:scale-95">
             <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Progress Card */}
          <Card className="shadow-2xl border-none bg-gradient-to-br from-primary/10 via-background to-background rounded-[2rem] overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12">
              <Globe className="h-64 w-64" />
            </div>
            <CardContent className="p-8 relative z-10">
               <div className="flex flex-col gap-8">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary/70">Application Roadmap</p>
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                           {visa.currentStep?.name || "Initial Stage"}
                           <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
                           <span className="text-muted-foreground/60">{visa.nextStep?.name || "Completion"}</span>
                        </h3>
                     </div>
                     <div className="flex flex-col items-end gap-1">
                        <span className="text-3xl font-black text-primary">{visa.workflowProgress?.percentageComplete || 0}%</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Completion Progress</span>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border/50 p-0.5">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                          style={{ width: `${visa.workflowProgress?.percentageComplete || 0}%` }}
                        />
                    </div>
                    
                    <div className="flex justify-between items-start px-1">
                         {visa.workflow?.steps?.map((step: any, idx: number) => {
                            const isCompleted = visa.workflowProgress?.currentStepIndex !== undefined && idx <= visa.workflowProgress.currentStepIndex;
                            const isCurrent = visa.currentStepId === step.id || (!visa.currentStepId && idx === 0);
                            return (
                               <div key={step.id} className="flex flex-col items-center gap-3 max-w-[80px]">
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500
                                    ${isCompleted ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110' : 
                                      isCurrent ? 'bg-background border-2 border-primary text-primary animate-pulse' : 
                                      'bg-muted/50 border border-border/50 text-muted-foreground'}`
                                  }>
                                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                                  </div>
                                  <span className={`text-[10px] text-center font-bold leading-tight ${isCurrent ? 'text-foreground' : 'text-muted-foreground/70'}`}>
                                    {step.name}
                                  </span>
                               </div>
                            )
                         })}
                    </div>
                  </div>

                  {/* Contextual Next Step Callout */}
                  {visa.nextStep && (
                    <div className="mt-4 p-5 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:bg-primary/[0.08]">
                       <div className="flex items-center gap-4 text-center md:text-left">
                          <div className="h-12 w-12 rounded-2xl bg-background shadow-sm flex items-center justify-center border border-primary/20 shrink-0">
                             <Milestone className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-primary uppercase tracking-widest leading-none mb-1">Up Next</p>
                             <h4 className="font-black text-lg leading-tight uppercase tracking-tight">{visa.nextStep.name}</h4>
                          </div>
                       </div>
                       <AdvanceStepDialog 
                          visaId={visa.id} 
                          nextStepId={visa.nextStep.id} 
                          nextStepName={visa.nextStep.name} 
                       />
                    </div>
                  )}
               </div>
            </CardContent>
          </Card>

          {/* Activity Logs / Notes */}
          <Card className="shadow-xl border-none bg-background rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-0 pt-8 px-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center bg-indigo-500/10 text-indigo-600 rounded-xl">
                      <Activity className="h-5 w-5" />
                    </div>
                    Activity Timeline
                  </CardTitle>
                  <CardDescription className="font-medium mt-1">History of status changes and internal remarks</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {visa.notes && visa.notes.length > 0 ? (
                <div className="space-y-8 relative">
                  <div className="absolute left-[19px] top-2 bottom-8 w-0.5 bg-gradient-to-b from-primary/30 to-muted/20" />
                  
                  {visa.notes.slice().reverse().map((note: any, idx: number) => (
                    <div key={idx} className="flex gap-6 relative group">
                      <div className="relative z-10 mt-1 h-10 w-10 rounded-full bg-background border-4 border-muted flex items-center justify-center flex-shrink-0 transition-colors group-hover:border-primary/20">
                        <div className={`h-3 w-3 rounded-full ${idx === 0 ? 'bg-primary animate-ping absolute' : ''}`} />
                        <div className={`h-3 w-3 rounded-full relative ${idx === 0 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                      </div>
                      <div className="flex-1 bg-muted/20 rounded-2xl p-6 border border-border/50 transition-all hover:bg-muted/30 hover:-translate-y-0.5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                          <Badge variant="secondary" className="font-black uppercase tracking-widest text-[10px] py-1 px-3">
                            {note.status}
                          </Badge>
                          <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-tighter">
                            <Clock className="h-3 w-3" />
                            {format(new Date(note.timestamp), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground/80 leading-relaxed italic border-l-4 border-primary/20 pl-4 py-1">
                          "{note.remarks}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/10 rounded-3xl border-4 border-dashed border-muted/50">
                  <Clock className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-muted-foreground/60 tracking-tight text-center uppercase">No activity logged yet</h3>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Applicant Info Sidebar Card */}
          <Card className="shadow-xl border-none bg-background rounded-[2rem] overflow-hidden group">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-emerald-500/10 text-emerald-600 rounded-xl">
                  <User className="h-5 w-5" />
                </div>
                Applicant
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              {visa.student ? (
                <>
                  <div className="flex flex-col items-center gap-4 text-center p-6 bg-muted/20 rounded-3xl group-hover:bg-muted/30 transition-colors">
                    <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-primary to-primary-foreground p-1 shadow-xl">
                      <div className="h-full w-full rounded-[1.8rem] bg-background flex items-center justify-center">
                         <span className="text-4xl font-black text-primary uppercase">
                           {visa.student.firstName[0]}{visa.student.lastName[0]}
                         </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black tracking-tight">{visa.student.firstName} {visa.student.lastName}</h4>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Prospective Student</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <a href={`mailto:${visa.student.email}`} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group/item">
                      <div className="p-2.5 rounded-xl bg-background shadow-sm group-hover/item:text-primary transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold truncate max-w-full">{visa.student.email}</span>
                    </a>
                    <a href={`tel:${visa.student.phone}`} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group/item">
                      <div className="p-2.5 rounded-xl bg-background shadow-sm group-hover/item:text-primary transition-colors">
                        <Phone className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold truncate">{visa.student.phone || 'No phone set'}</span>
                    </a>
                  </div>

                  {visa.studentId && (
                    <Button 
                      variant="outline" 
                      className="w-full rounded-2xl h-12 font-bold border-2 border-primary/10 hover:border-primary hover:bg-primary/5 group"
                      onClick={() => navigate(`/applicants/${visa.studentId}`)}
                    >
                      Browse Full Profile
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  )}
                </>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">Unable to fetch applicant details.</p>
              )}
            </CardContent>
          </Card>

          {/* Documents Sidebar Card */}
          <Card className="shadow-xl border-none bg-background rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center bg-orange-500/10 text-orange-600 rounded-xl">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  Documents
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl h-10 w-10 bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all"
                  onClick={() => setDocDialogOpen(true)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              {visa.documents && visa.documents.length > 0 ? (
                <div className="space-y-4">
                  {visa.documents.map((doc: any) => (
                    <div key={doc.id} className="group relative overflow-hidden rounded-2xl bg-muted/20 border border-border/50 hover:border-primary/30 transition-all p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="p-3 bg-background rounded-xl shadow-sm text-primary transition-transform group-hover:scale-110">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black truncate uppercase tracking-tight">{doc.documentType}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                               {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                            onClick={() => handleEditDocument(doc)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                            onClick={() => handleDeleteDocument(doc.id)}
                            disabled={deleteDocMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 rounded-3xl bg-muted/10 border-2 border-dashed">
                  <FileCheck className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-xs font-bold text-muted-foreground/60 uppercase">No documents found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <VisaDocumentDialog 
        open={docDialogOpen}
        onOpenChange={(open) => {
          setDocDialogOpen(open);
          if (!open) setSelectedDocument(null);
        }}
        visaApplicationId={visa.id}
        studentId={visa.studentId}
        workflowId={visa.workflowId}
        visaDocument={selectedDocument}
      />
    </DashboardLayout>
  );
};

export default VisaDetail;
