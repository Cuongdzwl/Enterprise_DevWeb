import { IAuthController } from 'server/api/interfaces/IAuthController.interface';
import UserService from '../../services/users.service';
import { Request, Response } from 'express';
import authService from '../../services/auth.service';
import { UserDTO } from 'server/api/models/DTO/User.DTO';
import { User } from '../../models/User'
import L from '../../../common/logger'
import * as bcrypt from 'bcrypt';

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
    const id = Number.parseInt(res.locals.user.user.ID + '');
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
      res.status(200).json({ user, token });
    } catch (err) {
      res.status(400).json({ message: err });
    }
  }


  async forgotPassword(req: Request, res: Response): Promise<void> {
    const email = req.query.email?.toString();
    await authService
      .forgotPassword(email as string, req.headers.origin as string)
      .then((r) => {
        L.info(r);
        if (r) {
          res.status(200).json('Email sent');
        } else {
          res.status(404).json('User not found');
        }
      })
      .catch((err) => {
        res.status(400).json('error: ' + err.message);
      });
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    const code = req.body.code?.toString() || '';
    const otpRegex = /^\d{6}$/;
    const check = otpRegex.test(code);

    L.info(req.body);
    if (!check) {
      res.status(400).json({ message: 'Wrong OTP' }).end();
      return;
    }
    await authService
      .verifyOTP(code, res.locals.user.user.ID)
      .then((r) => {
        if (r) return res.status(200).json({ message: 'OTP verified' });
        else return res.status(400).json({ message: 'Wrong OTP' });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }

  async sendOTP(_: Request, res: Response): Promise<void> {
    await authService
      .sendOTP(res.locals.user.user.ID,res.locals.user.user.NewPhone)
      .then((r) => {
        if (r) return res.status(200).json({ message: 'OTP sent' });
        else return res.status(400).json({ message: 'OTP not sent' });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }

  async verifyPhone(req: Request, res: Response): Promise<void> {
    const code :string = req.body.code?.toString() || '';
    const otpRegex = /^\d{6}$/;
    const check = otpRegex.test(code);

    if (!check) {
      res.status(400).json({ message: 'Wrong OTP' }).end();
      return;
    }

    await authService
      .verifyPhone(code, res.locals.user.user.ID)
      .then((r) => {
        if (r) return res.status(200).json({ message: 'Phone verified' });
        else return res.status(400).json({ message: 'Wrong phone' });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
  async resetPassword(req: Request, res: Response): Promise<void> {
    const token: string = req.query.token?.toString() as string;
    const newPassword: string = req.body.newPassword;
    if (req.query.token == null) {
      res.status(401).json({ message: 'Missing token' }).end();
      return;
    }
    await authService
      .resetPassword(token, newPassword)
      .then(() =>
        res.status(200).json({ message: 'Password reset successful' })
      )
      .catch((err) => {
        res.status(400).json(err);
      });
  }
}
export default new AuthController();
