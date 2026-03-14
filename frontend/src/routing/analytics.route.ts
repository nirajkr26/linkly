import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root.route";
import AnalyticsPage from "../pages/AnalyticsPage";
import { checkAuth } from "../utils/helper"; // Renamed from helper for TS clarity

/**
 * Route for viewing detailed analytics of a specific shortened URL.
 * The $slug parameter identifies the unique short link.
 */
export const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics/$slug',
  component: AnalyticsPage,
  /**
   * beforeLoad ensures the user is logged in before 
   * attempting to fetch private analytics data.
   */
  beforeLoad: async ({ context }) => {
    await checkAuth({ context });
  },
});