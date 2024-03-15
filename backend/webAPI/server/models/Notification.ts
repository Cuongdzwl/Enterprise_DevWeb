import { NotificationSentType } from "./NotificationSentType";

export class Notification {
    ID?: number;
    Content: String;
    NotificationSentType: number;
    SentAt: Date;
    SentTo: number;

    constructor(ID: number, Content: String, NotificationSentType: NotificationSentType, SentAt: Date, SentTo: number) {
        this.ID = ID;
        this.Content = Content;
        this.NotificationSentType = Number(NotificationSentType);
        this.SentAt = SentAt;
        this.SentTo = SentTo;
    }


}
