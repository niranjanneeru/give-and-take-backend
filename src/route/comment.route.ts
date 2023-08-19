import dataSource from "../db/postgres.db";
import Task from "../entity/task.entity";
import TaskRepository from "../repository/task.repository";
import TaskService from "../service/task.service";
import TaskController from "../controller/task.controller";
import CommentRepository from "../repository/comment.repository";
import CommentService from "../service/comment.service";
import CommentController from "../controller/comment.controller";


const commentRepository = new CommentRepository(dataSource.getRepository(Comment));
const commentService = new CommentService(commentRepository);
const commentRoute = new CommentController(commentService).router;

export default commentRoute;
