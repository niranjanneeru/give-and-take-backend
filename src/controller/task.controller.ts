import { NextFunction, Request, Response, Router } from "express";
import TaskService from "../service/task.service";
import authenticate from "../middleware/authenticate.middleware";
import ResponseBody from "../utils/response.body";
import { StatusMessages } from "../utils/status.message.enum";
import { StatusCodes } from "../utils/status.code.enum";

class TaskController {
    public router: Router;

    constructor(private taskService: TaskService) {
        this.router = Router();

        this.router.get("/", authenticate, this.getAllTasks);
        this.router.get("/:id", authenticate, this.getTaskById);
    }

    getAllTasks = async (req: Request, res: Response) => {
        const tasks = await this.taskService.getTasks();
        const responseBody = new ResponseBody(tasks, null, StatusMessages.OK);
        responseBody.set_meta(tasks.length);
        res.status(StatusCodes.OK).send(responseBody);
    }

    getTaskById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const task = await this.taskService.getTaskById(id);
            console.log(task);
            const responseBody = new ResponseBody(task, null, StatusMessages.OK);
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (error) {
            next(error);
        }
    }






}

export default TaskController;
