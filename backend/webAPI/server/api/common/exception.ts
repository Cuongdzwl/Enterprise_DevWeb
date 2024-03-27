export class ExceptionMessage{
    public static readonly INVALID : string = "Invalid";
    public static readonly NOT_FOUND : string = "Not Found";
    public static readonly BAD_REQUEST : string = "Bad Request";
    public static readonly UNKNOWN : string = "Internal Server Error";
}

export class UserExceptionMessage extends ExceptionMessage{
    public static readonly INVALID_ROLEID: string = "Invalid Role ID";
    public static readonly INVALID_FACULTYID: string = "Invalid Faculty ID";
    public static readonly ROLE_ALREADY_ASSIGNED_IN_FACULTY: string = "Faculty have only one user with role Marketing Coordinator"
    public static readonly ROLE_ALREADY_ASSIGNED_IN_SEVER: string = "Server have only one user with role Marketing Manager"
    public static readonly  EMAIL_EXISTED: string = "Email already exists"
   
    
}

export class FacultyExceptionMessage extends ExceptionMessage{
    public static readonly INCORRECT_PASSWORD: string = "Password incorrect";
    public static readonly INVALID_FACULTYID: string = "Invalid Faculty ID";
    public static readonly FACULTY_NAME_EXISTED: string = "This name already exists";
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


