import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import jwtPayload from "../utils/jwt.payload.type";
import RequestWithLogger from "../utils/request.logger";
import Logger from "../logger/logger.singleton";

const authenticate = async(req: RequestWithLogger, res: Response, next: NextFunction) => {
    try{
        const token = getTokenFromRequestHeader(req);
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY) as jwtPayload;
        req.name = payload.name;
        req.email = payload.email;
        req.role = payload.role;
        req.userId = payload.id;
        Logger.getLogger().log({ level: 'info', message: `${req.email} Logged In`, label: req.req_id});
        next();
    }catch(err){
        next(err);
    }
}


const getTokenFromRequestHeader = (req: Request) => {
    const bearerToken = req.header("Authorization");
    const token = bearerToken ? bearerToken.replace("Bearer ", "") : "";
    return token;
}

export default authenticate;