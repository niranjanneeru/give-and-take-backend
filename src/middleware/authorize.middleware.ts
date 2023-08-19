import { NextFunction, Request, Response } from "express";
import RequestWithUser from "../utils/request.user";
import HttpException from "../exception/http.exception";
import { StatusCodes } from "../utils/status.code.enum";
import { roleService } from "../route/role.route";

const authorize = function (...permissions: string[]) {
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const role_name = req.role;
            if(!role_name){
                throw new HttpException(StatusCodes.FORBIDDEN, "Forbidden Action");
            }

            const role = await roleService.getRoleByName(role_name);
            if(!role){
                throw new HttpException(StatusCodes.FORBIDDEN, "Forbidden Action");
            }

            const role_permissions = role.permissions.map((permission) => permission.name)

            permissions.map((permission) => {
                if(role_permissions.indexOf(permission) === -1){
                    throw new HttpException(StatusCodes.FORBIDDEN, "Forbidden Action");   
                }
            })
            next();
        } catch (err) {
            next(err);
        }
    }
}


const getTokenFromRequestHeader = (req: Request) => {
    const bearerToken = req.header("Authorization");
    const token = bearerToken ? bearerToken.replace("Bearer ", "") : "";
    return token;
}

export default authorize;