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
    | 'logs'
    | 'messaging'
    | 'payments'
    | 'roles'
    | 'scholarships'
    | 'services'
    | 'students'
    | 'tasks'
    | 'templates'
    | 'universities'
    | 'users'
    | 'visa-types'
    | 'workflows'
    | 'staff'
    | 'queues'
    | 'counselors'
    | 'monitoring';

export type ScopeLevel = 'own' | 'full';

// Modules that support 'own' scope (have ownership field in backend)
export const SCOPE_SUPPORTED_MODULES: readonly string[] = [
  'leads',
  'students',
  'tasks',
  'appointments',
  'course-applications',
  'activity-logs',
  'notifications',
  'staff',
  'queues',
];

// Current user response from /auth/me
export interface CurrentUser {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    roleId: string;
    role: string;
    permissions: string[];
    scopes?: Record<string, ScopeLevel>;
}

// Permission check function type
export type HasPermissionFn = (module: PermissionModule, action: PermissionAction) => boolean;

// Get the highest scope for a given module
export type GetScopeFn = (module: PermissionModule) => ScopeLevel;

