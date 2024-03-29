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

    var role : number = Number.parseInt(res.locals.user.user.RoleID + '')

    L.info(role + '')
    if (role === rolemap.get(require)) {  
      return next();
    } else {
      return res.status(403).json({ message: 'Forbidden' }).end();
    }
  };


export const authorizeFaculty =
  (require: number) =>
  (_: Request, res: Response, next: NextFunction) => {
    if(res.locals.user.user.RoleID == 1 || 2 ) {
      next()
    }
    if (res.locals.user.user.FacultyID == require) {  
      return next();
    } else {
      return res.status(403).json({ message: 'Forbidden' }).end();
    }
  };


  export const authorizeContribution =
  (require: number) =>
  (_: Request, res: Response, next: NextFunction) => {
    if(res.locals.user.user.RoleID) {
      next()
    }
    // Check if the contribution is belonging to the user
    if (res.locals.user.user.FacultyID == require) {  
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden' }).end();
    }
    return;
  };
// JWT Authentication Middleware


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