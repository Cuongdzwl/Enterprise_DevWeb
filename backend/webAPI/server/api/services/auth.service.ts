import { PrismaClient } from '@prisma/client';
import utils from '../common/utils';
import { UserDTO } from '../models/DTO/User.DTO';
import { User } from '../models/User';
import authStrategy from './authStrategy.service';
import jwt from 'jsonwebtoken';
import L from '../../common/logger';
import bcrypt from 'bcrypt';
import usersService from './users.service';
import { ExceptionMessage } from '../common/exception';
import notificationsService from './notifications.service';
import { NotificationSentType } from '../models/NotificationSentType';
import { NotificationSentThrough } from '../models/NotificationSentThrough';

const prisma = new PrismaClient();
const model = 'user';
export class AuthService {
  async login(req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      authStrategy.authenticate(
        'local',
        { session: false },
        (err: any, user: User, info: any) => {
          if (err) {
            reject(err);
          } else if (!user) {
            reject(info);
          } else {
            const token = jwt.sign(
              { id: user.ID },
              process.env.JWT_SECRET || 'default',
              { expiresIn: '1h' }
            );
            resolve({ user: new UserDTO().map(user), token });
          }
        }
      )(req);
    });
  }
  async forgotPassword(email: string, origin: string): Promise<any> {
    prisma.users
      .findUnique({ where: { Email: email } })
      .then((user) => {
        L.info(user)
        if (!user) return Promise.reject('User not found');
        const payload = {
          id: user.ID,
          for: 'password_reset',
        };

        const token: string = jwt.sign(
          payload,
          process.env.JWT_SECRET || 'default',
          {
            expiresIn: '30m',
          }
        );
        prisma.users.update({
          where: { ID: user.ID },
          data: {
            ResetPassword: token,
          },
        });
        const resetLink = origin + '/auth/reset-password?token=' + token;
        const securityEmail = 'cuongndgch211353@fpt.edu.vn';
        // Send email
        notificationsService.trigger(
          user as User,
          { token , resetLink, securityEmail},
          NotificationSentType.EMAILRESETPASSWORD,
          NotificationSentThrough.Email
        );
        return Promise.resolve(user);
      })
      .catch((_) => {
        Promise.reject({ message: ExceptionMessage.BAD_REQUEST });
      });
  }

  async bindPhoneToEmail(phone: string, email: string): Promise<any> {
    phone;
    email;
  }
  async verifyOTP(email: string, code: string): Promise<any> {
    return prisma.users.findUnique({ where: { Email: email } }).then((user) => {
      if (!user)
        return Promise.reject({
          message: 'User does not exist',
        });
      // Verify the code
      if (user.OTP !== code)
        return Promise.reject({
          message: 'Wrong OTP code',
        });
      // Verify the code expiration
      if (user.OTPExpriedTime && new Date() > new Date(user.OTPExpriedTime))
        return Promise.reject('Code expired');
      // Update the user's password
      return prisma.users
        .update({
          where: { ID: user.ID },
          data: {
            OTPUsed: true,
          },
        })
        .then(() => {
          return Promise.resolve({
            message: 'OTP verified successfully',
          });
        });
    });
  }
  async resetPassword(token: string, newPassword: string): Promise<any> {
    try {
      const decoded: jwt.JwtPayload = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default'
      ) as jwt.JwtPayload;

      if (!decoded || decoded.for !== 'password_reset') {
        // Add a return statement here if needed
      }
      await prisma.users
        .findUnique({ where: { ID: decoded.id } })
        .then((user) => {
          if (!user) {
            return Promise.reject({
              message: 'User not found',
            });
          }
          const hashedPassword = bcrypt.hashSync(newPassword, user.Salt);

          prisma.users
            .update({
              where: { ID: user.ID },
              data: { Password: hashedPassword },
            })
            .catch((_) => {
              return Promise.reject({ message: ExceptionMessage.BAD_REQUEST });
            });

          // Add a return statement here if needed
          return Promise.resolve({
            message: 'Reset password successfully',
          });
        });
    } catch (error) {
      return Promise.reject({
        isValid: false,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }
}
export default new AuthService();
