import { User } from "./User";
import { Event } from "./Event";


export class Contribution {
    ID?: number;
    Name: string;
    Content: string;
    IsPublic: boolean;
    IsApproved: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
    EventID: number;
    UserID: number;
    StatusID: number;
    
    User?: User;
    Event?: Event ;


    constructor(ID: number, Name: string, Content: string, isPublic: boolean, isApproved: boolean, CreatedAt: Date, UpdatedAt: Date, EventID: number, UserID: number, StatusID: number) {
        this.ID = ID;
        this.Name = Name;
        this.Content = Content;
        this.IsPublic = isPublic;
        this.IsApproved = isApproved;
        this.CreatedAt = CreatedAt;
        this.UpdatedAt = UpdatedAt;
        this.EventID = EventID;
        this.UserID = UserID;
        this.StatusID = StatusID;
    }
}
