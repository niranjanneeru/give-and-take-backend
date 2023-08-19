import TaskRepository from "../repository/task.repository";

class TaskService {
    constructor(private service: TaskRepository) {}
}

export default TaskService;
