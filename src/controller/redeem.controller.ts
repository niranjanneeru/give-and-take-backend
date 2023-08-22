import { NextFunction, Request, Response, Router } from "express";
import RedeemService from "../service/redeem.service";
import ResponseBody from "../utils/response.body";
import { StatusMessages } from "../utils/status.message.enum";
import { StatusCodes } from "../utils/status.code.enum";

class RedeemController{
    router: Router;

    constructor(
        private redeemService: RedeemService
    ){
        this.router = Router();

        this.router.get('/', this.getAllRequests);
        this.router.get('/:id', this.getRequestById);

    }

    getAllRequests = async (req: Request, res: Response) => {
        const requests = await this.redeemService.getAllRequests();
        const responseBody = new ResponseBody(requests, null, StatusMessages.OK);
        responseBody.set_meta(requests.length);
        res.status(StatusCodes.OK).send(responseBody);
    };

    getRequestById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const requestId = req.params.id;
            const request = await this.redeemService.getRequestById(
                requestId
            );
            const responseBody = new ResponseBody(
                request,
                null,
                StatusMessages.OK
            );
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (error) {
            next(error);
        }
    };

}

export default RedeemController;