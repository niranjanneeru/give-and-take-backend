import dataSource from "../db/postgres.db";
import Task from "../entity/task.entity";
import TaskRepository from "../repository/task.repository";
import TaskService from "../service/task.service";
import TaskController from "../controller/task.controller";
import { employeeService } from "./employee.route";

const taskRepository = new TaskRepository(dataSource.getRepository(Task));
export const taskService = new TaskService(taskRepository, employeeService);
const taskController = new TaskController(taskService);
const taskRoute = taskController.router;


export default taskRoute;
