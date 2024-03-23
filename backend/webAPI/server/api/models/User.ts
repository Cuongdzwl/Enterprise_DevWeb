import { Faculty } from "./Faculty";
import { Role } from "./Role";
export class User {
    ID: number;
    Name: string;
    Password: string;
    Salt: string;
    Email: string;
    Phone?: string; 
    Address?: string; 
    CreatedAt: Date;
    UpdatedAt: Date;
    RoleID: number;
    FacultyID: number;

    Role?: Role;
    Faculty?: Faculty;
    static Email: string;

    constructor(ID: number, Name: string, Password: string, Salt: string, Email: string, CreatedAt: Date, UpdatedAt: Date, RoleID: number, FacultyID: number) {
        this.ID = ID;
        this.Name = Name;
        this.Password = Password;
        this.Salt = Salt;
        this.Email = Email;
        this.CreatedAt = CreatedAt;
        this.UpdatedAt = UpdatedAt;
        this.RoleID = RoleID;
        this.FacultyID = FacultyID;
    }

    
}
