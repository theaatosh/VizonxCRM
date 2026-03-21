import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ActivityLog } from "@/types/log.types";
import { formatDistanceToNow } from "date-fns";
import { 
    PlusCircle, 
    Edit, 
    Trash2, 
    RefreshCcw, 
    UserPlus, 
    CheckCircle2, 
    XCircle,
    LogIn,
    LogOut,
    Lock,
    Activity
} from "lucide-react";

interface ActivityFeedProps {
  activities?: ActivityLog[];
  isLoading?: boolean;
}

const actionIcons: Record<string, React.ReactNode> = {
  Created: <PlusCircle className="h-4 w-4 text-success" />,
  Updated: <Edit className="h-4 w-4 text-warning" />,
  Deleted: <Trash2 className="h-4 w-4 text-destructive" />,
  StatusChanged: <RefreshCcw className="h-4 w-4 text-info" />,
  Assigned: <UserPlus className="h-4 w-4 text-primary" />,
  Completed: <CheckCircle2 className="h-4 w-4 text-success" />,
  Cancelled: <XCircle className="h-4 w-4 text-muted-foreground" />,
  Login: <LogIn className="h-4 w-4 text-info" />,
  Logout: <LogOut className="h-4 w-4 text-muted-foreground" />,
  AccessDenied: <Lock className="h-4 w-4 text-destructive" />,
};

export function ActivityFeed({ activities, isLoading = false }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card className="shadow-card h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasActivities = activities && activities.length > 0;

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activities
        </CardTitle>
        <p className="text-sm text-muted-foreground">System-wide logs</p>
      </CardHeader>
      <CardContent>
        {hasActivities ? (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {activities.map((activity, i) => (
                <div key={activity.id} className="relative flex gap-4">
                  {i !== activities.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-[-24px] w-px bg-muted" />
                  )}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted border border-background shadow-sm z-10">
                    {actionIcons[activity.action] || <Activity className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm">
                      <span className="font-semibold text-foreground">{activity.user?.name || 'System'}</span>
                      {' '}
                      <span className="text-muted-foreground lowercase">{activity.action}</span>
                      {' '}
                      <span className="font-medium text-foreground">{activity.entityType}</span>
                    </p>
                    {activity.changes && Object.keys(activity.changes).length > 0 && (
                        <p className="text-xs text-muted-foreground italic">
                            Changed {Object.keys(activity.changes).join(', ')}
                        </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-sm">No recent activities</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
