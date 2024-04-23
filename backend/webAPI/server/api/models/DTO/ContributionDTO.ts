import { Comment } from "../Comment";
import { File } from "../File";
import { User } from "../User";

export class ContributionDTO {
    ID?: number;
    Name?: string;
    Content?: string;
    IsPublic?: boolean;
    IsApproved?: boolean;
    CreatedAt?: Date;
    UpdatedAt?: Date;
    EventID?: number;
    UserID?: number;
    StatusID?: number;
    LastEditByID?: number;
    
    User?: User;
    Event?: Event ;
    File? : File[];
    Comment?: Comment[]
}