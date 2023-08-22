import { NextFunction, Request, Response, Router } from "express";
import RedeemService from "../service/redeem.service";
import ResponseBody from "../utils/response.body";
import { StatusMessages } from "../utils/status.message.enum";
import { StatusCodes } from "../utils/status.code.enum";
import Logger from "../logger/logger.singleton";
import CreateRequestDto from "../dto/create.request.dto";
import PatchCommentDto from "../dto/patch-comment-dto";
import authenticate from "../middleware/authenticate.middleware";
import validateMiddleware from "../middleware/validate.middleware";
import RequestWithLogger from "../utils/request.logger";

class RedeemController {
    router: Router;

    constructor(private redeemService: RedeemService) {
        this.router = Router();

        this.router.post(
            "/",
            authenticate,
            validateMiddleware(CreateRequestDto),
            this.createRequest
        );
        this.router.get("/", this.getAllRequests);
        this.router.get("/:id", this.getRequestById);
        this.router.patch(
            "/:id",
            authenticate,
            validateMiddleware(PatchCommentDto, {
                skipMissingProperties: true,
            }),
            this.patchRequest
        );
        this.router.delete("/:id", authenticate, this.removeRequest);
    }

    createRequest = async (
        req: RequestWithLogger,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const redeemRequest = await this.redeemService.createRequest(
                req.dto,
                req.userId
            );
            const responseBody = new ResponseBody(
                redeemRequest,
                null,
                StatusMessages.CREATED
            );
            responseBody.set_meta(1);
            res.status(StatusCodes.CREATED).send(responseBody);
            Logger.getLogger().log({
                level: "info",
                message: `Redeem Request Created (${redeemRequest.id})`,
                label: req.req_id,
            });
        } catch (err) {
            next(err);
        }
    };

    getAllRequests = async (req: Request, res: Response) => {
        const requests = await this.redeemService.getAllRequests();
        const responseBody = new ResponseBody(
            requests,
            null,
            StatusMessages.OK
        );
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
            const request = await this.redeemService.getRequestById(requestId);
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

    patchRequest = async (
        req: RequestWithLogger,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const redeemRequestId = req.params.id;
            const redeemRequest = await this.redeemService.patchRequest(
                redeemRequestId,
                req.dto,
                req.userId
            );
            const responseBody = new ResponseBody(
                redeemRequest,
                null,
                StatusMessages.OK
            );
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (err) {
            next(err);
        }
    };

    removeRequest = async (
        req: RequestWithLogger,
        res: Response,
        next: NextFunction
    ) => {
        const redeeemRequestId = req.params.id;
        try {
            const redeeemRequest = await this.redeemService.removeRequest(
                redeeemRequestId
            );
            Logger.getLogger().log({
                level: "info",
                message: `Redeeem Request Deleted (${redeeemRequest})`,
                label: req.req_id,
            });
            res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };
}

export default RedeemController;
