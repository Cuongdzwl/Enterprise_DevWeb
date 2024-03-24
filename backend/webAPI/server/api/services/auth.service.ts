import { PrismaClient } from '@prisma/client';
import utils from '../common/utils';
import { UserDTO } from '../models/DTO/User.DTO';
import { User } from '../models/User';
import authStrategy from './authStrategy.service'; 
import jwt from 'jsonwebtoken'
import L from '../../common/logger'

const prisma = new PrismaClient();
const model = 'user';
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
        // Sent the code to the email
        L.info(`Sent code ${code}`)
        prisma.users.findUnique({ where: {Email: email} }).then((user) => {
            if(!user)
                return Promise.reject("User not found")
            prisma.users.update({ where: {ID: user.ID}, data: {OTP: code} })
            return Promise.resolve("OTP updated successfully")
        })
        return Promise.resolve();
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