import { Notification } from 'server/models/Notification';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client'
import { Filter } from 'server/models/common/Filter';

const prisma = new PrismaClient()
const model = 'notification';

export class NotificationService {
    all(): Promise<any> {
        const notifications = prisma.notifications.findMany();
        L.info(notifications, `fetch all ${model}(s)`);
        return Promise.resolve(notifications);
    }

    byId(id: number): Promise<any> {
        L.info(`fetch ${model} with id ${id}`);
        const notification = prisma.notifications.findUnique({
            where: { ID: id },
        });
        return Promise.resolve(notification);
    }

    filter(filter: Filter): Promise<any> {
        L.info(`fetch ${model}(s) with filter`, filter);
        const notifications = prisma.notifications.findMany({
            where: {
                // TODO: Apply filter conditions
            },
        });
        return Promise.resolve(notifications);
    }

    // create(notification: Notification): Promise<any> {
    //     L.info(`create ${model} with id ${notification.ID}`);
    //     const createdNotification = prisma.notifications.create({
    //         // TODO: FIX THIS
    //         data: {
    //             ID: notification.ID,
    //             Content: notification.Content,
    //             NotificationSentType: 1,
    //             SentAt: notification.SentAt,
    //             SentTo: notification.SentTo,
    //         },
    //     });
    //     return Promise.resolve(createdNotification);
    // }

    delete(id: number): Promise<any> {
        L.info(`delete ${model} with id ${id}`);
        const deletedNotification = prisma.notifications.delete({
            where: { ID: id },
        });
        return Promise.resolve(deletedNotification);
    }

    // update(notification: Notification): Promise<any> {
    //     L.info(`update ${model} with id ${notification.ID}`);
    //     const updatedNotification = prisma.notifications.update({
    //         where: { ID: notification.ID },
    //         data: notification,
    //     });
    //     return Promise.resolve(updatedNotification);
    // }
}

export default new NotificationService();
