import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root.route";
import ProtectedLinkPage from "../pages/ProtectedLinkPage";

/**
 * Route configuration for password-protected links.
 * The $shortUrl syntax indicates a dynamic segment.
 */
export const protectedLinkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/protected/$shortUrl',
  component: ProtectedLinkPage,
  // Optional: You can validate that the param exists or matches a pattern
  parseParams: (params) => ({
    shortUrl: params.shortUrl as string,
  }),
});