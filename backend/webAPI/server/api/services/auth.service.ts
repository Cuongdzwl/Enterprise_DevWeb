import { Request, Response } from 'express';
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
import { NotificationSentThrough } from '../models/NotificationSentThrough';
import {
  NotificationSentType,
  NotificationSentTypeEnum,
} from '../models/NotificationSentType'; // Import the correct file

const prisma = new PrismaClient();
const model = 'user';
export class AuthService {
  async login(req: Request): Promise<any> {
    if (req.body.FacultyID) {
      var foundInFaculty: boolean = await prisma.users
        .findUnique({
          where: {
            Email: req.body.email as string, // Add the Email property
            FacultyID: req.body.FacultyID as number,
          },
        })
        .then((r) => {
          if (r) {
            L.info(r);
            return Promise.resolve(true);
          }
          return Promise.resolve(false);
        })
        .catch((_) => {
          return Promise.resolve(false);
        });
      L.info(foundInFaculty);
      if (!foundInFaculty) {
        return Promise.reject({
          error: AuthExceptionMessage.BAD_REQUEST,
          message: AuthExceptionMessage.INVALID_USER_NOT_BELONG_TO_FACULTY,
        });
      }
    }
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
              { id: user.ID, roleID: user.RoleID, FacultyID: user.FacultyID },
              process.env.JWT_SECRET || 'default',
              { expiresIn: '1h' }
            );
            resolve({ user: new UserDTO().map(user), token });
          }
        }
      )(req);
    });
  }

  async google(req: any): Promise<any> {
    return new Promise((resolve, reject) => {
      authStrategy.authenticate(
        'google',
        { session: false },
        (err: any, user: User, info: any) => {
          if (err) {
            reject(err);
          } else if (!user) {
            reject(info);
          } else {
            const token = jwt.sign(
              { id: user.ID, roleID: user.RoleID, FacultyID: user.FacultyID },
              process.env.JWT_SECRET || 'default',
              { expiresIn: '3h' }
            );
            resolve({ user: new UserDTO().map(user), token });
          }
        }
      )(req);
    });
  }
  async forgotPassword(email: string, _: string): Promise<any> {
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
        L.info('Updated User');
        const site = process.env.SITE_DOMAIN || 'http://localhost:5173';
        const resetLink = site + '/resetpassword?token=' + token;
        const securityEmail = 'cuongndgch211353@fpt.edu.vn';
        // Send email
        notificationsService.trigger(
          user as User,
          { token, resetLink, securityEmail },
          NotificationSentTypeEnum.EMAILRESETPASSWORD, // Use the correct type
          NotificationSentThrough.Email
        );
        return Promise.resolve({ isSuccess: true });
      })
      .catch((e) => {
        return Promise.reject({
          error: AuthExceptionMessage.BAD_REQUEST,
          message: ExceptionMessage.INVALID,
          e: e,
        });
      });
    return resolve;
  }

  async verifyPhone(code: string, userid: number): Promise<any> {
    return this.verifyOTP(code, userid)
      .then((r) => {
        if (r.isValid) {
          const updated = prisma.users.update({
            where: { ID: userid },
            data: {
              OTPUsed: true,
              Phone: r.user.NewPhone,
            },
          });
          return Promise.resolve(updated);
        }
        return Promise.reject(r.isValid);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ): Promise<any> {
    const validate = usersService.validatePassword(newPassword);
    if(!validate.isValid) {
      return Promise.reject({ message: validate.message });
    }

    return prisma.users
      .findUnique({ where: { ID: id } })
      .then((r) => {
        if (r == null) {
          return Promise.reject({ message: 'User not found' });
        }
        const validPassword = bcrypt.compareSync(oldPassword, r.Password);
        if (validPassword) {
          const salt = r.Salt;
          const hashedPassword = bcrypt.hashSync(newPassword, salt);
          L.info(`Updated Password for ${id}`)
          return prisma.users
            .update({ data: { Password: hashedPassword }, where: { ID: id } })
            .then((e) => {
              L.info(`Updated user with ${e}`)
              if (e) return Promise.resolve({ message: 'Password changed' });
              else return Promise.reject({ message: 'User not found' });
            });
        } else {
          return Promise.reject({ message: 'Password not match' });
        }
      })
      .catch((err) => {
        L.error(err);
        return Promise.reject(err);
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
        NotificationSentTypeEnum.EMAILOTP,
        NotificationSentThrough.Email
      );
    }
    if (phone) {
      notificationsService.trigger(
        updateduser as User,
        { OTP: OTP },
        NotificationSentTypeEnum.PHONEOTP,
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
