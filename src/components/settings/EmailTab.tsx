import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Mail, Plus, Edit, Trash2, Loader2, Eye, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import messagingService from "@/services/messaging.service";
import type { 
  EmailTemplate, 
  CreateEmailTemplateDto, 
  UpdateEmailTemplateDto,
  EventType 
} from "@/types/messaging.types";

const eventTypes: EventType[] = [
  'WelcomeEmail',
  'LeadCreated',
  'LeadAssigned',
  'LeadConverted',
  'StudentCreated',
  'AppointmentScheduled',
  'AppointmentReminder',
  'TaskAssigned',
  'TaskDueReminder',
  'VisaWorkflowStepChanged',
  'DocumentRequested',
  'DocumentUploaded',
  'PaymentReceived',
  'PaymentDue',
  'PasswordReset',
  'Custom',
];

export function EmailTab() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewSubject, setPreviewSubject] = useState<string>("");

  const [newTemplate, setNewTemplate] = useState<CreateEmailTemplateDto>({
    name: "",
    subject: "",
    body: "",
    variables: [],
    eventType: "Custom",
    description: "",
  });

  const [editTemplate, setEditTemplate] = useState<UpdateEmailTemplateDto>({
    name: "",
    subject: "",
    body: "",
    variables: [],
    eventType: "Custom",
    description: "",
  });

  const [variablesInput, setVariablesInput] = useState("");
  const [editVariablesInput, setEditVariablesInput] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await messagingService.getEmailTemplates({ limit: 50 });
      setTemplates(response.data || []);
    } catch (error) {
      console.error("Error fetching email templates:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load email templates. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTemplate = async () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.body) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const variables = variablesInput
        .split(",")
        .map(v => v.trim())
        .filter(v => v.length > 0);

      await messagingService.createEmailTemplate({ ...newTemplate, variables });
      toast({
        title: "Success",
        description: "Email template created successfully.",
      });
      setIsAddDialogOpen(false);
      setNewTemplate({
        name: "",
        subject: "",
        body: "",
        variables: [],
        eventType: "Custom",
        description: "",
      });
      setVariablesInput("");
      fetchTemplates();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to create email template.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTemplate = async () => {
    if (!selectedTemplate) return;

    setIsSubmitting(true);
    try {
      const variables = editVariablesInput
        .split(",")
        .map(v => v.trim())
        .filter(v => v.length > 0);

      await messagingService.updateEmailTemplate(selectedTemplate.id, { ...editTemplate, variables });
      toast({
        title: "Success",
        description: "Email template updated successfully.",
      });
      setIsEditDialogOpen(false);
      setSelectedTemplate(null);
      fetchTemplates();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to update email template.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;

    setIsSubmitting(true);
    try {
      await messagingService.deleteEmailTemplate(selectedTemplate.id);
      toast({
        title: "Success",
        description: "Email template deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedTemplate(null);
      fetchTemplates();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to delete email template.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (template: EmailTemplate) => {
    try {
      await messagingService.activateEmailTemplate(template.id, !template.active);
      toast({
        title: "Success",
        description: `Email template ${!template.active ? "activated" : "deactivated"} successfully.`,
      });
      fetchTemplates();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to update template status.",
      });
    }
  };

  const handlePreview = async (template: EmailTemplate) => {
    try {
      // Generate sample data from variables
      const sampleData: Record<string, string> = {};
      template.variables.forEach((variable) => {
        sampleData[variable] = `[${variable}]`;
      });

      const preview = await messagingService.previewEmailTemplate(template.id, sampleData);
      setPreviewSubject(preview.subject);
      setPreviewHtml(preview.body);
      setSelectedTemplate(template);
      setIsPreviewDialogOpen(true);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to preview template.",
      });
    }
  };

  const openEditDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditTemplate({
      name: template.name,
      subject: template.subject,
      body: template.body,
      variables: template.variables,
      eventType: template.eventType,
      description: template.description,
    });
    setEditVariablesInput(template.variables.join(", "));
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>Manage email templates for automated messaging</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Email Template</DialogTitle>
                <DialogDescription>
                  Create a new email template for automated messaging.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name">
                    Template Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="new-name"
                    placeholder="e.g., Welcome Email"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-subject">
                    Subject <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="new-subject"
                    placeholder="e.g., Welcome to {{tenantName}}"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Use {"{{variableName}}"} for dynamic content</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-body">
                    Email Body (HTML) <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="new-body"
                    placeholder="<p>Dear {{studentName}},</p><p>Welcome to our platform!</p>"
                    value={newTemplate.body}
                    onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-variables">Variables</Label>
                  <Input
                    id="new-variables"
                    placeholder="studentName, tenantName, appointmentDate"
                    value={variablesInput}
                    onChange={(e) => setVariablesInput(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Comma-separated list of variables used in template</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-event-type">Event Type</Label>
                  <Select
                    value={newTemplate.eventType}
                    onValueChange={(value: EventType) => setNewTemplate({ ...newTemplate, eventType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-description">Description</Label>
                  <Textarea
                    id="new-description"
                    placeholder="Brief description of when this template is used..."
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTemplate} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Template"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-1">No email templates yet</h3>
            <p className="text-muted-foreground mb-4">Create your first email template to get started.</p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{template.name}</p>
                      <Badge
                        variant={template.active ? "default" : "secondary"}
                        className={
                          template.active
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            : ""
                        }
                      >
                        {template.active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="bg-muted text-xs">
                        {template.eventType}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {template.description || template.subject}
                    </p>
                    {template.variables.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        <Code className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Variables: {template.variables.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2 mr-2">
                    <Switch
                      checked={template.active}
                      onCheckedChange={() => handleToggleActive(template)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary"
                    onClick={() => handlePreview(template)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary"
                    onClick={() => openEditDialog(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => openDeleteDialog(template)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Email Template</DialogTitle>
            <DialogDescription>Update the email template details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Template Name</Label>
              <Input
                id="edit-name"
                value={editTemplate.name}
                onChange={(e) => setEditTemplate({ ...editTemplate, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subject">Subject</Label>
              <Input
                id="edit-subject"
                value={editTemplate.subject}
                onChange={(e) => setEditTemplate({ ...editTemplate, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-body">Email Body (HTML)</Label>
              <Textarea
                id="edit-body"
                value={editTemplate.body}
                onChange={(e) => setEditTemplate({ ...editTemplate, body: e.target.value })}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-variables">Variables</Label>
              <Input
                id="edit-variables"
                value={editVariablesInput}
                onChange={(e) => setEditVariablesInput(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-event-type">Event Type</Label>
              <Select
                value={editTemplate.eventType}
                onValueChange={(value: EventType) => setEditTemplate({ ...editTemplate, eventType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editTemplate.description}
                onChange={(e) => setEditTemplate({ ...editTemplate, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTemplate} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Email Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedTemplate?.name}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTemplate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>Preview of {selectedTemplate?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-semibold">Subject:</Label>
              <p className="mt-1 p-3 bg-muted rounded-md">{previewSubject}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Body:</Label>
              <div
                className="mt-1 p-4 bg-muted rounded-md prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
