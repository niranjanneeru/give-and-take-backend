import { Repository } from "typeorm";

export default class CommentRepository{
    constructor(
        private repository: Repository<Comment>
    ){}
}