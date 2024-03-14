import { Contribution } from "./Contribution";
import { User } from "./User";

export class File {
    ID?: number;
    Url: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    isPublic: boolean;
    UserID: number;
    ContributionID: number;

    User?:User;
    Contribution?:Contribution;

    constructor(ID: number, Url: string, CreatedAt: Date, UpdatedAt: Date, isPublic: boolean, UserID: number, ContributionID: number) {
        this.ID = ID;
        this.Url = Url;
        this.CreatedAt = CreatedAt;
        this.UpdatedAt = UpdatedAt;
        this.isPublic = isPublic;
        this.UserID = UserID;
        this.ContributionID = ContributionID;
    }
}
