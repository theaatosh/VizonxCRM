import axios from 'axios';

// API Base URL
const API_BASE_URL = 'http://crmapi.vizon-x.com/api/v1';

// Types
export interface LoginDto {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    tenantId?: string;
    roleId?: string;
    roleName?: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

// Auth Service
const authService = {
    /**
     * Tenant User Login
     */
    async login(credentials: LoginDto): Promise<AuthResponse> {
        const response = await axios.post<AuthResponse>(
            `${API_BASE_URL}/auth/tenant/login`,
            credentials,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    },

    /**
     * Store auth tokens in localStorage
     */
    setTokens(accessToken: string): void {
        localStorage.setItem('accessToken', accessToken);
    },

    /**
     * Store user data in localStorage
     */
    setUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
    },

    /**
     * Get stored access token
     */
    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    },

    /**
     * Get stored user data
     */
    getUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    },

    /**
     * Logout - clear all auth data
     */
    logout(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    },
};

export default authService;
