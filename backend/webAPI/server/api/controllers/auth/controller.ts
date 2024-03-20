import { IAuthController } from 'server/api/interfaces/IAuthController.interface';
import UserService from '../../services/users.service';
import { Request, Response } from 'express';

export class AuthController implements IAuthController {
  logout(req: Request, res: Response): void {
    throw new Error('Method not implemented.');
  }
  user(req:Request, res: Response): void {
    throw new Error('Method not implemented.');
  }
  async login(req: Request, res: Response): Promise<void> {
    res.json().end();
  }
  async forgotPassword(req: Request, res: Response): Promise<void> {
    //     
    const result = await UserService.all();
    res.json(result);
  }
  async verifyOTP(){

  }
}
export default new AuthController();
