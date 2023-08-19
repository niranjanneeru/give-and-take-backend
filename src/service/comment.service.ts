import CommentRepository from "../repository/comment.repository";

export default class CommentService{
    constructor(
        private commentRepository: CommentRepository
    ){}
}