import { Repository } from "typeorm/repository/Repository";
import Task from "../entity/task.entity";

class TaskRepository {
    constructor(private repository: Repository<Task>) {}

    createTask(task:Task):Promise<Task>{
        return this.repository.save(task);
    }
}

export default TaskRepository;
