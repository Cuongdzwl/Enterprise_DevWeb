import {Event} from './Event';

export class File {
    ID?: number;
    Path: string;
    Url: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    EventID: number;
    Event: Event;


    constructor(ID: number, Url: string, CreatedAt: Date, UpdatedAt: Date, EventID: number, Path: string) {
        this.ID = ID;
        this.Url = Url;
        this.Path = Path;
        this.CreatedAt = CreatedAt;
        this.UpdatedAt = UpdatedAt;
        this.EventID = EventID;
    }
}