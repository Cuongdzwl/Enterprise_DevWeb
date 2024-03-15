import { Contribution } from "./Contribution";
import { User } from "./User";

export class Comment {
    ID?: number;
    Content: string;
    CreatedAt: Date;
    UpdatedAt: Date ;
    ContributionID: number;
    UserID: number;

    User?: User;
    Contribution?: Contribution;

    constructor(ID: number, ContributionID: number, UserID: number, Content: string, CreatedAt: Date, UpdatedAt: Date) {
        this.ID = ID;
        this.Content = Content;
        this.ContributionID = ContributionID;
        this.UserID = UserID;
        this.CreatedAt = CreatedAt;
        this.UpdatedAt = UpdatedAt;
    }

}