import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root.route";
import GoogleCallbackPage from "../pages/GoogleCallbackPage";

/**
 * Route for handling the redirection back from Google OAuth.
 * This route typically processes the 'code' or 'token' from the URL.
 */
export const googleCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/google/callback',
  component: GoogleCallbackPage,
});