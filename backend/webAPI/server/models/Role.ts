export class Role {
    ID?: number;
    Name: string;
    Description: string;

    constructor(ID: number, Name: string, Description: string) {
        this.ID = ID;
        this.Name = Name;
        this.Description = Description;
    }
}
