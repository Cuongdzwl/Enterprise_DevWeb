import { Faculty } from "./Faculty";
import { Contribution } from "./Contribution";

export class Event {
    ID?: number;
    Name: String;
    Description: String;
    ClosureDate: Date;
    FinalDate: Date;
    CreatedAt : Date;
    UpdatedAt : Date; 
    FacultyID: number;

    Faculty?: Faculty
    Contributions?: Contribution[];


    constructor(ID: number, Name: String, Description: String, ClosureDate: Date, FinalDate: Date, CreatedAt: Date, UpdatedAt: Date, FacultyID: number) {
        this.ID = ID;
        this.Name = Name;
        this.Description = Description;
        this.ClosureDate = ClosureDate;
        this.FinalDate = FinalDate;
        this.CreatedAt = CreatedAt;
        this.UpdatedAt = UpdatedAt;
        this.FacultyID = FacultyID;
    }
}
