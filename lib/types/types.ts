// Global constants
export const COOKIE_NAME = "ghlsupportdocs-auth-token";
export const REFRESH_COOKIE_NAME = "ghlsupportdocs-refresh-token";
export const JWT_EXPIRES_IN = 60 * 60 * 24 * 30;

// Global types
export type User = {
    id: number;
    username: string;
    email: string;
}