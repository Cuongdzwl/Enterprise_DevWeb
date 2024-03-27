import { error } from 'console';
import { PrismaClient } from '@prisma/client';
import utils from '../common/utils';
import { UserDTO } from '../models/DTO/User.DTO';
import { User } from '../models/User';
import authStrategy from './authStrategy.service';
import jwt from 'jsonwebtoken';
import L from '../../common/logger';
import bcrypt from 'bcrypt';
import usersService from './users.service';
import { AuthExceptionMessage, ExceptionMessage } from '../common/exception';
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

  async google(req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      authStrategy.authenticate(
        'google',
        { session: false },
        (err: any, user: User) => {
          if (err) {
            reject(err);
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
    const resolve: any = prisma.users
      .findUnique({ where: { Email: email } })
      .then((user) => {
        if (!user)
          return Promise.reject({
            error: AuthExceptionMessage.BAD_REQUEST,
            message: AuthExceptionMessage.USER_NOT_FOUND,
          });
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
          { token, resetLink, securityEmail },
          NotificationSentType.EMAILRESETPASSWORD,
          NotificationSentThrough.Email
        );
        return Promise.resolve({ isSuccess: true });
      })
      .catch((_) => {
        return Promise.reject({
          error: AuthExceptionMessage.BAD_REQUEST,
          message: ExceptionMessage.INVALID,
        });
      });
    return resolve;
  }

  async verifyPhone(code: string, userid: number): Promise<any> {
    return this.verifyOTP(code, userid).then((r) => {
      if (r.isValid) {
        const updated =  prisma.users.update({
          where: { ID: userid },
          data: {
            OTPUsed: true,
            Phone: r.user.NewPhone,
          },
        });
        return Promise.resolve(updated)
      }
      return Promise.reject(r.isValid)
    }).catch((err) => {
      return Promise.reject(err)
    });
  }
  async sendOTP(userid: number, phone?: string, email?: string): Promise<any> {
    const OTP = utils.generateOTP();
    // jwt.sign(
    //   { id: userid, OTP: OTP, for: 'OTP' },
    //   process.env.JWT_SECRET || 'default',
    //   {
    //     expiresIn: '5m',
    //   }
    // );
    var updateduser = await prisma.users.update({
      where: { ID: userid },
      data: {
        OTP: OTP,
        OTPUsed: false,
        OTPExpriedTime: new Date(Date.now() + 5 * 60000),
        OTPRequestedTime: new Date(),
      },
    });
    // send emal
    if (email) {
      notificationsService.trigger(
        updateduser as User,
        { OTP: OTP },
        NotificationSentType.EMAILOTP,
        NotificationSentThrough.Email
      );
    }
    if(phone){
      notificationsService.trigger(
        updateduser as User,
        { OTP: OTP },
        NotificationSentType.PHONEOTP,
        NotificationSentThrough.NewSMS
      );
    }

    return Promise.resolve(updateduser);
  }

  async verifyOTP(code: string, userid: number): Promise<any> {
    const user = await prisma.users.findUnique({
      where: { OTP: code, ID: userid },
    });

    if (!user) {
      return Promise.reject({
        isValid: false,
        error: AuthExceptionMessage.BAD_REQUEST,
        message: AuthExceptionMessage.USER_NOT_FOUND,
      });
    }
    const currentTime = new Date();
    L.info(currentTime.toString);
    const OTPExpriedTime = user.OTPExpriedTime;
    L.info(OTPExpriedTime);

    if (!OTPExpriedTime || currentTime > OTPExpriedTime) {
      return Promise.reject({ isValid: false, message: 'OTP has expired' });
    }

    if (user.OTPUsed) {
      return Promise.reject({
        isValid: false,
        message: 'OTP has already been used',
      });
    }

    // OTP is valid
    return Promise.resolve({ isValid: true, message: 'OTP is valid', user });
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
              error: AuthExceptionMessage.BAD_REQUEST,
              message: AuthExceptionMessage.NOT_FOUND,
            });
          }
          const hashedPassword = bcrypt.hashSync(newPassword, user.Salt);

          prisma.users
            .update({
              where: { ID: user.ID },
              data: { Password: hashedPassword },
            })
            .catch((_) => {
              return Promise.reject({
                error: AuthExceptionMessage.BAD_REQUEST,
                message: AuthExceptionMessage.INVALID_TOKEN,
              });
            });

          // Add a return statement here if needed
          return Promise.resolve({
            message: 'Reset password successfully',
          });
        });
    } catch (error) {
      return Promise.reject({
        isValid: false,
        error: ExceptionMessage.BAD_REQUEST,
        message: AuthExceptionMessage.UNKNOWN,
      });
    }
  }
}
export default new AuthService();
