import CreateTaskDto from "../dto/create-task.dto";
import Task from "../entity/task.entity";
import TaskRepository from "../repository/task.repository";
import EmployeeService from "./employee.service";
import { TaskStatus } from "../utils/taskStatus.enum";
import SetTaskDto from "../dto/patch-task.dto";
import HttpException from "../exception/http.exception";
import { StatusCodes } from "../utils/status.code.enum";

class TaskService {
    constructor(
        private taskRepository: TaskRepository,
        private employeeService: EmployeeService
    ) {}

    async getTasks(filter: string) {
        if (
            filter == TaskStatus.CREATED ||
            filter == TaskStatus.IN_PROGRESS ||
            filter == TaskStatus.REQUEST_CHANGE ||
            filter == TaskStatus.COMPLETED
        ) {
            return this.taskRepository.findTasksByTaskCompletionStatus(filter);
        } else if (filter == TaskStatus.IS_EXPIRED) {
            return this.taskRepository.findExpiredTasks();
        } else if (filter == TaskStatus.IS_DIRECT_BOUNTY) {
            return this.taskRepository.findDirectBountyTasks();
        } else return this.taskRepository.findTasks();
    }

    async getTaskById(id: string) {
        const task = await this.taskRepository.findTaskById(id);
        const task_creator_approver =
            await this.taskRepository.findTaskCreatorApprover(id);
        const task_assignees = await this.taskRepository.findTaskAssignees(id);
        task["createdBy"] = task_creator_approver["createdBy"];
        task["approvedBy"] = task_creator_approver["approvedBy"];
        task["assignees"] = task_assignees["employees"];
        if (!task) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                `Task with id ${id} not found`
            );
        }
        return task;
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        email: string
    ): Promise<Task> {
        const task = new Task();
        task.title = createTaskDto.title;
        task.description = createTaskDto.description;
        task.deadline = createTaskDto.deadline;
        task.maxParticipants = createTaskDto.maxParticipants;
        task.bounty = createTaskDto.bounty;
        task.skills = createTaskDto.skills;
        const employee = await this.employeeService.getEmployeeByEmail(email);
        task.createdBy = employee;

        if (
            createTaskDto.hasOwnProperty("isDirectBounty") &&
            createTaskDto.isDirectBounty === true
        ) {
            task.isDirectBounty = true;
            const recipientId = createTaskDto.recipientId;
            const recepient = await this.employeeService.getEmployeeByID(
                recipientId
            );
            task.employees = [recepient];
            task.status = TaskStatus.COMPLETED;
            task.approvedBy = employee;
            task.employees[0].bounty += task.bounty;
        } else {
            task.isDirectBounty = false;
            task.status = TaskStatus.CREATED;
        }

        return this.taskRepository.createTask(task);
    }

    editTask = async (
        id: string,
        taskDto: SetTaskDto,
        email: string
    ): Promise<Task> => {
        const task = await this.taskRepository.findTaskAssignees(id);
        const employee = await this.employeeService.getEmployeeByEmail(email);

        if (!task) {
            throw new HttpException(404, `Task with id ${id} not found`);
        }

        let keys = Object.getOwnPropertyNames(taskDto);
        keys.forEach((key) => {
            console.log("key", key);
            if (key == "status") {
                task[key] = taskDto[key];
                task["approvedBy"] = employee;
                task.employees.forEach(
                    (emp) => (emp.bounty += task.bounty / task.employees.length)
                );
            } else {
                task[key] = taskDto[key];
            }
        });
        return this.taskRepository.updateTask(task);
    };

    addAssigneesToTask = async (
        taskId: string,
        assigneeId: string
    ): Promise<Task> => {
        const task = await this.taskRepository.findTaskAssignees(taskId);
        const employee = await this.employeeService.getEmployeeByID(assigneeId);

        if (!task && !employee) {
            throw new HttpException(404, `Task or Employee not found`);
        }

        if(task.employees.length === task.maxParticipants){
            throw new HttpException(400, 'Participant Count Exceeds');
        }

        task.status = TaskStatus.IN_PROGRESS;

        return this.taskRepository.addAssigneesToTask(task, employee);
    };

    removeAssigneesFromTask = async (
        taskId: string,
        assigneeId: string
    ): Promise<Task> => {
        const task = await this.taskRepository.findTaskAssignees(taskId);
        const employee = await this.employeeService.getEmployeeByID(assigneeId);

        if (!task && !employee) {
            throw new HttpException(404, `Task or Employee not found`);
        }

        return this.taskRepository.removeAssigneesFromTask(task, employee);
    };

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
}

export default TaskService;
