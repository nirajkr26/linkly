import { type Request, type Response } from 'express';
import { cookieOptions } from '../config/config';
import { loginService, signupService } from '../services/auth.services';
import { signToken } from '../utils/jwtHelper';
import wrapAsync from '../utils/tryCatchWrapper';
import {type IUser } from '../models/user.model';

/**
 * LOCAL SIGNUP
 */
const signupController = wrapAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const { token, user } = await signupService(name, email, password);

  req.user = user as IUser;
  res.cookie('token', token, cookieOptions);

  res.status(201).json({
    isSuccess: true,
    message: 'User registered successfully',
    data: {
      user: {
        email: user.email,
        name: user.name,
        _id: user._id,
        avatar: user.avatar,
        provider: user.provider,
      },
    },
  });
});

/**
 * LOCAL LOGIN
 */
const loginController = wrapAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { token, user } = await loginService(email, password);

  req.user = user as IUser;
  res.cookie('token', token, cookieOptions);

  res.status(200).json({
    isSuccess: true,
    message: 'User logged in successfully',
    data: {
      user: {
        email: user.email,
        name: user.name,
        _id: user._id,
        avatar: user.avatar,
        provider: user.provider,
      },
    },
  });
});

/**
 * GOOGLE AUTH SUCCESS
 */
const googleAuthController = wrapAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new Error("Google Authentication failed: No user found");

  const token = signToken(req.user);
  res.cookie('token', token, cookieOptions);

  res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback`);
});

/**
 * LOGOUT
 */
const logoutController = wrapAsync(async (req: Request, res: Response) => {
  res.clearCookie('token', {
    ...cookieOptions,
    maxAge: 0 // Immediately expire
  });

  res.status(200).json({
    isSuccess: true,
    message: 'User logged out successfully',
  });
});

/**
 * GET CURRENT USER
 */
const getCurrentUserController = wrapAsync(async (req: Request, res: Response) => {
  const user = req.user;
  
  if (!user) {
    return res.status(401).json({ isSuccess: false, message: "Not authenticated" });
  }

  res.status(200).json({
    isSuccess: true,
    message: 'Current user fetched successfully',
    data: {
      user: {
        email: user.email,
        name: user.name,
        _id: user._id,
        avatar: user.avatar,
        provider: user.provider,
      },
    },
  });
});

export {
  signupController,
  loginController,
  googleAuthController,
  logoutController,
  getCurrentUserController,
};