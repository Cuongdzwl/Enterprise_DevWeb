import { NotificationSentType } from "./NotificationSentType";

export class Notification {
    ID: number;
    EventID?: number;
    SentTo: number;
    SentAt: Date;
    NotificationSentTypeID: number;
    TransactionID?: string;
    Acknowledged?: boolean ;
    Status?: string ;
    IsCancelled: boolean;
    
    NotificationSentType?: NotificationSentType ;
    Event?: Event ;

    constructor(ID: number, EventID: number, SentTo: number, SentAt: Date, NotificationSentTypeID: number, TransactionID: string, Acknowledged: boolean, Status: string, IsCancelled: boolean) {
        this.ID = ID;
        this.EventID = EventID;
        this.SentTo = SentTo;
        this.SentAt = SentAt;
        this.NotificationSentTypeID = NotificationSentTypeID;
        this.TransactionID = TransactionID;
        this.Acknowledged = Acknowledged;
        this.Status = Status;
        this.IsCancelled = IsCancelled;
    }

}
