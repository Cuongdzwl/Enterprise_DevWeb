import { Notification } from '../models/Notification';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import {
  ExceptionMessage,
  NotificationExceptionMessage,
} from '../common/exception';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { IBulkEvents, Novu } from '@novu/node';
import { NotificationSentThrough } from '../models/NotificationSentThrough';
import { NotificationSentTypeEnum } from '../models/NotificationSentType';
import { User } from '../models/User';
import { TransactionDTO } from '../models/DTO/TransactionDTO';

const novu = new Novu(process.env.NOVU_API_KEY as string);

const prisma = new PrismaClient();
const model = 'scheduledNotifications';

export class NotificationService implements ISuperService<Notification> {
  private checkAPIKEY(): boolean {
    return process.env.NOVU_API_KEY ? true : false;
  }
  async bulkTrigger(
    user: User[],
    payload: any,
    type: NotificationSentTypeEnum,
    through: NotificationSentThrough
  ): Promise<any> {
    if (!this.checkAPIKEY()) {
      throw new Error('NOVU_API_KEY is not set');
    }
    // Build the payload
    const events: IBulkEvents[] = [];
    for (const u of user) {
      let upayload = payload;
      var sendType: any = {};
      if (
        through === NotificationSentThrough.SMS ||
        (through === NotificationSentThrough.NewSMS && !u.Phone)
      ) {
        sendType.sms = 'true';
      }
      if (through === NotificationSentThrough.Email) {
        sendType.email = 'true';
      }
      if (through === NotificationSentThrough.InApp) {
        sendType.inapp = 'true';
      }
      upayload.sentType = sendType;
      upayload.Name = u.Name;
      events.push({
        name: type,
        to: {
          subscriberId: u.ID.toString(),
          email:
            through === NotificationSentThrough.Email ? u.Email : undefined,
          phone: through === NotificationSentThrough.SMS ? u.Phone : undefined,
        },
        payload: upayload,
      });
    }
    // Send Payload
    try {
      if (events[0].payload.sendAtd) {
        novu.events.bulkTrigger(events).then(async (r) => {
          var data: TransactionDTO[] = r.data.data;
          prisma.notificationSentTypes
            .findFirstOrThrow({ where: { Name: type as string } })
            .then((notiType) => {
              for (let i = 0; i < user.length; i++) {
                const u = user[i];
                const d = data[i];
                var notification: Notification = {
                  NotificationSentTypeID: notiType.ID,
                  EventID: payload.Event.ID,
                  SentTo: u.ID,
                  SentAt: payload.sendAt,
                  TransactionID: d.transactionId,
                  Acknowledged: d.acknowledged,
                  Status: d.status,
                  IsCancelled: false,
                };
                this.create(notification).catch((err) => {
                  L.error(err);
                });
              }
              L.info('Scheduled Notifications Created');
              return Promise.resolve({ success: true });
            })
            .catch((_) => {
              // Create new if doesn't exist
              prisma.notificationSentTypes
                .create({
                  data: {
                    Name: type as string,
                  },
                })
                .then((notiType) => {
                  for (let i = 0; i < user.length; i++) {
                    const u = user[i];
                    const d = data[i];
                    var notification: Notification = {
                      NotificationSentTypeID: notiType.ID,
                      EventID: payload.Event.ID,
                      SentTo: u.ID,
                      SentAt: payload.sendAt,
                      TransactionID: d['transactionId'],
                      Acknowledged: d['acknowledged'],
                      Status: d['status'],
                      IsCancelled: false,
                    };
                    this.create(notification).catch((err) => {
                      L.error(err);
                    });
                  }

                  return Promise.resolve({ success: true });
                });
            });
        });
        // this.create({});
        return Promise.resolve({ success: true });
      } else {
        novu.events.bulkTrigger(events);
        return Promise.resolve({ success: true });
      }
    } catch (err) {
      return Promise.resolve({ success: true , message: "Faculty Empty"});
    }
  }
  async trigger(
    user: User,
    payload: any,
    type: NotificationSentTypeEnum,
    through: NotificationSentThrough
  ): Promise<any> {
    try {
      var to: any = {
        subscriberId: user.ID,
        email:
          through === NotificationSentThrough.Email ? user.Email : undefined,
      };

      var phone: string | undefined = undefined;
      //
      if (user.Phone || through === NotificationSentThrough.SMS)
        to.phone = user.Phone;
      if (user.NewPhone || through === NotificationSentThrough.NewSMS)
        to.phone = user.NewPhone;

      var sendType: any = {};
      if (
        through === NotificationSentThrough.SMS ||
        (through === NotificationSentThrough.NewSMS && !to.phone)
      ) {
        sendType.sms = 'true';
      }
      if (through === NotificationSentThrough.Email) {
        sendType.email = 'true';
      }
      if (through === NotificationSentThrough.InApp) {
        sendType.inapp = 'true';
      }
      payload.sentType = sendType;
      L.info(to);
      L.info(payload);
      if (payload.sendAt) {
        novu
          .trigger(type as string, {
            to,
            payload: payload,
          })
          .then((r) => {
            L.info(r.data);

            const data: TransactionDTO = r.data;
            prisma.notificationSentTypes
              .findFirstOrThrow({ where: { Name: type as string } })
              .then((notiType) => {
                var notification: Notification = {
                  NotificationSentTypeID: notiType.ID,
                  EventID: payload.EventID,
                  SentTo: user.ID,
                  SentAt: payload.sendAt,
                  TransactionID: data.transactionId,
                  Acknowledged: data.acknowledged,
                  Status: data.status,
                  IsCancelled: false,
                };
                this.create(notification);
              })
              .catch((_) => {
                // Create new if doesn't exist
                prisma.notificationSentTypes
                  .create({
                    data: {
                      Name: type as string,
                    },
                  })
                  .then((notiType) => {
                    var notification: Notification = {
                      NotificationSentTypeID: notiType.ID,
                      EventID: payload.EventID,
                      SentTo: user.ID,
                      SentAt: payload.sendAt,
                      TransactionID: data.transactionId,
                      Acknowledged: data.acknowledged,
                      Status: data.status,
                      IsCancelled: false,
                    };
                    this.create(notification);
                  });
              });
            return Promise.resolve({ success: true });
          });
      } else {
        novu.trigger(type as string, { to, payload });
        return Promise.resolve({ success: true });
      }
    } catch (error) {
      Promise.reject({ success: false, error: error });
    }
  }
  cancel(transactionid : string): Promise<any>{
    return novu.events.cancel(transactionid).then((r) => {
      L.info(r);
      return Promise.resolve({ success: true });
    });
  }
  async bulkCancel(transactions: string[]): Promise<any> {
    var cancelled: string[] = [];
    L.info(`Start mass cancelling....`);
    for (const id of transactions) {
      if (typeof id === 'string') {
        novu.events
          .cancel(id)
          .then((_) => {
            cancelled.push(id);
            L.info(`Cancelled ${model} with transactionID ${id}`);
          })
          .catch((err) => {
            L.error(err);
          });
      }
    }

    prisma.scheduledNotifications
      .updateMany({
        where: { TransactionID: { in: cancelled } },
        data: { IsCancelled: true },
      })
      .then((r) => {
        L.info(r);
      })
      .catch((err) => {
        L.error(err);
      });
    return Promise.resolve({ success: true });
  }
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
    L.info(notification);
    return prisma.scheduledNotifications
      .create({
        data: {
          NotificationSentTypeID: notification.NotificationSentTypeID,
          EventID: notification.EventID,
          SentTo: notification.SentTo,
          SentAt: notification.SentAt,
          TransactionID: notification.TransactionID,
          Acknowledged: notification.Acknowledged,
          Status: notification.Status,
          IsCancelled: notification.IsCancelled || false,
        },
      })
      .then((result) => {
        L.info(`create ${model} with id ${result.ID}`);
        return Promise.resolve(result);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
  // Delete
  delete(id: number): Promise<any> {
    L.info(`delete ${model} with id ${id}`);
    return prisma.scheduledNotifications
      .delete({
        where: { ID: id },
      })
      .then((r) => {
        return Promise.resolve(r);
      })
      .catch((_) => {
        return Promise.resolve({
          error: ExceptionMessage.INVALID,
          message: ExceptionMessage.BAD_REQUEST,
        });
      });
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
    notification;
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
