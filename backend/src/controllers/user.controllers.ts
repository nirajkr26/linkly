import { type Request, type Response } from "express";
import { getAllUserUrls, updateUserUrl, deleteUserUrl } from "../dao/user.dao";
import wrapAsync from "../utils/tryCatchWrapper";
import argon2 from "argon2";
import { type IShortUrl } from "../models/shortUrl.model";

/**
 * Fetch all URLs for the logged-in user
 */
export const getAllUserUrlsController = wrapAsync(async (req: Request, res: Response) => {
    // req.user is available via global declaration merging
    const userId = req.user!._id; 
    const urls = await getAllUserUrls(userId);

    res.status(200).json({
        isSuccess: true,
        message: 'URLs fetched successfully',
        data: { urls }
    });
});

/**
 * Update a specific URL
 */
export const updateUserUrlController = wrapAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { id: urlId } = req.params;
    const { expiresAt, isExpired, isLinkPassword, password } = req.body;

    // Use Partial<IShortUrl> to allow any subset of fields
    const updateData: Partial<IShortUrl> = {};

    if (expiresAt !== undefined) updateData.expiresAt = expiresAt;
    if (isExpired !== undefined) updateData.isExpired = isExpired;

    // Handle password protection with argon2
    if (isLinkPassword !== undefined) {
        updateData.isLinkPassword = isLinkPassword;
        if (isLinkPassword === false) {
            updateData.linkPassword = undefined; // Mongoose prefers undefined or null depending on schema
        } else if (isLinkPassword === true && password) {
            updateData.linkPassword = await argon2.hash(password);
        }
    }

    const updatedUrl = await updateUserUrl(userId, urlId as string, updateData);

    if (!updatedUrl) {
        return res.status(404).json({
            isSuccess: false,
            message: 'URL not found or not authorized'
        });
    }

    res.status(200).json({
        isSuccess: true,
        message: 'URL updated successfully',
        data: updatedUrl
    });
});

/**
 * Delete a specific URL
 */
export const deleteUserUrlController = wrapAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { id: urlId } = req.params;

    const deletedUrl = await deleteUserUrl(userId, urlId as string);

    if (!deletedUrl) {
        return res.status(404).json({
            isSuccess: false,
            message: 'URL not found or not authorized'
        });
    }

    res.status(200).json({
        isSuccess: true,
        message: 'URL deleted successfully',
        data: deletedUrl
    });
});