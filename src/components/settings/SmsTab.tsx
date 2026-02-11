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
import { MessageSquare, Plus, Edit, Trash2, Loader2, Eye, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import messagingService from "@/services/messaging.service";
import type { 
  SmsTemplate, 
  CreateSmsTemplateDto, 
  UpdateSmsTemplateDto,
  EventType 
} from "@/types/messaging.types";

const eventTypes: EventType[] = [
  'AppointmentReminder',
  'LeadCreated',
  'LeadAssigned',
  'LeadConverted',
  'StudentCreated',
  'AppointmentScheduled',
  'TaskAssigned',
  'TaskDueReminder',
  'VisaWorkflowStepChanged',
  'DocumentRequested',
  'DocumentUploaded',
  'PaymentReceived',
  'PaymentDue',
  'PasswordReset',
  'WelcomeEmail',
  'Custom',
];

export function SmsTab() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<SmsTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SmsTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewText, setPreviewText] = useState<string>("");
  const [characterCount, setCharacterCount] = useState<number>(0);

  const [newTemplate, setNewTemplate] = useState<CreateSmsTemplateDto>({
    name: "",
    body: "",
    variables: [],
    eventType: "Custom",
    description: "",
  });

  const [editTemplate, setEditTemplate] = useState<UpdateSmsTemplateDto>({
    name: "",
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
      const response = await messagingService.getSmsTemplates({ limit: 50 });
      setTemplates(response.data || []);
    } catch (error) {
      console.error("Error fetching SMS templates:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load SMS templates. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTemplate = async () => {
    if (!newTemplate.name || !newTemplate.body) {
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

      await messagingService.createSmsTemplate({ ...newTemplate, variables });
      toast({
        title: "Success",
        description: "SMS template created successfully.",
      });
      setIsAddDialogOpen(false);
      setNewTemplate({
        name: "",
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
        description: err.response?.data?.message || "Failed to create SMS template.",
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

      await messagingService.updateSmsTemplate(selectedTemplate.id, { ...editTemplate, variables });
      toast({
        title: "Success",
        description: "SMS template updated successfully.",
      });
      setIsEditDialogOpen(false);
      setSelectedTemplate(null);
      fetchTemplates();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to update SMS template.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;

    setIsSubmitting(true);
    try {
      await messagingService.deleteSmsTemplate(selectedTemplate.id);
      toast({
        title: "Success",
        description: "SMS template deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedTemplate(null);
      fetchTemplates();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to delete SMS template.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (template: SmsTemplate) => {
    try {
      await messagingService.activateSmsTemplate(template.id, !template.active);
      toast({
        title: "Success",
        description: `SMS template ${!template.active ? "activated" : "deactivated"} successfully.`,
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

  const handlePreview = async (template: SmsTemplate) => {
    try {
      // Generate sample data from variables
      const sampleData: Record<string, string> = {};
      template.variables.forEach((variable) => {
        sampleData[variable] = `[${variable}]`;
      });

      const preview = await messagingService.previewSmsTemplate(template.id, sampleData);
      setPreviewText(preview.body);
      setCharacterCount(preview.characterCount);
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

  const openEditDialog = (template: SmsTemplate) => {
    setSelectedTemplate(template);
    setEditTemplate({
      name: template.name,
      body: template.body,
      variables: template.variables,
      eventType: template.eventType,
      description: template.description,
    });
    setEditVariablesInput(template.variables.join(", "));
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (template: SmsTemplate) => {
    setSelectedTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>SMS Templates</CardTitle>
            <CardDescription>Manage SMS templates for automated messaging</CardDescription>
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
                <DialogTitle>Create SMS Template</DialogTitle>
                <DialogDescription>
                  Create a new SMS template for automated messaging.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name">
                    Template Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="new-name"
                    placeholder="e.g., Appointment Reminder"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-body">
                    Message Body <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="new-body"
                    placeholder="Hi {{studentName}}, your appointment is on {{appointmentDate}}. See you soon!"
                    value={newTemplate.body}
                    onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {`{{variableName}}`} for dynamic content. Keep it short for SMS.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Current length: {newTemplate.body.length} characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-variables">Variables</Label>
                  <Input
                    id="new-variables"
                    placeholder="studentName, appointmentDate"
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
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-1">No SMS templates yet</h3>
            <p className="text-muted-foreground mb-4">Create your first SMS template to get started.</p>
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
                    <MessageSquare className="h-5 w-5 text-primary" />
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
                      {template.description || template.body}
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
            <DialogTitle>Edit SMS Template</DialogTitle>
            <DialogDescription>Update the SMS template details.</DialogDescription>
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
              <Label htmlFor="edit-body">Message Body</Label>
              <Textarea
                id="edit-body"
                value={editTemplate.body}
                onChange={(e) => setEditTemplate({ ...editTemplate, body: e.target.value })}
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                Current length: {editTemplate.body?.length || 0} characters
              </p>
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
            <AlertDialogTitle>Delete SMS Template</AlertDialogTitle>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>SMS Preview</DialogTitle>
            <DialogDescription>Preview of {selectedTemplate?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-semibold">Message:</Label>
              <div className="mt-2 p-4 bg-muted rounded-md">
                <p className="text-sm whitespace-pre-wrap">{previewText}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Character Count:</span>
              <Badge variant="outline">{characterCount} characters</Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>• Standard SMS: 160 characters</p>
              <p>• Messages over 160 chars may be split into multiple SMS</p>
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
