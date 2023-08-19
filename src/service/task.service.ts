
import CreateTaskDto from "../dto/create-task.dto";
import Task from "../entity/task.entity";
import TaskRepository from "../repository/task.repository";
import jwt from 'jsonwebtoken'
import jwtPayload from "../utils/jwt.payload.type";
import EmployeeService from "./employee.service";
import { TaskStatus } from "../utils/taskStatus.enum";
import HttpException from "../exception/http.exception";
import TaskRepository from "../repository/task.repository";
import { StatusCodes } from "../utils/status.code.enum";

class TaskService {
    constructor(private taskRepository: TaskRepository,private employeeService:EmployeeService) {}
  
    getTasks(){
        return this.taskRepository.findTasks();
    }

    async getTaskById(id: string){
        const task = await this.taskRepository.findTaskById(id);
        if(!task){
            throw new HttpException(StatusCodes.NOT_FOUND, `Task with id ${id} not found`);
        }


    async createTask(createTaskDto: CreateTaskDto,email:string): Promise<Task> {
        const task = new Task();
        task.title = createTaskDto.title;
        task.description = createTaskDto.description;
        task.deadline = createTaskDto.deadline;
        task.maxParticipants = createTaskDto.maxParticipants;
        task.isDirectBounty = false;
        task.status = TaskStatus.CREATED;
        task.bounty = createTaskDto.bounty;
        task.skills = createTaskDto.skills;

        const emp=await this.employeeService.getEmployeeByEmail(email);
        task.createdBy=emp;


        return this.taskRepository.createTask(task);
        return task;
    }
}

export default TaskService;
