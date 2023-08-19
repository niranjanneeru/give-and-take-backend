import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../utils/taskStatus.enum";

class CreateTaskDto{

    @IsNotEmpty()
    @IsString()
    title:string;

    @IsNotEmpty()
    @IsString()
    description:string;

    @IsNotEmpty()
    @IsDate()
    deadline:Date;

    @IsNotEmpty()
    @IsNumber()
    maxParticipants:number;


    @IsNotEmpty()
    @IsNumber()
    bounty:number;

    @IsNotEmpty()
    @IsString()
    skills:string;
    
}

export default CreateTaskDto;