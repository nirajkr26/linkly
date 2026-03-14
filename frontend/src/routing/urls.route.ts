import { createRoute } from "@tanstack/react-router";
import {rootRoute } from "./root.route"; // TanStack usually exports as 'Route'
import UrlsPage from "../pages/UrlsPage";
import { checkAuth } from "../utils/helper";

/**
 * Configuration for the /urls route.
 * Includes a 'beforeLoad' hook to protect the route from unauthenticated access.
 */
export const urlsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/urls',
  // Protecting the route using the auth guard we converted earlier
  beforeLoad: async ({ context }) => {
    await checkAuth({ context });
  },
  component: UrlsPage,
});