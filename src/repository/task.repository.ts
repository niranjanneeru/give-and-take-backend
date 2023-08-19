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

    findTaskById(id): Promise<Task> {
        return this.repository.createQueryBuilder('task')
            .leftJoinAndSelect('task.comments', 'comment')
            .leftJoinAndSelect('comment.postedBy', 'employee')
            .orderBy('comment.createdAt')
            .where({id})
            .getOne()
    }

    removeTask(task: Task): Task | PromiseLike<Task> {
        return this.repository.softRemove(task);
    }
}

export default TaskRepository;
