import { type CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 6 * 60 * 60 * 1000,
  path: '/',
};