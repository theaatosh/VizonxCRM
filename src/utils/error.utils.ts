import { AxiosError } from 'axios';

export function getApiErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
    if (error instanceof AxiosError) {
        const data = error.response?.data as Record<string, unknown> | undefined;
        if (data?.message && typeof data.message === 'string') {
            return data.message;
        }
        if (data?.error && typeof data.error === 'object') {
            const err = data.error as Record<string, unknown>;
            if (err?.message && typeof err.message === 'string') {
                return err.message;
            }
        }
    }
    if (error instanceof Error) {
        return error.message || fallback;
    }
    return fallback;
}
