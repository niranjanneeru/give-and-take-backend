import { IsBoolean, IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { TaskStatus } from "../utils/taskStatus.enum";

class CreateTaskDto{

    @IsNotEmpty()
    @IsString()
    title:string;

    @IsNotEmpty()
    @IsString()
    description:string;

    @IsNotEmpty()
    @IsDateString()
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

    @IsOptional()
    @IsUUID()
    recipientId:string;

    @IsOptional()
    @IsBoolean()
    isDirectBounty:boolean;
    
}

export default CreateTaskDto;