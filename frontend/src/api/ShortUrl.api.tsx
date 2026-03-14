import axiosInstance from "../utils/axiosInstance";

/**
 * Interface for the response when a user is logged in
 */
export interface AuthenticatedUrlResponse {
    shortUrl: string;
    qrCode: string;
}

/**
 * The API returns a string (guest) OR an object (authenticated)
 */
export type CreateUrlResponse = string | AuthenticatedUrlResponse;

/**
 * Sends a request to create a shortened URL
 * @param url - The long destination URL
 * @param slug - Optional custom alias
 */
export const createShortUrl = async (
    url: string, 
    slug?: string | null
): Promise<CreateUrlResponse> => {
    // We explicitly type the axios response data
    const { data } = await axiosInstance.post<CreateUrlResponse>("/api/create", { 
        url, 
        slug 
    });
    
    return data;
};