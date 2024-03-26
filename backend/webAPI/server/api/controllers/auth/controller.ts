import { IAuthController } from 'server/api/interfaces/IAuthController.interface';
import UserService from '../../services/users.service';
import { Request, Response } from 'express';
import authService from '../../services/auth.service';
import { UserDTO } from 'server/api/models/DTO/User.DTO';
import L from '../../../common/logger';
export class AuthController implements IAuthController {
  logout(_: Request, res: Response): void {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out' });
  }
  profile(_: Request, res: Response): void {
    res
      .status(200)
      .json({ user: res.locals.user.user, message: 'User is authenticated' });
  }

  updateProfile(req: Request, res: Response): void {
    const id = Number.parseInt(res.locals.user.user.userID);
    try {
      UserService.update(id, req.body).then((r) => {
        if (r) res.status(201).json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await authService.login(req);
      res.json({ user, token });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const email = req.query.email;
    authService.forgotPassword(email as string,req.headers.origin as string).then((r) => {
      if (r) {
        res.status(200).json('Email sent');
      } else {
        res.status(404).json('User not found');
      }
    });
  }
  async verifyOTP(req: Request, res: Response): Promise<void> {
    let code = '';
    if (req.query.code) {
      code = req.query.code.toString();
    } else {
      res.status(400).json({ message: 'No code provided' });
      return;
    }

    authService.verifyOTP(code).then((r) => {
      if (r) return res.status(200).json({ message: 'OTP verified' });
      else return res.status(400).json({ message: 'Wrong OTP' });
    });
  }
  async resetPassword(req: Request, res: Response): Promise<void> {
    const token: string = req.query.token as string;
    const newPassword: string = req.body.newPassword;
    if (!token) {
      res.status(401).json({ message: 'Invalid token' });
    }
    authService
      .resetPassword(token, newPassword)
      .then(() =>
        res.status(200).json({ message: 'Password reset successful' })
      );
  }
}
export default new AuthController();
