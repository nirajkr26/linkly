import { type Request, type Response, type NextFunction, type RequestHandler } from 'express';


export default function wrapAsync(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
}