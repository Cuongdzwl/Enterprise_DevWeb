
export interface ISuperService<T> {
    all(): any;
    create(data: T): any;
    filter(filter: string, key: string): any;
    update(id: number, data: T): any;
    delete(id: number): any;
    byId(id: number): any;
    validateConstraints(req : Request,res : Response):any;
}