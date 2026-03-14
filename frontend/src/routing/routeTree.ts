import { rootRoute } from "./root.route";
import { homePageRoute } from "./homepage.route";
import { authRoute } from "./auth.route";
import { dashboardRoute } from "./dashboard.route"; // Fixed typo: dasboard -> dashboard
import { googleCallbackRoute } from "./googleCallback.route";
import { urlsRoute } from "./urls.route";
import { protectedLinkRoute } from "./protectedLink.route";
import { linkNotActiveRoute } from "./linkNotActive.route";
import { expiredLinkRoute } from "./expiredLink.route";
import { analyticsRoute } from "./analytics.route";

/**
 * The logic here builds the actual routing hierarchy.
 * By adding children to the rootRoute, all children inherit 
 * the QueryClient and Redux Store context defined in rootRoute.
 */
export const routeTree = rootRoute.addChildren([
  homePageRoute,
  authRoute,
  dashboardRoute,
  googleCallbackRoute,
  urlsRoute,
  protectedLinkRoute,
  linkNotActiveRoute,
  expiredLinkRoute,
  analyticsRoute,
]);