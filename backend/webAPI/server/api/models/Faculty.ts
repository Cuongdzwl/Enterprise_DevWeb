import { User } from "./User";

export class Faculty {
    ID?: number;
    Name: string;
    Description: string;
    IsEnabledGuest: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;

    Users?: User[];
    Events?: Event[];

    constructor(ID: number, Name: string, Description: string, IsEnabledGuest: boolean, CreatedAt: Date, UpdatedAt: Date) {
        this.ID = ID;
        this.Name = Name;
        this.Description = Description;
        this.IsEnabledGuest = IsEnabledGuest;
        this.CreatedAt = CreatedAt;
        this.UpdatedAt = UpdatedAt;
    }
}
