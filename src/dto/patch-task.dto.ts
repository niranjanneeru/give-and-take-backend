import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
import { TaskStatus } from "../utils/taskStatus.enum";
import Employee from "../entity/employee.entity";

class setTaskDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    deadline:string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    maxParticipants:number;

    @IsNotEmpty()
    @IsString()
    status: TaskStatus;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    bounty:number;

    @IsNotEmpty()
    @IsString()
    skills: string;


    employees: Employee;

    approvedBy:Employee

}

export default setTaskDto