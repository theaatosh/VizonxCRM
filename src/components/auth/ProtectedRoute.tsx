import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@/services/auth.service";
import { usePermissions } from "@/contexts/PermissionContext";
import type { PermissionModule } from "@/types/permission.types";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
    children: ReactNode;
    /** Optional module permission required to access this route */
    module?: PermissionModule;
}

export function ProtectedRoute({ children, module }: ProtectedRouteProps) {
    const navigate = useNavigate();
    const { canRead, isLoading } = usePermissions();

    useEffect(() => {
        // Check if user has a valid token
        if (!authService.isAuthenticated()) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    // If not authenticated, don't render children
    if (!authService.isAuthenticated()) {
        return null;
    }

    // While loading permissions, show nothing (or could show a loader)
    if (isLoading) {
        return null;
    }

    // If module is specified, check for read permission
    if (module && !canRead(module)) {
        return (
            <DashboardLayout title="Access Denied" subtitle="You don't have permission to view this page">
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <AlertCircle className="h-16 w-16 text-destructive mb-6" />
                    <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        You don't have permission to access this page. Please contact your administrator
                        if you believe this is an error.
                    </p>
                    <Button onClick={() => navigate("/")}>
                        Go to Dashboard
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return <>{children}</>;
}
