import { Request, Response, Router } from "express";
import RoleService from "../service/role.service";
import ResponseBody from "../utils/response.body";
import { StatusMessages } from "../utils/status.message.enum";
import { StatusCodes } from "../utils/status.code.enum";
import authorize from "../middleware/authorize.middleware";
import Permission from "../entity/permission.entity";

class RoleController{
    public router: Router;
    constructor(
        private roleService : RoleService
    ){
        this.router = Router();
        this.router.get("/",this.getAllRoles);
    }

    getAllRoles = async (req: Request, res: Response) => {
        const roles =  await this.roleService.getRoles();
        const responseBody = new ResponseBody(roles, null, StatusMessages.OK);
        responseBody.set_meta(roles.length);
        res.status(StatusCodes.OK).send(responseBody);
    }
}

export default RoleController;