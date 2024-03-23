import { NextFunction, Request, Response } from 'express';
import authStrategy from '../services/authStrategy.service';
import { User } from '../models/User';
// Role-based Authorization Middleware
export const authorizeRole =
  (requiredRole: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (req.params['ID'] && req.params['ID'] === requiredRole) {
      return next(req);
    } else {
      return res.status(403).json({ message: 'Unauthorized' }).end();
    }
  };

// JWT Authentication Middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    authStrategy.authenticate('jwt', { session: false }, (err: any , user: any, _: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.locals.user = user;
        next();
    })(req, res, next);
};

// JWT Expiration Middleware