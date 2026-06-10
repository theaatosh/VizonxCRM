import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import authService from '@/services/auth.service';
import type { CurrentUser, PermissionModule, PermissionAction, ScopeLevel } from '@/types/permission.types';

interface PermissionContextValue {
    user: CurrentUser | null;
    permissions: string[];
    scopes: Record<string, ScopeLevel>;
    isLoading: boolean;
    error: Error | null;
    hasPermission: (module: PermissionModule, action: PermissionAction) => boolean;
    canRead: (module: PermissionModule) => boolean;
    canCreate: (module: PermissionModule) => boolean;
    canUpdate: (module: PermissionModule) => boolean;
    canDelete: (module: PermissionModule) => boolean;
    getScope: (module: PermissionModule) => ScopeLevel;
    hasScope: (module: PermissionModule, required: ScopeLevel) => boolean;
    refetch: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

interface PermissionProviderProps {
    children: React.ReactNode;
}

export function PermissionProvider({ children }: PermissionProviderProps) {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [scopes, setScopes] = useState<Record<string, ScopeLevel>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const SCOPE_RANK: Record<ScopeLevel, number> = {
        own: 1,
        full: 2,
    };

    const fetchPermissions = useCallback(async () => {
        // Only fetch if user is authenticated
        if (!authService.isAuthenticated()) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            setPermissions(currentUser.permissions || []);
            setScopes(currentUser.scopes || {});
        } catch (err) {
            console.error('Failed to fetch user permissions:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch permissions'));
            // Set empty permissions on error
            setPermissions([]);
            setScopes({});
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    // Check if user has a specific permission
    const hasPermission = useCallback(
        (module: PermissionModule, action: PermissionAction): boolean => {
            const permissionString = `${module}:${action}`;
            return permissions.includes(permissionString);
        },
        [permissions]
    );

    // Shorthand permission checks
    const canRead = useCallback(
        (module: PermissionModule) => hasPermission(module, 'read'),
        [hasPermission]
    );

    const canCreate = useCallback(
        (module: PermissionModule) => hasPermission(module, 'create'),
        [hasPermission]
    );

    const canUpdate = useCallback(
        (module: PermissionModule) => hasPermission(module, 'update'),
        [hasPermission]
    );

    const canDelete = useCallback(
        (module: PermissionModule) => hasPermission(module, 'delete'),
        [hasPermission]
    );

    // Get the highest scope for a given module
    const getScope = useCallback(
        (module: PermissionModule): ScopeLevel => {
            return scopes[module] || scopes['__all__'] || 'own';
        },
        [scopes]
    );

    // Check if user's scope meets the required scope level
    const hasScope = useCallback(
        (module: PermissionModule, required: ScopeLevel): boolean => {
            const userScope = scopes[module] || scopes['__all__'] || 'own';
            const userRank = SCOPE_RANK[userScope] ?? 0;
            const requiredRank = SCOPE_RANK[required] ?? 0;
            return userRank >= requiredRank;
        },
        [scopes]
    );

    const value = useMemo(
        () => ({
            user,
            permissions,
            scopes,
            isLoading,
            error,
            hasPermission,
            canRead,
            canCreate,
            canUpdate,
            canDelete,
            getScope,
            hasScope,
            refetch: fetchPermissions,
        }),
        [user, permissions, scopes, isLoading, error, hasPermission, canRead, canCreate, canUpdate, canDelete, getScope, hasScope, fetchPermissions]
    );

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
}

export function usePermissions(): PermissionContextValue {
    const context = useContext(PermissionContext);
    if (context === undefined) {
        throw new Error('usePermissions must be used within a PermissionProvider');
    }
    return context;
}

export default PermissionContext;
