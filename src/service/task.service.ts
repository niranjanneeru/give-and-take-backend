import TaskRepository from "../repository/tasks.repository";

class TaskService {
    constructor(private service: TaskRepository) {}
}

export default TaskService;
