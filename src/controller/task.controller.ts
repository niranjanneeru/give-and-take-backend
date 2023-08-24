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
import SetTaskDto from "../dto/patch-task.dto";
import PatchTaskAssigneesDto from "../dto/patch.task.assignees.dto";

class TaskController {
    public router: Router;

    constructor(private taskService: TaskService) {
        this.router = Router();

        this.router.get("/", authenticate, this.getAllTasks);
        this.router.get("/:id", authenticate, this.getTaskById);
        this.router.post(
            "/",
            authenticate,
            validateMiddleware(CreateTaskDto),
            this.createTask
        );
        this.router.patch(
            "/:id",
            authenticate,
            validateMiddleware(SetTaskDto, { skipMissingProperties: true }),
            this.setTask
        );
        this.router.delete("/:id", authenticate, this.removeTask);

        this.router.patch(
            "/:taskId/assignees/",
            authenticate,
            validateMiddleware(PatchTaskAssigneesDto),
            this.addAssigneesListToTask
        );

        this.router.patch(
            "/:taskId/assignees/:assigneeId",
            authenticate,
            this.addAssigneesToTask
        );
        this.router.delete(
            "/:taskId/assignees/:assigneeId",
            authenticate,
            this.removeAssigneesFromTask
        );
    }

    createTask = async (req: RequestWithLogger, res: Response, next) => {
        try {
            const task = await this.taskService.createTask(req.dto, req.email);
            const responseBody = new ResponseBody(
                task,
                null,
                StatusMessages.CREATED
            );
            responseBody.set_meta(1);
            res.status(StatusCodes.CREATED).send(responseBody);
            Logger.getLogger().log({
                level: "info",
                message: `Task Created (${task.id})`,
                label: req.req_id,
            });
        } catch (err) {
            next(err);
        }
    };

    getAllTasks = async (req: Request, res: Response) => {
        const filterCondition = req.query.status as string;
        const searchQuery = req.query.search as string;
        let reqPage = 0;
        let reqPageSize = 23;
        if(req.query.page && req.query.pageSize){
            reqPage = +req.query.page;
            reqPageSize = +req.query.pageSize;
        } 
        const {taskPromise, page, pageSize, totalCount} = await this.taskService.getTasks(filterCondition, searchQuery, reqPageSize, reqPage);
        const tasks = await taskPromise;
        const responseBody = new ResponseBody(tasks, null, StatusMessages.OK);
        const responseCount = await totalCount;
        if (page * pageSize >= responseCount) {
            responseBody.set_meta(tasks.length, responseCount);
        } else {
            responseBody.set_meta(
                tasks.length,
                responseCount,
                { pageSize },
                { page }
            );
        }
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

    setTask = async (
        req: RequestWithLogger,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const taskId = req.params.id;
            const task = await this.taskService.editTask(
                taskId,
                req.dto,
                req.email
            );
            const responseBody = new ResponseBody(
                task,
                null,
                StatusMessages.OK
            );
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (err) {
            next(err);
        }
    };

    addAssigneesToTask = async (req: Request, res: Response, next: NextFunction) => {
        const taskId = req.params.taskId;
        const assigneeId = req.params.assigneeId;

        try {

            const task = await this.taskService.addAssigneesToTask(
                taskId,
                assigneeId
            );

            const responseBody = new ResponseBody(task, null, StatusMessages.OK);
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (err) {
            next(err);
        }
    };

    addAssigneesListToTask = async (req: RequestWithLogger, res: Response, next: NextFunction) => {
        const taskId = req.params.taskId;
        try {

            const task = await this.taskService.addAssigneesListToTask(
                taskId,
                req.dto
            );

            const responseBody = new ResponseBody(task, null, StatusMessages.OK);
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (err) {
            next(err);
        }

    }

    removeAssigneesFromTask = async (req: Request, res: Response) => {
        const taskId = req.params.taskId;
        const assigneeId = req.params.assigneeId;

        const task = await this.taskService.removeAssigneesFromTask(
            taskId,
            assigneeId
        );

        const responseBody = new ResponseBody(task, null, StatusMessages.OK);
        responseBody.set_meta(1);
        res.status(StatusCodes.OK).send(responseBody);
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
