import { Repository } from "typeorm/repository/Repository";
import Task from "../entity/task.entity";
import Employee from "../entity/employee.entity";

class TaskRepository {
    constructor(private repository: Repository<Task>) {}

    createTask(task:Task):Promise<Task>{
        return this.repository.save(task);
    }
    findTasks() : Promise<Task[]>{
        return this.repository.find();
    }

    findTaskById(id) : Promise<Task>{
        return this.repository.findOne({
            where: {id},
            relations:{
                employees: true,
                createdBy:true,
                approvedBy:true,
                comments:true
            }
        })

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
