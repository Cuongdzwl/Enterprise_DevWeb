export class NotificationSentType {
    ID?: number;
    Name: string;
    constructor(ID: number, Name: string) {
        this.ID = ID;
        this.Name = Name;
    }
}


export enum NotificationSentTypeEnum {
  EMAILOTP = "email-otp",
  PHONEOTP = "phone-otp",
  CLOSUREDATE = "closure-date",
  FINALDATE = "final-date",
  EMAILRESETPASSWORD = "password-reset",
  EMAILPASSWORD = 'email-password',
  NEWEVENT = "new-event",
  CONTRIBUTIONINAPPEVENT = "contributions-inapp-event",
  COMMENTONCONTRIBUTION =  "comment-on-contribution",
  NEWCONTRIBUTION = "new-contribution"
  
}