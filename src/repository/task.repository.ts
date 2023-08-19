import { Repository } from "typeorm/repository/Repository";
import Task from "../entity/task.entity";

class TaskRepository {
    constructor(private repository: Repository<Task>) {}

    createTask(task: Task): Promise<Task> {
        return this.repository.save(task);
    }

    findTasks(): Promise<Task[]> {
        return this.repository.find();
    }

    // Todo update using query builder to get all the comments as well
    findTaskById(id): Promise<Task> {
        return this.repository.findOne({
            where: { id },
            relations: {
                employees: true,
                createdBy: true,
                approvedBy: true,
                comments: true,
            },
        });
    }

    removeTask(task: Task): Task | PromiseLike<Task> {
        return this.repository.softRemove(task);
    }
}

export default TaskRepository;
