import { User } from "./User";

export class Faculty {
    ID?: number;
    Name: string;
    Description: string;
    IsEnabledGuest: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;

    constructor(ID: number, Name: string, Description: string, IsEnabledGuest: boolean, CreatedAt: Date, UpdatedAt: Date, ManagerID: number) {
        this.ID = ID;
        this.Name = Name;
        this.Description = Description;
        this.IsEnabledGuest = IsEnabledGuest;
        this.CreatedAt = CreatedAt;
        this.UpdatedAt = UpdatedAt;

    }
}
