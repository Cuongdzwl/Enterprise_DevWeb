import { IAuthController } from 'server/api/interfaces/IAuthController.interface';
import UserService from '../../services/users.service';
import { Request, Response } from 'express';
import authService from '../../services/auth.service';
import { UserDTO } from 'server/api/models/DTO/User.DTO';

export class AuthController implements IAuthController {
  logout(_: Request, res: Response): void {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out' });
  }
  user(_:Request, res: Response): void {
    res.status(200).json({user: res.locals.user, message: 'User is authenticated' });
  }
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await authService.login(req);
      res.json({ user, token });
    } catch (err) {
      res.status(400).json({ message: err.message + "controller" });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const email = req.query.email      
    const result = await UserService.all();
    res.json(result);
  }
  async verifyOTP(){

  }
}
export default new AuthController();
