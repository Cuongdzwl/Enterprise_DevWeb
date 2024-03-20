import { User } from "./User";

export class Role {
    ID?: number;
    Name: string;
    Description?: string;

    User?: User[];
    constructor(ID: number, Name: string, Description?: string) {
        this.ID = ID;
        this.Name = Name;
        this.Description = Description;
    }
}
