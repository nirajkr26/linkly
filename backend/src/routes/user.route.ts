import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
    getAllUserUrlsController,
    updateUserUrlController,
    deleteUserUrlController
} from '../controllers/user.controllers';
import { validate } from '../middlewares/validate.middleware';
import { updateUrlSchema } from '../validations/url.validation';

const UserRoutes: Router = Router();


// GET /api/user/urls - Fetch all URLs owned by the user
UserRoutes.get(
    '/urls',
    authMiddleware,
    getAllUserUrlsController
);

// PUT /api/user/urls/:id - Update specific URL settings
// Uses the Zod schema to validate both req.params.id and req.body
UserRoutes.put(
    '/urls/:id',
    authMiddleware,
    validate(updateUrlSchema),
    updateUserUrlController
);

// DELETE /api/user/urls/:id - Remove a short link
UserRoutes.delete(
    '/urls/:id',
    authMiddleware,
    deleteUserUrlController
);

export default UserRoutes;