import { Faculty } from '../Faculty';
import { Role } from '../Role';
import { User } from '../User';
import { IDTO } from './DTO';

export class UserDTO implements IDTO<User, UserDTO> {
  ID: number;
  Name: string;
  Email: string;
  Phone?: string;
  Address?: string;
  RoleID: number;
  FacultyID: number;

  Role?: Role;
  Faculty?: Faculty;

  constructor() {}
  public map(user: User): UserDTO {
    this.ID = user.ID;
    this.Name = user.Name;
    this.Email = user.Email;
    this.Phone = user.Phone;
    this.Address = user.Address;
    this.RoleID = user.RoleID;
    this.FacultyID = user.FacultyID;
    return this;
  }
}
