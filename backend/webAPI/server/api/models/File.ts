import { Contribution } from "./Contribution";
import { User } from "./User";

export class File {
    ID?: number;
    Url: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    ContributionID: number;

    Contribution?:Contribution;

    constructor(ID: number, Url: string, CreatedAt: Date, UpdatedAt: Date, ContributionID: number) {
        this.ID = ID;
        this.Url = Url;
        this.CreatedAt = CreatedAt;
        this.UpdatedAt = UpdatedAt;
        this.ContributionID = ContributionID;
    }
}