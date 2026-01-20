import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@/services/auth.service";

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const navigate = useNavigate();

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

    return <>{children}</>;
}
