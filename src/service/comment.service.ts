import CreateCommentDto from "../dto/create-comment.dto";
import PatchCommentDto from "../dto/patch-comment-dto";
import Comment from "../entity/comment.entity";
import HttpException from "../exception/http.exception";
import CommentRepository from "../repository/comment.repository";
import { StatusCodes } from "../utils/status.code.enum";
import EmployeeService from "./employee.service";
import TaskService from "./task.service";

export default class CommentService {
    constructor(
        private commentRepository: CommentRepository,
        private employeeService: EmployeeService,
        private taskService: TaskService
    ) {}

    getAllComments = async () => {
        return await this.commentRepository.getAllComments();
    };

    getCommentById = async (id: number) => {
        const comment = await this.commentRepository.getCommentById(id);
        if (!comment) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                `Comment with id ${id} not found`
            );
        }
        return comment;
    };

    createComment = async (
        createCommentDto: CreateCommentDto,
        email: string,
        taskId: string
    ) => {
        const comment = new Comment();

        comment.comment = createCommentDto.comment;
        comment.url = createCommentDto.url;

        const employee = await this.employeeService.getEmployeeByEmail(email);
        comment.postedBy = employee;

        const task = await this.taskService.getTaskById(taskId);
        comment.task = task;

        return this.commentRepository.createComment(comment);
    };

    patchComment = async (
        id: string,
        patchCommentDto: PatchCommentDto
    ): Promise<Comment | null> => {
        const comment = await this.commentRepository.getCommentById(+id);
        if (!comment)
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                `Comment with id ${id} not found`
            );
        let keys = Object.getOwnPropertyNames(patchCommentDto);
        for (const key of keys) {
            comment[key] = patchCommentDto[key];
        }

        return this.commentRepository.patchComment(comment);
    };

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
