import { Router } from 'express';
import passport from 'passport';
import {
  signupController,
  loginController,
  logoutController,
  getCurrentUserController,
  googleAuthController,
} from '../controllers/auth.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
import { signupSchema, loginSchema } from '../validations/auth.validation';
import { validate } from '../middlewares/validate.middleware';

// Use a safe fallback for the frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const AuthRoutes: Router = Router();

/**
 * @section Local Auth
 */
AuthRoutes.post('/signup',validate(signupSchema), signupController);
AuthRoutes.post('/login',validate(loginSchema), loginController);
AuthRoutes.post('/logout', logoutController);

/**
 * @section Google OAuth
 */
AuthRoutes.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

AuthRoutes.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${FRONTEND_URL}/auth`,
  }),
  googleAuthController
);

/**
 * @section Protected Routes
 */
AuthRoutes.get('/me', authMiddleware, getCurrentUserController);

export default AuthRoutes;