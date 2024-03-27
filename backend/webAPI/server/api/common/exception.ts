export class ExceptionMessage{
    public static readonly INVALID : string = "Invalid";
    public static readonly NOT_FOUND : string = "Not Found";
    public static readonly USER_NOT_FOUND : string = "User Not Found";
    public static readonly BAD_REQUEST : string = "Bad Request";
    public static readonly UNKNOWN : string = "Internal Server Error";

}

export class UserExceptionMessage extends ExceptionMessage{
    public static readonly INVALID_ROLEID: string = "Invalid Role ID";
    public static readonly INVALID_FACULTYID: string = "Invalid Faculty ID";
}

export class FacultyExceptionMessage extends ExceptionMessage{
    public static readonly INCORRECT_PASSWORD: string = "Password incorrect";
}
export class EventExceptionMessage extends ExceptionMessage{
    public static readonly INVALID_FACULTYID: string = "Invalid Faculty ID";
}

export class FileExceptionMessage extends ExceptionMessage{
    public static readonly INVALID_CONTRIBUTIONID: string = "Invalid Contribution ID";
}

export class ContributionExceptionMessage extends ExceptionMessage{
    public static readonly INVALID_EVENTID: string = "Invalid Event ID";
    public static readonly INVALID_USERID: string = "Invalid User ID";
    public static readonly INVALID_LASTEDITBYID: string = "Invalid Last Edit By ID";
    public static readonly INVALID_STATUSID: string = "Invalid Status ID";
}

export class NotificationExceptionMessage extends ExceptionMessage{
    public static readonly INVALID_NOTIFICATIONID: string = "Invalid Type Notification ID";
}

export class RoleExceptionMessage extends ExceptionMessage{
}

export class CommentExceptionMessage extends ExceptionMessage{
    public static readonly INVALID_CONTRIBUTIONID: string = "Invalid Contribution ID";
    public static readonly INVALID_USERID: string = "Invalid User ID";
}

export class AuthExceptionMessage extends ExceptionMessage{
    public static readonly INVALID_EMAIL: string = "Invalid Email";
    public static readonly INVALID_PASSWORD: string = "Invalid Password";
    public static readonly INVALID_TOKEN: string = "Invalid Token";
    public static readonly INVALID_OTP: string = "Invalid OTP";
    public static readonly INVALID_OTP_EXPIRED: string = "OTP has expired";
    public static readonly INVALID_OTP_USED: string = "OTP has already been used";
}


