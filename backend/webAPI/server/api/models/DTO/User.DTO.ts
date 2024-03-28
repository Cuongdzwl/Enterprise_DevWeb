import { Faculty } from '../Faculty';
import { Role } from '../Role';
import { User } from '../User';
import { IDTO } from './DTO';

export class UserDTO implements IDTO<User, UserDTO> {
  ID: number | undefined | null;
  Name?: string | undefined | null;
  Email?: string | undefined | null;
  Phone?: string | undefined | null ;
  NewPhone?: string | undefined | null ;
  Address?: string| undefined | null;
  RoleID?: number | undefined | null ;
  FacultyID?: number | undefined | null;

  Role?: Role;
  Faculty?: Faculty;

  constructor() {}
  public map(user: User): UserDTO {
    this.ID = user.ID;
    this.Name = user.Name;
    this.Email = user.Email;
    this.Phone = user.Phone;
    this.NewPhone = user.NewPhone;
    this.Address = user.Address;
    this.RoleID = user.RoleID;
    this.FacultyID = user.FacultyID;
    this.Role = user.Role;
    this.Faculty = user.Faculty;
  
    return this;
  }
}
