import { Contribution } from "./Contribution";
import { User } from "./User";

export class File {
    ID?: number;
    Path: string;
    Url: string;
    CreatedAt?: Date;
    UpdatedAt?: Date;
    ContributionID: number;

    Contribution?:Contribution;

    constructor(ID: number, Url: string, CreatedAt: Date, UpdatedAt: Date, ContributionID: number, Path: string) {
        this.ID = ID;
        this.Url = Url;
        this.Path = Path;
        this.CreatedAt = CreatedAt;
        this.UpdatedAt = UpdatedAt;
        this.ContributionID = ContributionID;
    }
}
