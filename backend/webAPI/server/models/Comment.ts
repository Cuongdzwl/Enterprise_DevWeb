import { Contribution } from "./Contribution";
import { User } from "./User";

export class Comment {
    ID?: number;
    Content: string;
    CreatedAt?: Date;
    UpdatedAt?: Date ;
    ContributionID: number;
    UserID: number;

    User?: User;
    Contribution: Contribution;

    constructor(ID: number, Content: string, ContributionID: number, UserID: number) {
        this.ID = ID;
        this.Content = Content;
        this.ContributionID = ContributionID;
        this.UserID = UserID;
    }
}