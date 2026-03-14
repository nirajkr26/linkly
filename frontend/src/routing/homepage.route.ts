import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root.route";
import HomePage from "../pages/HomePage";
import { checkAuthSilent } from "../utils/helper"; // Assuming the renamed helper

/**
 * The landing page route.
 * Uses checkAuthSilent to hydrate user state from the backend 
 * without forcing a redirect if the user is a guest.
 */
export const homePageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
  // beforeLoad runs before the route is rendered
  beforeLoad: async ({ context }) => {
    await checkAuthSilent({ context });
  },
});