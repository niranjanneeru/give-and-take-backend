import Comment from "../entity/comment.entity";
import HttpException from "../exception/http.exception";
import CommentRepository from "../repository/comment.repository";
import { StatusCodes } from "../utils/status.code.enum";

export default class CommentService {
    constructor(private commentRepository: CommentRepository) {}

    getAllComments() {
        return this.commentRepository.getAllComments();
    }

    async getCommentById(id: number) {
        const taskcomment = await this.commentRepository.getCommentById(id);
        if (!taskcomment) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                `Comment with id ${id} not found`
            );
        }
        return taskcomment;
    }

    removeComment = async (id: number): Promise<Comment | null> => {
        const comment = await this.commentRepository.getCommentById(id);
        if (!comment) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                `Comment with id ${id} not found`
            );
        }
        return this.commentRepository.removeComment(comment);
    };
}
