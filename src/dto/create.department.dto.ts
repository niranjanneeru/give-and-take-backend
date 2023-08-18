import { IsNotEmpty, IsString } from "class-validator";

class CreateDepartmentDto{
    @IsNotEmpty()
    @IsString()
    name:string;
    
    @IsString()
    @IsNotEmpty()
    description:string;
}

export default CreateDepartmentDto;