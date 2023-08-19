import { Repository } from "typeorm/repository/Repository";
import Task from "../entity/task.entity";

class TaskRepository {
    constructor(private repository: Repository<Task>) {}
}

export default TaskRepository;
