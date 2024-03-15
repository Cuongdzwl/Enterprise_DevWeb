export class Role {
    ID?: number;
    Name: String;
    Description: String;

    constructor(ID: number, Name: String, Description: String) {
        this.ID = ID;
        this.Name = Name;
        this.Description = Description;
    }
}
