import { User } from "./User";
import { Event } from "./Event";
import { Status } from "./Status";
import { File } from "./File";
import { Comment } from "./Comment";

export class Contribution {
    ID?: number;
    Name: string;
    Content: string;
    isPublic: boolean;
    isApproved: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
    EventID: number;
    UserID: number;
    StatusID: number;
    
    User?: User ;
    Event?: Event ;
    Status?: Status;
    Comment?: Comment[];
    Files?: File[];


    constructor(ID: number, Name: string, Content: string, isPublic: boolean, isApproved: boolean, CreatedAt: Date, UpdatedAt: Date, EventID: number, UserID: number, StatusID: number) {
        this.ID = ID;
        this.Name = Name;
        this.Content = Content;
        this.isPublic = isPublic;
        this.isApproved = isApproved;
        this.CreatedAt = CreatedAt;
        this.UpdatedAt = UpdatedAt;
        this.EventID = EventID;
        this.UserID = UserID;
        this.StatusID = StatusID;
    }
}
