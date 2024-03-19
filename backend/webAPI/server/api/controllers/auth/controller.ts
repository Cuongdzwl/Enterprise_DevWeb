import UserService from '../../services/users.service';
import { Request, Response } from 'express';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    //     
    const result = await UserService.all();
    res.json(result);
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
