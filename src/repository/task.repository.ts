import { Repository } from "typeorm/repository/Repository";
import Task from "../entity/task.entity";
import Employee from "../entity/employee.entity";

class TaskRepository {
    constructor(private repository: Repository<Task>) {}

    createTask(task: Task): Promise<Task> {
        return this.repository.save(task);
    }

    findTasks(): Promise<Task[]> {
        return this.repository.find({
            relations:{
                employees: true
            }
        });
    }

    findTaskById(id): Promise<Task> {
        return this.repository.createQueryBuilder('task')
            .leftJoinAndSelect('task.comments', 'comment')
            .leftJoinAndSelect('comment.postedBy', 'employee')
            .orderBy('comment.createdAt')
            .where({id})
            .getOne()
    }

    updateTask(task: Task): Promise<Task>{
        return this.repository.save(task);
    }

    addAssigneesToTask ( task: Task, emp: Employee) : Promise<Task> {
        task.employees.push(emp);
        return this.repository.save(task);
    }

    removeAssigneesFromTask ( task: Task, emp: Employee) : Promise<Task> {
        task.employees = task.employees.filter(e => e.id != emp.id)
        return this.repository.save(task);
    }



    removeTask(task: Task): Task | PromiseLike<Task> {
        return this.repository.softRemove(task);
    }

}

export default TaskRepository;
