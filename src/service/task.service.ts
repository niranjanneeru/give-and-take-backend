import CreateTaskDto from "../dto/create-task.dto";
import Task from "../entity/task.entity";
import TaskRepository from "../repository/task.repository";
import EmployeeService from "./employee.service";
import { TaskStatus } from "../utils/taskStatus.enum";
import SetTaskDto from "../dto/patch-task.dto";
import HttpException from "../exception/http.exception";
import { StatusCodes } from "../utils/status.code.enum";
import DirectBountyDto from "../dto/direct-bounty.dto";

class TaskService {
    constructor(
        private taskRepository: TaskRepository,
        private employeeService: EmployeeService
    ) {}

     
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

        const employee=await this.employeeService.getEmployeeByEmail(email);
        task.createdBy=employee;


        return this.taskRepository.createTask(task);
    }

    editTask = async(id: string, taskDto: SetTaskDto, email: string): Promise<Task> => {

        const task = await this.taskRepository.findTaskById(id);
        const employee = await this.employeeService.getEmployeeByEmail(email);

        if(!task){
            throw new HttpException(404, `Task with id ${id} not found`);
        }

        let keys = Object.getOwnPropertyNames(taskDto);
        keys.forEach(key => {
            console.log("key", key);
            if( key == 'status' ){
                task[key] = taskDto[key];
                task['approvedBy'] = employee
                task.employees.forEach(emp => emp.bounty+=task.bounty/task.employees.length )
            }
            else{
                task[key] = taskDto[key];
            }  
        });
        return this.taskRepository.updateTask(task);
    }
  
  addAssigneesToTask = async ( taskId: string, assigneeId : string) :  Promise<Task> => {
        const task = await this.taskRepository.findTaskById(taskId);
        const employee = await this.employeeService.getEmployeeByID(assigneeId)

        if(!task && !employee){
            throw new HttpException(404, `Task or Employee not found`);
        }

        return this.taskRepository.addAssigneesToTask(task,employee);
   }

    removeAssigneesFromTask = async ( taskId: string, assigneeId : string) :  Promise<Task> => {
        const task = await this.taskRepository.findTaskById(taskId);
        const employee = await this.employeeService.getEmployeeByID(assigneeId)

        if(!task && !employee){
            throw new HttpException(404, `Task or Employee not found`);
        }

        return this.taskRepository.removeAssigneesFromTask(task,employee);
   }

   
  
   removeTask = async (id: string): Promise<Task | null> => {
        const task = await this.taskRepository.findTaskById(id);
        if (!task) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                `Task with id ${id} not found`
            );
        }
        return this.taskRepository.removeTask(task);
    };

    async createDirectBounty(directBountyDto: DirectBountyDto,email:string,employeeId:string): Promise<Task> {
        const task = new Task();
        task.title = directBountyDto.reason;
        task.description = directBountyDto.reason;
        task.deadline = new Date();
        task.maxParticipants = 1;
        task.isDirectBounty = true;
        task.status = TaskStatus.COMPLETED;
        task.bounty = directBountyDto.bounty;
        task.skills = directBountyDto.reason;

        const employee =await this.employeeService.getEmployeeByEmail(email);
        task.createdBy=employee;
        task.approvedBy=employee;

        const recepient=await this.employeeService.getEmployeeByID(employeeId);
        task.employees=[recepient];
        task.employees[0].bounty+=task.bounty;


        return this.taskRepository.createTask(task);
    }

   
}

export default TaskService;
