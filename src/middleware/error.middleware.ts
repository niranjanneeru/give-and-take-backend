import { NextFunction, Request, Response } from "express";
import HttpException from "../exception/http.exception";
import ValidationException from "../exception/validation.exception";
import { JsonWebTokenError } from "jsonwebtoken";
import ResponseBody from "../utils/response.body";
import { StatusMessages } from "../utils/status.message.enum";
import RequestWithLogger from "../utils/request.logger";
import { StatusCodes } from "../utils/status.code.enum";
import Logger from "../logger/logger.singleton";

const errorMiddleware = (error: Error, req: RequestWithLogger, res: Response, next: NextFunction) => {
    console.log(error);
    try {
        if (error instanceof ValidationException) {
            const responseBody = new ResponseBody(null, error.getMessage(), error.message);
            responseBody.set_meta(0);
            res.status(StatusCodes.BAD_REQUEST).send(responseBody);
            return;
        }
        if (error instanceof HttpException) {
            const responseBody = new ResponseBody(null, error.message as unknown as object, error.message);
            responseBody.set_meta(0);
            res.status(error.status).send(responseBody);
            Logger.getLogger().log({ level: 'info', message: error.message, label: req.req_id});
            return;
        }
        if (error instanceof JsonWebTokenError) {
            Logger.getLogger().log({ level: 'info', message: error.message, label: req.req_id});
            const responseBody = new ResponseBody(null, StatusMessages.FORBIDDEN as unknown as object, StatusMessages.FORBIDDEN);
            responseBody.set_meta(0);
            res.status(StatusCodes.FORBIDDEN).send(responseBody);
            return;
        }
        Logger.getLogger().log({ level: 'error', message: error.message, label: req.req_id});
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;