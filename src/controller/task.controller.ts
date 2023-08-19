import { Request, Response, Router } from "express";
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

        this.router.post("/",authenticate,validateMiddleware(CreateTaskDto),this.createTask);
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
}

export default TaskController;
