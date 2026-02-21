import { type Request, type Response, type NextFunction } from 'express';
import { ZodError ,ZodType} from 'zod';

/**
 * Generic validation middleware using Zod.
 * T extends ZodType ensures we can pass any valid Zod schema.
 */
export const validate = <T extends ZodType>(schema: T) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // parseAsync allows handles both sync and async refinements (like checking DB for existing email)
            const result = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            // Cleanly overwrite with validated data (removes extra unallowed fields)
            const data = result as any;
            req.body = data.body;
            req.query = data.query;
            req.params = data.params;

            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Returns a cleaner error message or the raw issues array
                const errorMessage = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(", ");
                
                return res.status(400).json({
                    isSuccess: false,
                    message: "Validation Error",
                    errors: errorMessage, 
                    // Optional: detail: error.issues // Good for frontend debugging
                });
            }
            
            // Pass any other unexpected errors to your global error handler
            return next(error);
        }
    };
