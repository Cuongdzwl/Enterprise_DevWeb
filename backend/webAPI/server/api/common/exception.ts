export class ExceptionMessage{
    public static readonly INVALID : string = "Invalid";
    public static readonly NOT_FOUND : string = "Not Found";
    public static readonly BAD_REQUEST : string = "Bad Request";
    public static readonly UNKNOWN : string = "Internal Server Error";
}

export class UserExceptionMessage extends ExceptionMessage{
    public static readonly INVALID_ROLEID: string = "Invalid Role ID";
}

export class FacultyExceptionMessage extends ExceptionMessage{
    public static readonly INCORRECT_PASSWORD: string = "Password incorrect";
}
export class EventExceptionMessage extends ExceptionMessage{
    public static readonly INVALID_FACULTYID: string = "Invalid Faculty ID";
}

export class FileExceptionMessage extends ExceptionMessage{
    public static readonly INVALID_CONTRIBUTIONID: string = "Invalid File ID";
}

export class ContributionExceptionMessage extends ExceptionMessage{
    public static readonly INVALID_EVENTID: string = "Invalid Event ID";
    public static readonly INVALID_USERID: string = "Invalid User ID";
    public static readonly INVALID_LASTEDITBYID: string = "Invalid Last Edit By ID";
    public static readonly INVALID_STATUSID: string = "Invalid Status ID";
}

export class NotificationExceptionMessage extends ExceptionMessage{
    public static readonly INVALID_NOTIFICATIONID: string = "Invalid Notification ID";
}

export class RoleExceptionMessage extends ExceptionMessage{
}

