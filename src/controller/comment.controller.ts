import { NextFunction, Request, Response, Router } from "express";
import CommentService from "../service/comment.service";
import { StatusMessages } from "../utils/status.message.enum";
import ResponseBody from "../utils/response.body";
import { StatusCodes } from "../utils/status.code.enum";
import RequestWithLogger from "../utils/request.logger";
import Logger from "../logger/logger.singleton";

export default class CommentController {
    public router: Router;

    constructor(private commentService: CommentService) {}

    getAllComments = async (req: Request, res: Response) => {
        const taskcomments = await this.commentService.getAllComments();
        const responseBody = new ResponseBody(
            taskcomments,
            null,
            StatusMessages.OK
        );
        responseBody.set_meta(taskcomments.length);
        res.status(StatusCodes.OK).send(responseBody);
    };

    getCommentById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const taskCommentId = req.params.id;
            const taskComment = await this.commentService.getCommentById(
                +taskCommentId
            );
            const responseBody = new ResponseBody(
                taskComment,
                null,
                StatusMessages.OK
            );
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (error) {
            next(error);
        }
    };

    removeComment = async (
        req: RequestWithLogger,
        res: Response,
        next: NextFunction
    ) => {
        const commentId = +req.params.id;
        try {
            const comment = await this.commentService.removeComment(commentId);
            Logger.getLogger().log({
                level: "info",
                message: `Comment Deleted (${commentId})`,
                label: req.req_id,
            });
            res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };
}
