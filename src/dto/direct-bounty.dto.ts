import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../utils/taskStatus.enum";

class DirectBountyDto{

    @IsNotEmpty()
    @IsString()
    reason:string;


    @IsNotEmpty()
    @IsNumber()
    bounty:number;
    
}

export default DirectBountyDto;