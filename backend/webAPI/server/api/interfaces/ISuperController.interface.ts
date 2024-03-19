export interface ISuperController{
    all(req : Request,res : Response):void
    update(req : Request,res : Response):void
    create(req : Request,res : Response):void
    delete(req : Request,res : Response):void
    byId(req : Request,res : Response): void
}