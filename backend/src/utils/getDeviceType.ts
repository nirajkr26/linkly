/**
 * Simple utility to detect device type from the User-Agent header.
 * Using a string literal return type ensures strictness throughout the app.
 */
export const getDeviceType = (userAgent: string | undefined): "mobile" | "desktop" => {
  if (!userAgent) return "desktop";

  return /mobile/i.test(userAgent) ? "mobile" : "desktop";
};