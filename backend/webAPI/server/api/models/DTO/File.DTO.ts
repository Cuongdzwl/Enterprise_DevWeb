import { Contribution } from "../Contribution";

export class FileDTO {
    ID?: number;
    Url?: string;
    CreatedAt: Date | null;
    UpdatedAt: Date | null;
    ContributionID: number;
    Contribution?: Contribution;
    Content?: string; // Optional to match the second data structure
    UserID?: number;  // Optional to match the second data structure

    constructor({ ID, Url, CreatedAt, UpdatedAt, ContributionID, Content, UserID }: {
        ID?: number, 
        Url: string, 
        CreatedAt: Date | null, 
        UpdatedAt: Date | null, 
        ContributionID: number,
        Content?: string, 
        UserID?: number
    }) {
        this.ID = ID;
        this.Url = Url;
        this.CreatedAt = CreatedAt;
        this.UpdatedAt = UpdatedAt;
        this.ContributionID = ContributionID;
        this.Content = Content;
        this.UserID = UserID;
    }
}
