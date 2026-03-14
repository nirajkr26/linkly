import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root.route";
import ExpiredLinkPage from "../pages/ExpiredLinkPage";

/**
 * Route for the "Link Expired" state.
 * Triggered by the backend/middleware when the current date 
 * is past the link's 'expiresAt' timestamp.
 */
export const expiredLinkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/link-expired',
  component: ExpiredLinkPage,
});