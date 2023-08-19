import { Request, Response, Router } from "express";
import TaskService from "../service/task.service";

class TaskController {
    public router: Router;

    constructor(private taskService: TaskService) {
        this.router = Router();
    }
}

export default TaskController;
