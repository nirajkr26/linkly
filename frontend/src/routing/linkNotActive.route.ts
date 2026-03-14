import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root.route";
import LinkNotActive from "../pages/LinkNotActive";

/**
 * Route for the "Link Not Yet Active" state.
 * This is triggered when a link's 'activeFrom' date is in the future.
 */
export const linkNotActiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/link-not-active',
  component: LinkNotActive,
});