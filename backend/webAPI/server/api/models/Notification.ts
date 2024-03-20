import { NotificationSentType } from "./NotificationSentType";

export class Notification {
    ID?: number;
    Content: string;
    NotificationSentType: number;
    SentAt: Date;
    SentTo: number;
    FromID: number;
    FromTable: string;
    IsCancelled: boolean;

    constructor({ ID, Content, NotificationSentType, SentAt, SentTo, FromID, FromTable, IsCancelled }: { ID: number; Content: string; NotificationSentType: NotificationSentType; SentAt: Date; SentTo: number; FromID: number; FromTable: string; IsCancelled: boolean; },) {
        this.ID = ID;
        this.Content = Content;
        this.NotificationSentType = Number(NotificationSentType);
        this.SentAt = SentAt;
        this.SentTo = SentTo;
        this.FromID = FromID;
        this.FromTable = FromTable;
        this.IsCancelled = IsCancelled
    }


}
