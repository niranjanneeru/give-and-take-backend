import { IsNotEmpty, IsString } from "class-validator";

class EditDepartmentDto{
    @IsNotEmpty()
    @IsString()
    name:string;
    
    @IsString()
    @IsNotEmpty()
    description:string;
}

export default EditDepartmentDto;