import { type CookieOptions } from 'express';

/**
 * Global cookie configuration for JWT and sessions.
 */
// export const cookieOptions: CookieOptions = {
//   httpOnly: true, // Prevents client-side JS from accessing the cookie (XSS protection)
//   secure: process.env.NODE_ENV === 'production', // Only sends over HTTPS in production
//   sameSite: 'none', // Protects against CSRF while allowing standard navigation
//   maxAge: 6 * 60 * 60 * 1000, // 6 hours
//   path: '/', // Accessible across the entire domain
// };

export const cookieOptions: CookieOptions = {
  httpOnly: true, // Prevents client-side JS from accessing the cookie (XSS protection)
  secure: true, // Only sends over HTTPS in production
  sameSite: 'none', // Protects against CSRF while allowing standard navigation
  maxAge: 6 * 60 * 60 * 1000, // 6 hours
  path: '/', // Accessible across the entire domain
};