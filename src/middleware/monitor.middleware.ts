import { NextFunction, Request, Response } from "express";

const monitor = async(req: Request, res: Response, next: NextFunction) => {
    performance.mark('start');
    next();
}

export default monitor;