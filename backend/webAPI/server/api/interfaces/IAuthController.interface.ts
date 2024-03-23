export interface IAuthController{
    login(req : Request,res : Response):void
    logout(req : Request,res : Response):void
    profile(req: Request,res: Response):void
}