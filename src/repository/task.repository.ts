import { Repository } from "typeorm/repository/Repository";
import Task from "../entity/task.entity";

class TaskRepository {
    constructor(private repository: Repository<Task>) {}

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
                taskcomments:true
            }
        })
    }
}

export default TaskRepository;
