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

    countTasks() {
        return this.repository.count();
    }

    findTasks(searchQuery: string, skip, take): Promise<Task[]> {
        let whereConditions = [{ status: TaskStatus.CREATED, deadline: Raw((alias) => `${alias} >= NOW()`) }, { status: TaskStatus.IN_PROGRESS, deadline: Raw((alias) => `${alias} >= NOW()`) }]
        if (searchQuery) {
            whereConditions = whereConditions.map((condition) => {
                condition['title'] = Like(`%${searchQuery}%`)
                return condition;
            })
        }

        return this.repository.find({
            order: { createdAt: "DESC" },
            where: whereConditions,
            relations: {
                employees: true,
            },
            skip: skip,
            take: take
        });
    }

    findTasksCount(searchQuery: string): Promise<number> {
        let whereConditions = [{ status: TaskStatus.CREATED, deadline: Raw((alias) => `${alias} >= NOW()`) }, { status: TaskStatus.IN_PROGRESS, deadline: Raw((alias) => `${alias} >= NOW()`) }]
        if (searchQuery) {
            whereConditions = whereConditions.map((condition) => {
                condition['title'] = Like(`%${searchQuery}%`)
                return condition;
            })
        }

        return this.repository.count({
            order: { createdAt: "DESC" },
            where: whereConditions,
            relations: {
                employees: true,
            }
        });
    }

    findTasksByTaskCompletionStatusCount(filter: string, searchQuery: string): Promise<number> {
        const whereConditions = { status: filter }
        if (searchQuery) whereConditions['title'] = Like(`%${searchQuery}%`);
        if (filter === TaskStatus.CREATED || filter === TaskStatus.IN_PROGRESS) {
            whereConditions['deadline'] = Raw((alias) => `${alias} >= NOW()`);
        }
        return this.repository
            .createQueryBuilder("task")
            .where(whereConditions)
            .orderBy('task.createdAt', 'DESC')
            .leftJoinAndSelect("task.employees", "employees")
            .getCount();
    }

    findTasksByTaskCompletionStatus(filter: string, searchQuery: string, skip, take): Promise<Task[]> {
        const whereConditions = { status: filter }
        if (searchQuery) whereConditions['title'] = Like(`%${searchQuery}%`);
        if (filter === TaskStatus.CREATED || filter === TaskStatus.IN_PROGRESS) {
            whereConditions['deadline'] = Raw((alias) => `${alias} >= NOW()`);
        }
        return this.repository
            .createQueryBuilder("task")
            .where(whereConditions)
            .orderBy('task.createdAt', 'DESC')
            .leftJoinAndSelect("task.employees", "employees")
            .skip(skip)
            .take(take)
            .getMany();
    }

    findExpiredTasks(searchQuery: string, skip, take): Promise<Task[]> {
        const whereConditions = { deadline: Raw((alias) => `${alias} < NOW()`) }
        if (searchQuery) whereConditions['title'] = Like(`%${searchQuery}%`);
        return this.repository.createQueryBuilder("task")
            .leftJoinAndSelect("task.employees", "employees")
            .where(whereConditions)
            .orderBy('task.createdAt', 'DESC')
            .skip(skip)
            .take(take)
            .getMany();
    }

    findExpiredTasksCount(searchQuery: string): Promise<number> {
        const whereConditions = { deadline: Raw((alias) => `${alias} < NOW()`) }
        if (searchQuery) whereConditions['title'] = Like(`%${searchQuery}%`);
        return this.repository.createQueryBuilder("task")
            .leftJoinAndSelect("task.employees", "employees")
            .where(whereConditions)
            .orderBy('task.createdAt', 'DESC')
            .getCount();
    }

    findDirectBountyTasks(searchQuery: string, skip, take): Promise<Task[]> {
        const whereConditions = { isDirectBounty: true }
        if (searchQuery) whereConditions['title'] = Like(`%${searchQuery}%`);

        return this.repository
            .createQueryBuilder("task")
            .where({ isDirectBounty: true })
            .leftJoinAndSelect("task.employees", "employees")
            .orderBy('task.createdAt', 'DESC')
            .skip(skip)
            .take(take)
            .getMany();
    }

    findDirectBountyTasksCount(searchQuery: string): Promise<number> {
        const whereConditions = { isDirectBounty: true }
        if (searchQuery) whereConditions['title'] = Like(`%${searchQuery}%`);

        return this.repository
            .createQueryBuilder("task")
            .where({ isDirectBounty: true })
            .leftJoinAndSelect("task.employees", "employees")
            .orderBy('task.createdAt', 'DESC')
            .getCount();
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
