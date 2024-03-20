import { IAuthController } from 'server/api/interfaces/IAuthController.interface';
import UserService from '../../services/users.service';
import { Request, Response } from 'express';
import { User } from 'server/api/models/User';
import bcrypt from 'bcrypt'

export class AuthController implements IAuthController {
  logout(_: Request, res: Response): void {
    res.json().end();
  }
  user(_:Request, res: Response): void {
    res.json().end();
  }
  async login(req: Request, res: Response): Promise<void> {
    const { email, password, phone } = req.body;
    UserService.filter('Email', email).then((r) => {
      r = r as User;
      if (r) {
        const salt = r.Salt
        bcrypt.hash(password, salt)
      }
      else{
        res.status(404).end()
      }
    });


    res.json().end();
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
