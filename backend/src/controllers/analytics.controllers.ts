import { type Request,type Response } from "express";
import ShortUrl from "../models/shortUrl.model";
import { getAnalyticsForLink } from "../services/analytics.services"; // Note: calling DAO directly or via service
import wrapAsync from "../utils/tryCatchWrapper";

/**
 * Controller to fetch detailed analytics for a specific link.
 * Includes a security check to ensure only the owner can view stats.
 */
export const getLinkAnalyticsController = wrapAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  
  // req.user is guaranteed by authMiddleware
  const userId = req.user!._id;

  // Find the URL document
  const url = await ShortUrl.findOne({ short_url: slug });

  if (!url) {
    return res.status(404).json({ 
      isSuccess: false, 
      message: "Link not found" 
    });
  }

  /**
   * 🔐 OWNER CHECK (CRITICAL SECURITY STEP)
   * Prevents users from guessing slugs to view other people's data.
   * We use .toString() because MongoDB ObjectIDs are objects, not strings.
   */
  if (!url.user || url.user.toString() !== userId.toString()) {
    return res.status(403).json({ 
      isSuccess: false, 
      message: "You do not have permission to view analytics for this link" 
    });
  }

  // Fetch aggregated data (Total clicks, unique IPs, device types, etc.)
  const analytics = await getAnalyticsForLink(url._id);

  return res.status(200).json({
    isSuccess: true,
    data: {
      link: {
        shortUrl: url.short_url,
        originalUrl: url.full_url,
        totalClicks: url.clicks, // Matching your schema field name 'clicks'
        isPasswordProtected: url.isLinkPassword,
        expiresAt: url.expiresAt,
        activeFrom: url.activeFrom,
        createdAt: url.createdAt
      },
      analytics
    }
  });
});