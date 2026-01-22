import api from './api';

// Types based on Swagger API documentation
export interface User {
    id: string;
    name: string;
    email: string;
    roleId: string;
    roleName?: string;
    status: 'Active' | 'Inactive';
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    roleId: string;
    status?: 'Active' | 'Inactive';
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
    roleId?: string;
    status?: 'Active' | 'Inactive';
}

export interface Role {
    id: string;
    name: string;
    description?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UsersQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

export interface CreateRoleDto {
    name: string;
    description?: string;
}

export interface Permission {
    id: string;
    name: string;
    description?: string;
    module?: string;
    action?: string;
    assignedAt?: string;
}

// Response type for grouped permissions from /permissions/available
export interface GroupedPermissions {
    [module: string]: Permission[];
}

// API response wrapper for /permissions/available endpoint
export interface AvailablePermissionsResponse {
    totalPermissions: number;
    modules: number;
    permissions: GroupedPermissions;
}

// Response type for role permissions from /roles/{roleId}/permissions
export interface RolePermissionsResponse {
    roleId: string;
    roleName: string;
    permissions: Permission[];
    totalPermissions: number;
}

export interface RoleWithPermissions extends Role {
    permissions?: Permission[];
}

export interface AssignPermissionsDto {
    permissionIds: string[];
}

const userService = {
    /**
     * Get all users with pagination
     */
    async getAllUsers(params?: UsersQueryParams): Promise<PaginatedResponse<User>> {
        const response = await api.get<PaginatedResponse<User>>('/users', { params });
        return response.data;
    },

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<User> {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },

    /**
     * Create a new user
     */
    async createUser(data: CreateUserDto): Promise<User> {
        const response = await api.post<User>('/users', data);
        return response.data;
    },

    /**
     * Update an existing user
     */
    async updateUser(id: string, data: UpdateUserDto): Promise<User> {
        const response = await api.put<User>(`/users/${id}`, data);
        return response.data;
    },

    /**
     * Delete a user
     */
    async deleteUser(id: string): Promise<void> {
        await api.delete(`/users/${id}`);
    },

    /**
     * Get all roles
     */
    async getAllRoles(): Promise<Role[]> {
        const response = await api.get<Role[]>('/users/roles/list');
        return response.data;
    },

    /**
     * Create a new role
     */
    async createRole(data: CreateRoleDto): Promise<Role> {
        const response = await api.post<Role>('/users/roles', data);
        return response.data;
    },

    /**
     * Update role permissions (replaces all existing permissions)
     * Uses PUT /users/roles/{roleId}/permissions
     */
    async updateRolePermissions(roleId: string, data: AssignPermissionsDto): Promise<void> {
        await api.put(`/users/roles/${roleId}/permissions`, data);
    },

    /**
     * Assign additional permissions to a role (keeps existing ones)
     * Uses POST /users/roles/{roleId}/permissions/assign
     */
    async assignPermissions(roleId: string, data: AssignPermissionsDto): Promise<void> {
        await api.post(`/users/roles/${roleId}/permissions/assign`, data);
    },

    /**
     * Get all available permissions from the API (seeded permissions)
     * Uses GET /users/permissions/available
     * Returns permissions grouped by module
     */
    async getAllPermissions(): Promise<Permission[]> {
        try {
            const response = await api.get<AvailablePermissionsResponse>('/users/permissions/available');
            // Extract the permissions object from the response
            const grouped = response.data.permissions;
            if (!grouped || typeof grouped !== 'object') {
                return [];
            }
            const allPermissions: Permission[] = [];
            for (const moduleName of Object.keys(grouped)) {
                const perms = grouped[moduleName];
                if (Array.isArray(perms)) {
                    // Enrich each permission with the module name from the grouping key
                    const enrichedPerms = perms.map(p => ({
                        ...p,
                        module: p.module || moduleName // Use existing module or the grouping key
                    }));
                    allPermissions.push(...enrichedPerms);
                }
            }
            return allPermissions;
        } catch {
            // Return empty array if permissions endpoint fails
            return [];
        }
    },

    /**
     * Get all available permissions grouped by module
     * Uses GET /users/permissions/available
     */
    async getGroupedPermissions(): Promise<GroupedPermissions> {
        try {
            const response = await api.get<AvailablePermissionsResponse>('/users/permissions/available');
            return response.data.permissions || {};
        } catch {
            return {};
        }
    },

    /**
     * Get permissions assigned to a specific role
     * Uses GET /users/roles/{roleId}/permissions
     */
    async getRolePermissions(roleId: string): Promise<RolePermissionsResponse> {
        try {
            const response = await api.get<RolePermissionsResponse>(`/users/roles/${roleId}/permissions`);
            return response.data;
        } catch {
            // Return empty permissions if endpoint fails
            return {
                roleId,
                roleName: '',
                permissions: [],
                totalPermissions: 0
            };
        }
    },

    /**
     * Get a role with its current permissions
     */
    async getRoleWithPermissions(roleId: string): Promise<RoleWithPermissions> {
        try {
            const rolePerms = await this.getRolePermissions(roleId);
            const roles = await this.getAllRoles();
            const role = roles.find(r => r.id === roleId);
            return role
                ? { ...role, permissions: rolePerms.permissions }
                : { id: roleId, name: rolePerms.roleName || 'Unknown', permissions: rolePerms.permissions };
        } catch {
            // Return role without permissions if endpoint doesn't support it
            const roles = await this.getAllRoles();
            const role = roles.find(r => r.id === roleId);
            return role ? { ...role, permissions: [] } : { id: roleId, name: 'Unknown', permissions: [] };
        }
    },
};

export default userService;
