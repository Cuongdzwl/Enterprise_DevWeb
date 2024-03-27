import { Notification } from '../models/Notification';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import {
  ExceptionMessage,
  NotificationExceptionMessage,
} from '../common/exception';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { Novu } from '@novu/node';
import { NotificationSentThrough } from '../models/NotificationSentThrough';
import { NotificationSentType } from '../models/NotificationSentType';   
import { User } from '../models/User';

const novu = new Novu(process.env.NOVU_API_KEY as string);

const prisma = new PrismaClient();
const model = 'scheduledNotifications';

export class NotificationService implements ISuperService<Notification> {
  private checkAPIKEY(): boolean {
    return process.env.NOVU_API_KEY ? true : false;
  }
  bulkTrigger(
    user: User[],
    payload: any,
    type: NotificationSentType,
    through: NotificationSentThrough
  ): void {
    if (!this.checkAPIKEY()) {
      throw new Error('NOVU_API_KEY is not set');
    }
    user;
    payload;
    type;
    through;
  }
  trigger(
    user: User,
    payload: any,
    type: NotificationSentType,
    through: NotificationSentThrough
  ) {
    var to: any = {
      subscriberId: user.ID.toString(), // Convert subscriberId to string
      email: through === NotificationSentThrough.Email ? user.Email : undefined,
    };

    var phone: string | undefined = undefined;
    //
    if (user.Phone || through === NotificationSentThrough.SMS)
      to.phone = user.Phone;
    if (user.NewPhone || through === NotificationSentThrough.NewSMS)
      to.phone = user.NewPhone;

    var sendType : any = {}
    if(through === NotificationSentThrough.SMS || through === NotificationSentThrough.NewSMS && !to.phone) {
      sendType.sms = "true";
    }
    if(through === NotificationSentThrough.Email) {
      sendType.email = "true";
    }
    if(through === NotificationSentThrough.InApp) {
      sendType.inapp = "true";
    }
    payload.sentType = sendType;
    L.info(to)
    L.info(payload)
    novu
      .trigger(type as string, {
        to,
        payload: payload,
      })
      .then((_) => {
        if (payload.SendAt){
          // save to db
        }
      });
  }
  cancel(transactionID: string): Promise<any> {
    return Promise.resolve(novu.events.cancel(transactionID));
  }
  bulkCancel() {}
  broadcast() {}
  all(): Promise<any> {
    const scheduledNotifications = prisma.scheduledNotifications.findMany();
    L.info(scheduledNotifications, `fetch all ${model}(s)`);
    return Promise.resolve(scheduledNotifications);
  }
  // Filter
  byId(id: number): Promise<any> {
    L.info(`fetch ${model} with id ${id}`);
    const notification = prisma.scheduledNotifications.findUnique({
      where: { ID: id },
    });
    return Promise.resolve(notification);
  }

  search(field: string, key: string): Promise<any> {
    const scheduledNotifications = prisma.scheduledNotifications.findMany({
      where: {
        [field]: {
          contains: key,
        },
      },
    });
    L.info(scheduledNotifications, `fetch all ${model}(s)`);
    return Promise.resolve(scheduledNotifications);
  }
  filter(field: string, key: string): Promise<any> {
    const scheduledNotifications = prisma.scheduledNotifications.findMany({
      where: {
        [field]: key,
      },
    });
    L.info(scheduledNotifications, `fetch all ${model}(s)`);
    return Promise.resolve(scheduledNotifications);
  }

  // Create
  create(notification: Notification): Promise<any> {
    // TODO: VALIDATE CONSTRAINTss
    if (!this.validateConstraints(notification)) {
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
    //
    try {
      // Validate Constraint
      L.info(`create ${model} with id ${notification.ID}`);
      // const createdNotification = prisma.scheduledNotifications.create({
      //   data: {

      //   },
      // });
      const createdNotification = null
      return Promise.resolve(createdNotification);
    } catch (error) {
      L.error(`create ${model} failed: ${error}`);
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }
  // Delete
  delete(id: number): Promise<any> {
    try {
      L.info(`delete ${model} with id ${id}`);
      const deletedNotification = prisma.scheduledNotifications.delete({
        where: { ID: id },
      });
      return Promise.resolve(deletedNotification);
    } catch (error) {
      L.error(`delete ${model} failed: ${error}`);
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }
  // Update
  update(id: number, notification: Notification): Promise<any> {
    // Validate
    if (!this.validateConstraints(notification)) {
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
    try {
      L.info(`update ${model} with id ${notification.ID}`);
      const updatedNotification = prisma.scheduledNotifications.update({
        where: { ID: id },
        data: {},
      });
      return Promise.resolve(updatedNotification);
    } catch (error) {
      L.error(`update ${model} failed: ${error}`);
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }
  async validateConstraints(
    notification: Notification
  ): Promise<{ isValid: boolean; error?: string; message?: string }> {
    notification
  //   // Validate Content
  //   if (!notification.Content || notification.Content.length > 1000) {
  //     return {
  //       isValid: false,
  //       error: NotificationExceptionMessage.INVALID,
  //       message:
  //         'Notification content is invalid or too long, with a maximum of 1000 characters.',
  //     };
  //   }

  //   // Validate SendAt
  //   if (!notification.SentAt || new Date(notification.SentAt) < new Date()) {
  //     return {
  //       isValid: false,
  //       error: NotificationExceptionMessage.INVALID,
  //       message: 'SendAt must be set to a time in the future.',
  //     };
  //   }

  //   // Validate SendTo
  //   if (!notification.SentTo) {
  //     return {
  //       isValid: false,
  //       error: NotificationExceptionMessage.INVALID_NOTIFICATIONID,
  //       message: 'SendTo cannot be empty.',
  //     };
  //   }
  //   if (
  //     !notification.FromTable ||
  //     !/^[A-Za-z\s]{1,30}$/.test(notification.FromTable)
  //   ) {
  //     return {
  //       isValid: false,
  //       error: NotificationExceptionMessage.INVALID_NOTIFICATIONID,
  //       message:
  //         'FromTable is invalid, must not contain special characters, and have a maximum of 30 characters.',
  //     };
  //   }

  //   // If all validations pass
    return { isValid: true };
  }
}

export default new NotificationService();
