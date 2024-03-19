// import { Notification } from 'server/models/Notification';
// import L from '../../common/logger';
// import { PrismaClient } from '@prisma/client';
// import { ExceptionMessage } from '../common/exception';
// import { Filter } from '../common/filter';
// import { ISuperService } from '../interfaces/ISuperService.interface';

// const prisma = new PrismaClient();
// const model = 'notification';

// export class NotificationService implements ISuperService<Notification> {
//   all(): Promise<any> {
//     const notifications = prisma.notifications.findMany();
//     L.info(notifications, `fetch all ${model}(s)`);
//     return Promise.resolve(notifications);
//   }
//   // Filter
//   byId(id: number): Promise<any> {
//     L.info(`fetch ${model} with id ${id}`);
//     const notification = prisma.notifications.findUnique({
//       where: { ID: id },
//     });
//     return Promise.resolve(notification);
//   }

//   filter(filter: Filter, key: string): Promise<any> {
//     const notifications = prisma.notifications.findMany({
//       where: {
//         [filter]: key,
//       },
//     });
//     L.info(notifications, `fetch all ${model}(s)`);
//     return Promise.resolve(notifications);
//   }

//   // Create
//   create(notification: Notification): Promise<any> {
//     // TODO: VALIDATE CONSTRAINTss
//     if (!this.validateConstraints(notification)) {
//       return Promise.resolve({
//         error: ExceptionMessage.INVALID,
//         message: ExceptionMessage.BAD_REQUEST,
//       });
//     }
//     //
//     try {
//       // Validate Constraint
//       L.info(`create ${model} with id ${notification.ID}`);
//       const createdNotification = prisma.notifications.create({
//         data: {},
//       });
//       return Promise.resolve(createdNotification);
//     } catch (error) {
//       L.error(`create ${model} failed: ${error}`);
//       return Promise.resolve({
//         error: ExceptionMessage.INVALID,
//         message: ExceptionMessage.BAD_REQUEST,
//       });
//     }
//   }
//   // Delete
//   delete(id: number): Promise<any> {
//     try {
//       L.info(`delete ${model} with id ${id}`);
//       const deletedNotification = prisma.notifications.delete({
//         where: { ID: id },
//       });
//       return Promise.resolve(deletedNotification);
//     } catch (error) {
//       L.error(`delete ${model} failed: ${error}`);
//       return Promise.resolve({
//         error: ExceptionMessage.INVALID,
//         message: ExceptionMessage.BAD_REQUEST,
//       });
//     }
//   }
//   // Update
//   update(id: number, notification: Notification): Promise<any> {
//     // Validate
//     if (!this.validateConstraints(notification)) {
//       return Promise.resolve({
//         error: ExceptionMessage.INVALID,
//         message: ExceptionMessage.BAD_REQUEST,
//       });
//     }
//     try {
//       L.info(`update ${model} with id ${notification.ID}`);
//       const updatedNotification = prisma.notifications.update({
//         where: { ID: id },
//         data: {},
//       });
//       return Promise.resolve(updatedNotification);
//     } catch (error) {
//       L.error(`update ${model} failed: ${error}`);
//       return Promise.resolve({
//         error: ExceptionMessage.INVALID,
//         message: ExceptionMessage.BAD_REQUEST,
//       });
//     }
//   }
//   private validateConstraints(notification: Notification): boolean {
//     return true;
//   }
// }

// export default new NotificationService();
