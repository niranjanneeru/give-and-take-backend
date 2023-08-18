import { IsNotEmpty, IsString, ValidateIf } from "class-validator";

class PatchDepartmentDto{
    @IsNotEmpty()
    @IsString()
    name:string;
    
    @IsString()
    @IsNotEmpty()
    description:string;
}

export default PatchDepartmentDto;