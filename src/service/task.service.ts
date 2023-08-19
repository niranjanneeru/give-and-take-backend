import HttpException from "../exception/http.exception";
import TaskRepository from "../repository/task.repository";
import { StatusCodes } from "../utils/status.code.enum";

class TaskService {
    constructor(private taskRepository: TaskRepository) {}

    getTasks(){
        return this.taskRepository.findTasks();
    }

    async getTaskById(id: string){
        const task = await this.taskRepository.findTaskById(id);
        if(!task){
            throw new HttpException(StatusCodes.NOT_FOUND, `Task with id ${id} not found`);
        }
        return task;
    }
}

export default TaskService;
