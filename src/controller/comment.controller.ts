import { NextFunction, Request, Response, Router } from "express";
import CommentService from "../service/comment.service";
import { StatusMessages } from "../utils/status.message.enum";
import ResponseBody from "../utils/response.body";
import { StatusCodes } from "../utils/status.code.enum";

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
}
