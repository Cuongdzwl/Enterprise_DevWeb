export interface IAuthController{
    login(req : Request,res : Response):void
    logout(req : Request,res : Response):void
    user(req: Request,res: Response):void
}