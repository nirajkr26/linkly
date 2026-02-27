import ShortUrlModel, {type IShortUrl } from "../models/shortUrl.model";
import { ConflictError } from "../utils/errorHandler.js";
import { Types } from "mongoose";

/**
 * Saves a new short URL record to the database
 */
export const saveShortUrlToDB = async (
    url: string,
    shortUrl: string,
    userId: string | Types.ObjectId | null = null,
    qrCode: string | null = null,
    activeFrom: Date | string | null = null
): Promise<void> => {
    try {
        // Initialize with required fields
        const newShortUrl = new ShortUrlModel({
            full_url: url,
            short_url: shortUrl,
        });

        // Set optional fields if they exist
        if (userId) newShortUrl.user = userId as any; // Cast for Mongoose compat
        if (qrCode) {
            newShortUrl.qrCode = qrCode;
            newShortUrl.qrGenerated = true;
        }
        if (activeFrom) {
            newShortUrl.activeFrom = new Date(activeFrom);
        }

        await newShortUrl.save();
    } catch (error: any) {
        console.error(`----- Error inside saveShortUrlToDB DAO: ${error} -----`);
        // We throw ConflictError because a duplicate short_url (slug) is the most likely failure
        throw new ConflictError(error.message || "Could not save short URL");
    }
};

/**
 * Retrieves a URL, handles expiration logic, and increments click count
 */
export const getShorturl = async (shortUrl: string): Promise<IShortUrl | null> => {
    const link = await ShortUrlModel.findOne({ short_url: shortUrl });

    if (!link) return null;

    const now = new Date();

    // Check if link has expired
    if (link.expiresAt && now > link.expiresAt) {
        if (!link.isExpired) {
            await ShortUrlModel.findOneAndUpdate(
                { short_url: shortUrl },
                { isExpired: true }
            );
        }
        return null; 
    }

    // Check if link is active yet
    if (link.activeFrom && now < link.activeFrom) {
        return null; 
    }

    // Increment clicks and return updated doc
    return await ShortUrlModel.findOneAndUpdate(
        { short_url: shortUrl },
        { $inc: { clicks: 1 } },
        { new: true }
    );
};

/**
 * Simple helper to fetch document without click increments or logic
 */
export const getShortUrlDoc = async (shortUrl: string): Promise<IShortUrl | null> => {
    return await ShortUrlModel.findOne({ short_url: shortUrl });
};

/**
 * Atomic click increment
 */
export const incrementClicks = async (shortUrl: string): Promise<IShortUrl | null> => {
    return await ShortUrlModel.findOneAndUpdate(
        { short_url: shortUrl },
        { $inc: { clicks: 1 } },
        { new: true }
    );
};

/**
 * Fetches link by slug (custom URL)
 */
export const getCustomShorturl = async (slug: string): Promise<IShortUrl | null> => {
    return await ShortUrlModel.findOne({ short_url: slug });
};