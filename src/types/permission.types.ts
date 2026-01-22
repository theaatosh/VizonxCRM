// Permission Types - Based on backend API schema

// Permission actions - includes all possible actions from API
export type PermissionAction =
    | 'create'
    | 'read'
    | 'update'
    | 'delete'
    | 'assign'
    | 'cancel'
    | 'complete'
    | 'convert'
    | 'export'
    | 'publish'
    | 'send'
    | 'download'
    | 'execute';

// Permission modules - all modules from API
export type PermissionModule =
    | 'appointments'
    | 'blogs'
    | 'countries'
    | 'dashboard'
    | 'faqs'
    | 'files'
    | 'landing-pages'
    | 'leads'
    | 'messaging'
    | 'roles'
    | 'scholarships'
    | 'services'
    | 'students'
    | 'tasks'
    | 'templates'
    | 'universities'
    | 'users'
    | 'visa-types'
    | 'workflows';

// Current user response from /auth/me
export interface CurrentUser {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    roleId: string;
    role: string;
    permissions: string[];
}

// Permission check function type
export type HasPermissionFn = (module: PermissionModule, action: PermissionAction) => boolean;

