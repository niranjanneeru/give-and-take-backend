import { Request, Response, Router } from "express";
import TaskService from "../service/task.service";

class TaskController {
    public router: Router;

    constructor(private taskService: TaskService) {
        this.router = Router();

        this.router.get("/", this.testFunction);
    }

    testFunction = (req: Request, res: Response) => {
        res.status(200).send("Hello World!");
    };
}

export default TaskController;
