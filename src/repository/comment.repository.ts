import { Repository } from "typeorm";
import Comment from "../entity/comment.entity";

export default class CommentRepository {
    constructor(private repository: Repository<Comment>) {}

    getAllComments = (): Promise<Comment[]> => {
        return this.repository.find();
    };

    getCommentById = (id: number): Promise<Comment> => {
        return this.repository.findOne({
            where: { id },
            relations: {
                task: true,
            },
        });
    };

    createComment = (comment: Comment): Promise<Comment> => {
        return this.repository.save(comment);
    };

    removeComment(comment: Comment): Comment | PromiseLike<Comment> {
        return this.repository.softRemove(comment);
    }
}
