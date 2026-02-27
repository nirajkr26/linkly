import { nanoid } from "nanoid";

/**
 * Generates a URL-friendly unique string using NanoID.
 * @param length - The length of the ID to generate (defaults to 7 for short URLs)
 * @returns A randomly generated string
 */
const generateNanoId = (length: number = 7): string => {
    return nanoid(length);
}

export default generateNanoId;