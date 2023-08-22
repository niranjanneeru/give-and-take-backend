import { Repository } from "typeorm/repository/Repository";
import Task from "../entity/task.entity";
import Employee from "../entity/employee.entity";
import { TaskStatus } from "../utils/taskStatus.enum";
import { Raw } from "typeorm";

class TaskRepository {
    constructor(private repository: Repository<Task>) {}

    createTask(task: Task): Promise<Task> {
        return this.repository.save(task);
    }

    findTasks(): Promise<Task[]> {
        return this.repository.find({
            relations: {
                employees: true,
            },
        });
    }

    findTasksByTaskCompletionStatus(filter: string): Promise<Task[]> {
        return this.repository
            .createQueryBuilder("task")
            .where({ status: filter })
            .getMany();
    }

    findExpiredTasks(): Promise<Task[]> {
        return this.repository.findBy({
            deadline: Raw((alias) => `${alias} < NOW()`),
        });
    }

    findDirectBountyTasks(): Promise<Task[]> {
        return this.repository
            .createQueryBuilder("task")
            .where({ isDirectBounty: true })
            .getMany();
    }

    findTaskById(id): Promise<Task> {
        return this.repository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.comments", "comment")
            .leftJoinAndSelect("comment.postedBy", "employee")
            .orderBy("comment.createdAt", "DESC")
            .where({ id })
            .getOne();
    }

    findTaskCreatorApprover(id: string): Promise<Task> {
        return this.repository.findOne({
            where: { id },
            relations: {
                approvedBy: true,
                createdBy: true,
            },
        });
    }

    findTaskAssignees(id: string): Promise<Task> {
        return this.repository.findOne({
            where: { id },
            relations: {
                employees: true,
            },
        });
    }

    updateTask(task: Task): Promise<Task> {
        return this.repository.save(task);
    }

    addAssigneesToTask(task: Task, emp: Employee): Promise<Task> {
        task.employees.push(emp);
        return this.repository.save(task);
    }

    removeAssigneesFromTask(task: Task, emp: Employee): Promise<Task> {
        task.employees = task.employees.filter((e) => e.id != emp.id);
        return this.repository.save(task);
    }

    removeTask(task: Task): Task | PromiseLike<Task> {
        return this.repository.softRemove(task);
    }
}

export default TaskRepository;
