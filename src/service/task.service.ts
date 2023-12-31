import CreateTaskDto from "../dto/create-task.dto";
import Task from "../entity/task.entity";
import TaskRepository from "../repository/task.repository";
import EmployeeService from "./employee.service";
import { TaskStatus } from "../utils/taskStatus.enum";
import SetTaskDto from "../dto/patch-task.dto";
import HttpException from "../exception/http.exception";
import { StatusCodes } from "../utils/status.code.enum";
import PatchTaskAssigneesDto from "../dto/patch.task.assignees.dto";

class TaskService {
    constructor(
        private taskRepository: TaskRepository,
        private employeeService: EmployeeService
    ) { }

    getTasksCount() {
        return this.taskRepository.countTasks();
    }

    async getTasks(filter: string, searchQuery: string, pageSize, page): Promise<{ page: number, pageSize: number, taskPromise?: Promise<Task[]>, totalCount?: Promise<number> }> {
        const paginatedData = {
            page: page + 1,
            pageSize: pageSize
        }
        if (
            filter == TaskStatus.CREATED ||
            filter == TaskStatus.IN_PROGRESS ||
            filter == TaskStatus.REQUEST_CHANGE ||
            filter == TaskStatus.COMPLETED
        ) {
            paginatedData['taskPromise'] = this.taskRepository.findTasksByTaskCompletionStatus(filter, searchQuery, page * pageSize, pageSize);
            paginatedData['totalCount'] = this.taskRepository.findTasksByTaskCompletionStatusCount(filter, searchQuery);
        } else if (filter == TaskStatus.IS_EXPIRED) {
            paginatedData['taskPromise'] = this.taskRepository.findExpiredTasks(searchQuery, page * pageSize, pageSize);
            paginatedData['totalCount'] = this.taskRepository.findExpiredTasksCount(searchQuery);
        } else if (filter == TaskStatus.IS_DIRECT_BOUNTY) {
            paginatedData['taskPromise'] = this.taskRepository.findDirectBountyTasks(searchQuery, page * pageSize, pageSize);
            paginatedData['totalCount'] = this.taskRepository.findDirectBountyTasksCount(searchQuery);
        } else {
            paginatedData['taskPromise'] = this.taskRepository.findTasks(searchQuery, page * pageSize, pageSize);
            paginatedData['totalCount'] = this.taskRepository.findTasksCount(searchQuery);
        }

        return paginatedData;
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
                    (emp) => (emp.bounty += Math.ceil(task.bounty / task.employees.length))
                );
            } else {
                task[key] = taskDto[key];
            }
        });
        return this.taskRepository.updateTask(task);
    };

    addAssigneesListToTask = async (taskId: string, dto: PatchTaskAssigneesDto) => {
        const task = await this.taskRepository.findTaskAssignees(taskId);

        if (!task) {
            throw new HttpException(StatusCodes.NOT_FOUND, `Task not found`);
        }

        if (dto.assignees.length > task.maxParticipants) {
            throw new HttpException(StatusCodes.BAD_REQUEST, 'Participant Count Exceeds');
        }

        const assignees = [];

        for (const assignee of dto.assignees) {
            const temp = await this.employeeService.getEmployeeByID(assignee);
            if (!temp) {
                throw new HttpException(StatusCodes.NOT_FOUND, `Employee not found`);
            }
            assignees.push(temp);
        }

        task.employees = assignees;

        task.status = TaskStatus.IN_PROGRESS;

        return this.taskRepository.updateTask(task);

    }

    addAssigneesToTask = async (
        taskId: string,
        assigneeId: string
    ): Promise<Task> => {
        const task = await this.taskRepository.findTaskAssignees(taskId);
        const employee = await this.employeeService.getEmployeeByID(assigneeId);

        if (!task && !employee) {
            throw new HttpException(404, `Task or Employee not found`);
        }

        if (task.employees.length >= task.maxParticipants) {
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
