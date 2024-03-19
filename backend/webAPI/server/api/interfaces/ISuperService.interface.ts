import { Filter } from "../common/filter";

export interface ISuperService<T> {
    all(): any;
    create(data: T): any;
    filter(filter: Filter, key: string): any;
    update(id: number, data: T): any;
    delete(id: number): any;
    byId(id: number): any;
}