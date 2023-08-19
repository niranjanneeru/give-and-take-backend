import { NextFunction, Request, Response, Router } from "express";
import TaskService from "../service/task.service";
import validateMiddleware from "../middleware/validate.middleware";
import CreateTaskDto from "../dto/create-task.dto";
import RequestWithLogger from "../utils/request.logger";
import { StatusMessages } from "../utils/status.message.enum";
import ResponseBody from "../utils/response.body";
import { StatusCodes } from "../utils/status.code.enum";
import Logger from "../logger/logger.singleton";
import authenticate from "../middleware/authenticate.middleware";



class TaskController {
    public router: Router;

    constructor(private taskService: TaskService) {
        this.router = Router();
        this.router.get("/", authenticate, this.getAllTasks);
        this.router.get("/:id", authenticate, this.getTaskById);
        this.router.post("/",authenticate,validateMiddleware(CreateTaskDto),this.createTask);
        this.router.delete("/:id", authenticate, this.removeTask);
    }

    createTask = async (req: RequestWithLogger, res: Response, next) => {
        try {
            const task = await this.taskService.createTask(req.dto,req.email);
            const responseBody = new ResponseBody(task, null, StatusMessages.CREATED);
            responseBody.set_meta(1);
            res.status(StatusCodes.CREATED).send(responseBody);
            Logger.getLogger().log({ level: 'info', message: `Task Created (${task.id})`, label: req.req_id });
        } catch (err) {
            next(err);
        }
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
            const responseBody = new ResponseBody(task, null, StatusMessages.OK);
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (error) {
            next(error);
        }
    };

    removeTask = async (
        req: RequestWithLogger,
        res: Response,
        next: NextFunction
    ) => {
        const taskId = req.params.id;
        try {
            const task = await this.taskService.removeTask(taskId);
            Logger.getLogger().log({
                level: "info",
                message: `Task Deleted (${taskId})`,
                label: req.req_id,
            });
            res.status(StatusCodes.NO_CONTENT).send();
        } catch (err) {
            next(err);
        }
    };
}

export default TaskController;
