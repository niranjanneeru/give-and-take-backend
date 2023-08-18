import { NextFunction, Request, Response } from "express";
import loggerFactory from "../logger/logger.config";
import winston  from "winston";
import { v4 as uuidv4 } from 'uuid';
import RequestWithLogger from "../utils/request.logger";
import Logger from "../logger/logger.singleton";

const loggerMiddleware = (req: RequestWithLogger, res: Response, next: NextFunction) => {
    let logger = loggerFactory("debug", [new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.label({ label: "Route Logger" }),
            winston.format.timestamp(),
            Logger.routeLoggerFormat
        )
    })]);
    logger.debug(`${req.method} - ${req.url}`);
    const req_id = uuidv4();
    logger = Logger.getLogger()
    logger.info({message: `${req.method} - ${req.url}`, label : req_id});
    req.req_id = req_id;
    next();
};

export default loggerMiddleware;