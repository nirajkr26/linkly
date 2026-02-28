import { Types } from "mongoose";
import ClickModel from "../models/click.model";

/**
 * Interface defining the structure of the analytics response
 */
export interface ILinkAnalytics {
  totalClicks: number;
  uniqueClicks: number;
  dailyClicks: { _id: string; clicks: number }[];
  deviceBreakdown: { _id: string; count: number }[];
}

/**
 * Fetches comprehensive analytics for a specific short link
 */
export const getAnalyticsForLink = async (urlId: string | Types.ObjectId): Promise<ILinkAnalytics> => {
  // Ensure we are working with a Mongoose ObjectId for the aggregation pipeline
  const mongoUrlId = typeof urlId === "string" ? new Types.ObjectId(urlId) : urlId;

  // 1️⃣ Total clicks
  const totalClicks = await ClickModel.countDocuments({ urlId: mongoUrlId });

  // 2️⃣ Unique clicks (by IP)
  const uniqueIps = await ClickModel.distinct("ip", { urlId: mongoUrlId });
  const uniqueClicks = uniqueIps.length;

  // 3️⃣ Daily clicks (Grouped by Date)
  const dailyClicks = await ClickModel.aggregate([
    { $match: { urlId: mongoUrlId } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        clicks: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // 4️⃣ Device breakdown (Mobile vs Desktop)
  const deviceBreakdown = await ClickModel.aggregate([
    { $match: { urlId: mongoUrlId } },
    {
      $group: {
        _id: "$deviceType",
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    totalClicks,
    uniqueClicks,
    dailyClicks,
    deviceBreakdown
  };
};