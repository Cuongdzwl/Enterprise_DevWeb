import { NextFunction, Request, Response } from 'express';
import authStrategy from '../services/authStrategy.service';
import { User } from '../models/User';
import L from '../../common/logger';
export const authorizeRole =
  (require: string) =>
  (_: Request, res: Response, next: NextFunction) => {
    // Check role id
    var rolemap : Map<string,number> = new Map<string,number>();

    rolemap.set('admin',1);
    rolemap.set('manager',2);
    rolemap.set('coordinator',3);
    rolemap.set('student',4);
    try {
      var role : number = Number.parseInt(res.locals.user.user.RoleID)
    } catch (error) {
      return res.status(403).json({ message: 'Forbidden' }).end();
    }

    const requiredRoles = require.split(',');
    return requiredRoles.forEach(element => {
      try{
        if (role == rolemap.get(element))
        {
          return next();
        }
      }catch(_){
        return res.status(403).json({ message: 'Forbidden' }).end();
      }
    });
  };

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    authStrategy.authenticate('jwt', { session: false }, (err: any, user: any, _: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.locals.user = user;
        L.info(res.locals.user)
        next();
    })(req, res, next);
};

// JWT Expiration Middleware