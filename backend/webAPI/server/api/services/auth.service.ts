import utils from '../common/utils';
import { UserDTO } from '../models/DTO/User.DTO';
import { User } from '../models/User';
import authStrategy from './authStrategy.service'; 
import jwt from 'jsonwebtoken'
export class AuthService {
    async login(req: Request): Promise<any> {
        return new Promise((resolve, reject) => {
          authStrategy.authenticate('local', { session: false }, (err: any, user: User, info: any) => {
            if (err) {
              reject(err);
            } else if (!user) {
              reject(info);
            } else {
              const token = jwt.sign({ id: user.ID }, process.env.JWT_SECRET || 'default', { expiresIn: '1h' });
              resolve({ user: new UserDTO().map(user), token });
            }
          })(req);
        });
    }
    async forgotPassword(email: string): Promise<any> {
        // Generate a random code
        const code = utils.generateOTP();
        email
        return code;
    }
    async bindPhoneToEmail(phone: string, email: string): Promise<any> {
        phone
        email
    }
    async verifyOTP(email: string, code: string): Promise<any> {
        email
        code
    }
    async resetPassword(email: string, code: string, password: string): Promise<any> {
        email
        code
        password
    }

}

export default new AuthService();