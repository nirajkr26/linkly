import { redirect } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { getCurrentUser, type ApiResponse, type User } from "../api/User.api";
import { login, logout } from "../store/slice/authSlice";
import { type AppStore } from "../store/store"; // Assuming you export the store type

/**
 * Interface for TanStack Router context
 */
interface RouteContext {
    queryClient: QueryClient;
    store: AppStore;
}

/**
 * Strict Auth Guard: Redirects to /auth if authentication fails
 */
export const checkAuth = async ({ context }: { context: RouteContext }): Promise<boolean> => {
    try {
        const { queryClient, store } = context;

        // Fetches or retrieves the user from the cache
        const response: ApiResponse<{ user: User }> = await queryClient.ensureQueryData({
            queryKey: ["currentUser"],
            queryFn: getCurrentUser,
        });

        if (!response || !response.data?.user) {
            throw redirect({
                to: "/auth",
                search: { mode: 'login' },
            });
        }

        // Update Redux state
        store.dispatch(login(response.data.user));

        // Final verification from Redux state
        const { isAuthenticated } = store.getState().auth;
        if (!isAuthenticated) {
            throw redirect({
                to: "/auth",
                search: { mode: 'login' },
            });
        }

        return true;
    } catch (error) {
        console.error("Auth check failed:", error);
        // Throwing the redirect is the standard TanStack Router way to guard routes
        throw redirect({
            to: "/auth",
            search: { mode: 'login' },
        });
    }
};

/**
 * Silent Auth Guard: Attempts to hydrate Redux but fails gracefully
 */
export const checkAuthSilent = async ({ context }: { context: RouteContext }): Promise<void> => {
    const { queryClient, store } = context;
    try {
        const response: ApiResponse<{ user: User }> = await queryClient.ensureQueryData({
            queryKey: ["currentUser"],
            queryFn: getCurrentUser,
        });

        if (response && response.data) {
            store.dispatch(login(response.data.user));
        }
    } catch (error) {
        store.dispatch(logout());
        queryClient.removeQueries({ queryKey: ["currentUser"] });
        localStorage.removeItem('authState');
    }
};