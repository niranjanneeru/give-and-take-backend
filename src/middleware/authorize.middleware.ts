import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import RequestWithUser from "../utils/request.user";
import { Role } from "../utils/role.enum";
import HttpException from "../exception/http.exception";
import { StatusCodes } from "../utils/status.code.enum";

const authorize = function (...roles: Role[]) {
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const role = req.role;
            if (roles.indexOf(role) === -1) {
                throw new HttpException(StatusCodes.FORBIDDEN, "Forbidden Action");
            }
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