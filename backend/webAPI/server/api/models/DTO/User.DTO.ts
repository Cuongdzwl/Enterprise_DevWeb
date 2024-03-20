import { Faculty } from "../Faculty";
import { Role } from "../Role";

export default class UserDTO{
    ID: number;
    Name: string;
    Email: string;
    Phone?: string; 
    Address?: string; 
    RoleID: number;
    FacultyID: number;

    Role?: Role;
    Faculty?: Faculty;
}