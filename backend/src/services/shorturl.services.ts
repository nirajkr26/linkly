import { getCustomShorturl, saveShortUrlToDB } from "../dao/shorturl.dao.js";
import generateNanoId from "../utils/generateId"
import generateQRCode from "../utils/generateQrCode";
import { Types } from "mongoose";

/**
 * Service for guest users (Anonymous shortening)
 */
export const createShortUrlWithoutUserService = async (url: string): Promise<string> => {
   
    const shortId = generateNanoId(7);
    if (!shortId) throw new Error('Failed to generate short URL');

    await saveShortUrlToDB(url, shortId);
    return shortId;
};

/**
 * Service for registered users (Supports custom slugs and QR codes)
 */
export const createShortUrlWithUserService = async (
    url: string,
    slug: string | null = null,
    userId: string | Types.ObjectId,
    activeFrom: Date | string | null = null
): Promise<{ shortUrl: string; qrCode: string }> => {
    // Use slug if provided, otherwise generate a random ID
    const shortUrl = slug || generateNanoId(7);
    
    // Check for slug collisions
    const exist = await getCustomShorturl(shortUrl);
    if (exist) throw new Error('Custom slug already exists');

    // Construct full URL for QR code generation
    const backendBase = process.env.BACKEND_URL || "http://localhost:3000/";
    const normalizedBase = backendBase.endsWith('/') ? backendBase : `${backendBase}/`;
    const fullShortUrl = `${normalizedBase}${shortUrl}`;

    // Generate QR Code as Data URI
    const qrCode = await generateQRCode(fullShortUrl);

    await saveShortUrlToDB(url, shortUrl, userId, qrCode, activeFrom);
    
    return { shortUrl, qrCode };
};