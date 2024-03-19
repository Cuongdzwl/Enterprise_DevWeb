import { NotificationSentType } from "./NotificationSentType";

export class Notification {
    ID?: number;
    Content: string;
    NotificationSentType: number;
    SentAt: Date;
    SentTo: number;
    

    constructor(ID: number, Content: string, NotificationSentType: NotificationSentType, SentAt: Date, SentTo: number) {
        this.ID = ID;
        this.Content = Content;
        this.NotificationSentType = Number(NotificationSentType);
        this.SentAt = SentAt;
        this.SentTo = SentTo;
    }


}
