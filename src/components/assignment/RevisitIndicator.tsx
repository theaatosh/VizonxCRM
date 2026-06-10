import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Undo, User, Calendar } from "lucide-react";

interface RevisitIndicatorProps {
    previousCounselorName?: string;
    previousInteractionDate?: string;
}

export function RevisitIndicator({ previousCounselorName, previousInteractionDate }: RevisitIndicatorProps) {
    if (!previousCounselorName && !previousInteractionDate) return null;

    return (
        <Alert className="bg-info/5 border-info/20">
            <Undo className="h-4 w-4 text-info" />
            <AlertTitle className="text-info font-medium flex items-center gap-2">
                Returning to Previous Counselor
            </AlertTitle>
            <AlertDescription>
                <div className="space-y-1 mt-1">
                    {previousCounselorName && (
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Previous counselor: <strong>{previousCounselorName}</strong></span>
                        </div>
                    )}
                    {previousInteractionDate && (
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Last interaction: {new Date(previousInteractionDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}</span>
                        </div>
                    )}
                </div>
            </AlertDescription>
        </Alert>
    );
}
