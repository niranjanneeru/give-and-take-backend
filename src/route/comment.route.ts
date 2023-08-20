import Comment from "../entity/comment.entity";
import dataSource from "../db/postgres.db";
import CommentRepository from "../repository/comment.repository";
import CommentService from "../service/comment.service";
import CommentController from "../controller/comment.controller";
import { employeeService } from "./employee.route";
import { taskService } from "./task.route";
const commentRepository = new CommentRepository(
    dataSource.getRepository(Comment)
);
const commentService = new CommentService(
    commentRepository,
    employeeService,
    taskService
);
const commentRoute = new CommentController(commentService).router;

export default commentRoute;
