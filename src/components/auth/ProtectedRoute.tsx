import { ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import authService from "@/services/auth.service";
import { usePermissions } from "@/contexts/PermissionContext";
import type { PermissionModule } from "@/types/permission.types";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullPageLoader } from "@/components/shared/FullPageLoader";
import { getRoleDashboard } from "@/utils/role-utils";

interface ProtectedRouteProps {
    children: ReactNode;
    /** Optional module permission required to access this route */
    module?: PermissionModule;
    /** Optional role required to access this route (case-insensitive) */
    role?: string;
}

export function ProtectedRoute({ children, module, role }: ProtectedRouteProps) {
    const navigate = useNavigate();
    const { canRead, isLoading, user } = usePermissions();

    // If not authenticated, redirect to login immediately using declarative Navigate
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // While loading permissions, show a professional loader instead of a blank screen
    if (isLoading) {
        return <FullPageLoader message="Establishing your session..." />;
    }

    // If role is specified, check user role matches (case-insensitive)
    if (role && user?.role.toLowerCase() !== role.toLowerCase()) {
        return (
            <DashboardLayout title="Access Denied" subtitle="You don't have permission to view this page">
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <AlertCircle className="h-16 w-16 text-destructive mb-6" />
                    <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        This page is only available to counselors. Please contact your administrator
                        if you believe this is an error.
                    </p>
                    <Button onClick={() => navigate("/")}>
                        Go to Dashboard
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    // If module is specified, check for read permission
    if (module && !canRead(module)) {
        const roleDashboard = getRoleDashboard(user?.role);
        if (roleDashboard) {
            return <Navigate to={roleDashboard} replace />;
        }
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
