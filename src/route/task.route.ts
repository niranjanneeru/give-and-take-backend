import dataSource from "../db/postgres.db";
import Task from "../entity/task.entity";
import TaskRepository from "../repository/tasks.repository";
import TaskService from "../service/task.service";
import TaskController from "../controller/task.controller";

const taskRoute = new TaskController(
    new TaskService(new TaskRepository(dataSource.getRepository(Task)))
).router;

export default taskRoute;
