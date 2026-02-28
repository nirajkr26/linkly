import { Router } from 'express';
import { getLinkAnalyticsController } from "../controllers/analytics.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const AnalyticsRouter: Router = Router();

/**
 * @route   GET /api/analytics/:slug
 * @desc    Get detailed statistics for a specific short link
 * @access  Private (Owner only)
 */
AnalyticsRouter.get(
  "/:slug", 
  authMiddleware, 
  getLinkAnalyticsController
);

export default AnalyticsRouter;