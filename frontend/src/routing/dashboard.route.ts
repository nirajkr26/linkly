import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root.route";
import DashboardPage from "../pages/DashboardPage";
import { checkAuth } from "../utils/helper"; // Renamed from helper for clarity

/**
 * Route for the user dashboard.
 * Uses the strict checkAuth guard to ensure only logged-in 
 * users can access this page.
 */
export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
  /**
   * beforeLoad is a TanStack Router hook that runs before the route is loaded.
   * If checkAuth throws a redirect (as we set it up), the component won't even mount.
   */
  beforeLoad: async ({ context }) => {
    await checkAuth({ context });
  },
});