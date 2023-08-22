import { Repository } from "typeorm/repository/Repository";
import Task from "../entity/task.entity";
import Employee from "../entity/employee.entity";
import { TaskStatus } from "../utils/taskStatus.enum";
import { Like, Raw } from "typeorm";

class TaskRepository {
    constructor(private repository: Repository<Task>) { }

    createTask(task: Task): Promise<Task> {
        return this.repository.save(task);
    }

    findTasks(searchQuery: string): Promise<Task[]> {
        let whereConditions = [{ status: TaskStatus.CREATED }, { status: TaskStatus.IN_PROGRESS }]
        if (searchQuery) {
            whereConditions = whereConditions.map((condition) => {
                condition['title'] = Like(`%${searchQuery}%`)
                return condition;
            })
        }

        return this.repository.find({
            where: whereConditions,
            relations: {
                employees: true,
            },
        });
    }

    findTasksByTaskCompletionStatus(filter: string, searchQuery: string): Promise<Task[]> {
        const whereConditions = { status: filter }
        if (searchQuery) whereConditions['title'] = Like(`%${searchQuery}%`);
        return this.repository
            .createQueryBuilder("task")
            .where(whereConditions)
            .getMany();
    }

    findExpiredTasks(searchQuery: string): Promise<Task[]> {
        const whereConditions = { deadline: Raw((alias) => `${alias} < NOW()`) }
        if (searchQuery) whereConditions['title'] = Like(`%${searchQuery}%`);
        return this.repository.findBy(whereConditions);
    }

    findDirectBountyTasks(searchQuery: string): Promise<Task[]> {
        const whereConditions = { isDirectBounty: true }
        if (searchQuery) whereConditions['title'] = Like(`%${searchQuery}%`);

        return this.repository
            .createQueryBuilder("task")
            .where(whereConditions)
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
