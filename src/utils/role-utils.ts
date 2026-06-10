export function getRoleDashboard(role: string | undefined): string | null {
    const roleDashboardRoutes: Record<string, string> = {
        counselor: '/counselor-dashboard',
    };
    return role ? (roleDashboardRoutes[role.toLowerCase()] ?? null) : null;
}
