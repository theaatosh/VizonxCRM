import React from 'react';
import { usePermissions } from '@/contexts/PermissionContext';
import type { PermissionModule, PermissionAction } from '@/types/permission.types';

interface PermissionGateProps {
    children: React.ReactNode;
    module: PermissionModule;
    action: PermissionAction;
    fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions.
 * 
 * @example
 * <PermissionGate module="services" action="create">
 *   <Button>Add Service</Button>
 * </PermissionGate>
 */
export function PermissionGate({ children, module, action, fallback = null }: PermissionGateProps) {
    const { hasPermission, isLoading } = usePermissions();

    // While loading, don't render anything (or could show a skeleton)
    if (isLoading) {
        return null;
    }

    // Check if user has the required permission
    if (hasPermission(module, action)) {
        return <>{children}</>;
    }

    // Return fallback if no permission
    return <>{fallback}</>;
}

/**
 * Higher-order component version of PermissionGate
 */
export function withPermission<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    module: PermissionModule,
    action: PermissionAction
) {
    return function WithPermissionComponent(props: P) {
        return (
            <PermissionGate module={module} action={action}>
                <WrappedComponent {...props} />
            </PermissionGate>
        );
    };
}

export default PermissionGate;
