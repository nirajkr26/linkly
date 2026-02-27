import { Router } from 'express';
import { 
  createShortUrlController, 
  verifyShortUrlPasswordController 
} from '../controllers/shorturl.controllers';
import { optionalAuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createUrlSchema } from '../validations/url.validation';

const ShortUrlRouter: Router = Router();

/**
 * @route   POST /
 * @desc    Create a short URL. Handles Guest (anonymous) and Registered users.
 * @access  Optional Authentication
 */
ShortUrlRouter.post(
  "/", 
  optionalAuthMiddleware, 
  validate(createUrlSchema), // Validating URL and Slug format
  createShortUrlController
);

/**
 * @route   POST /verify
 * @desc    Verify password for a protected short link
 * @access  Public
 */
ShortUrlRouter.post(
  "/verify", 
  verifyShortUrlPasswordController
);

export default ShortUrlRouter;