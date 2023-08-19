import { NextFunction, Request, Response, Router } from "express";
import TaskService from "../service/task.service";
import authenticate from "../middleware/authenticate.middleware";
import ResponseBody from "../utils/response.body";
import { StatusMessages } from "../utils/status.message.enum";
import { StatusCodes } from "../utils/status.code.enum";
import RequestWithLogger from "../utils/request.logger";
import Logger from "../logger/logger.singleton";


class TaskController {
    public router: Router;

    constructor(private taskService: TaskService) {
        this.router = Router();

        this.router.get("/", authenticate, this.getAllTasks);
        this.router.get("/:id", authenticate, this.getTaskById);
        this.router.delete("/:id", authenticate, this.removeTask);
    }

    getAllTasks = async (req: Request, res: Response) => {
        const tasks = await this.taskService.getTasks();
        const responseBody = new ResponseBody(tasks, null, StatusMessages.OK);
        responseBody.set_meta(tasks.length);
        res.status(StatusCodes.OK).send(responseBody);
    };

    getTaskById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const task = await this.taskService.getTaskById(id);
            const responseBody = new ResponseBody(
                task,
                null,
                StatusMessages.OK
            );
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
