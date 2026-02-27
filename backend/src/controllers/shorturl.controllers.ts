import {type Request,type Response } from "express";
import { getShortUrlDoc, incrementClicks } from "../dao/shorturl.dao.js";
import { 
  createShortUrlWithoutUserService, 
  createShortUrlWithUserService 
} from "../services/shorturl.services.js";
import wrapAsync from "../utils/tryCatchWrapper";
import argon2 from "argon2";
import ClickModel from "../models/click.model";
import { getDeviceType } from "../utils/getDeviceType";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000/";
const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, '');

/**
 * CREATE SHORT URL
 * Handles both Guest (Anonymous) and Registered Users
 */
export const createShortUrlController = wrapAsync(async (req: Request, res: Response) => {
    const { url, slug, activeFrom } = req.body;

    if (req.user) {
        // Registered User Logic
        const result = await createShortUrlWithUserService(url, slug, req.user._id, activeFrom);
        return res.json({
            shortUrl: `${BACKEND_URL}${result.shortUrl}`,
            qrCode: result.qrCode
        });
    } else {
        // Guest User Logic
        const shortUrl = await createShortUrlWithoutUserService(url);
        return res.send(`${BACKEND_URL}${shortUrl}`);
    }
});

/**
 * REDIRECT LOGIC
 * Handles Expiration, Activation, and Password Protection
 */
export const redirectFromShortUrlController = wrapAsync(async (req: Request, res: Response) => {
    const { id: slug } = req.params;
    const urlDoc = await getShortUrlDoc(slug);

    if (!urlDoc) {
        return res.status(410).json({ message: 'This link has expired or does not exist' });
    }

    // 1. Check Expiration
    if (urlDoc.expiresAt && new Date() > new Date(urlDoc.expiresAt)) {
        return res.redirect(`${FRONTEND_URL}/link-expired?expiredAt=${urlDoc.expiresAt.toISOString()}&shortUrl=${encodeURIComponent(urlDoc.short_url)}`);
    }

    // 2. Check Activation Date
    if (urlDoc.activeFrom && new Date() < new Date(urlDoc.activeFrom)) {
        const fullShortLink = `${BACKEND_URL}${urlDoc.short_url}`;
        return res.redirect(`${FRONTEND_URL}/link-not-active?activeFrom=${urlDoc.activeFrom.toISOString()}&shortUrl=${encodeURIComponent(fullShortLink)}`);
    }

    // 3. Check Password Protection
    if (urlDoc.isLinkPassword) {
        return res.redirect(`${FRONTEND_URL}/protected/${urlDoc.short_url}`);
    }

    // 4. Success: Track Analytics & Redirect
    await incrementClicks(slug);
    await ClickModel.create({
        urlId: urlDoc._id,
        ip: req.ip,
        deviceType: getDeviceType(req.headers["user-agent"])
    });

    return res.redirect(urlDoc.full_url);
});

/**
 * VERIFY PASSWORD
 * Unlocks protected links
 */
export const verifyShortUrlPasswordController = wrapAsync(async (req: Request, res: Response) => {
    const { shortUrl, password } = req.body;

    if (!password) {
        return res.status(400).json({ isSuccess: false, message: "Password is required" });
    }

    const urlDoc = await getShortUrlDoc(shortUrl);
    if (!urlDoc || !urlDoc.linkPassword) {
        return res.status(404).json({ isSuccess: false, message: "Link not found or not protected" });
    }

    const isValid = await argon2.verify(urlDoc.linkPassword, password);
    if (!isValid) {
        return res.status(401).json({ isSuccess: false, message: "Incorrect password" });
    }

    // Track click on successful unlock
    await incrementClicks(shortUrl);

    return res.status(200).json({
        isSuccess: true,
        full_url: urlDoc.full_url
    });
});