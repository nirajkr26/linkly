import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root.route";
import AuthPage from "../pages/AuthPage";

/**
 * Define the shape of our search parameters for the Auth page.
 * This ensures 'mode' can only be 'login' or 'signup'.
 */
interface AuthSearch {
  mode: 'login' | 'signup';
}

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage,
  /**
   * validateSearch ensures that the URL query parameters are typed.
   * Example: /auth?mode=signup
   */
  validateSearch: (search: Record<string, unknown>): AuthSearch => {
    return {
      // Logic to default to 'login' if mode is missing or invalid
      mode: (search.mode === 'signup' ? 'signup' : 'login') as 'login' | 'signup',
    };
  },
});