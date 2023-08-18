import { IsDateString, IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsObject, IsPositive, IsString, ValidateNested } from "class-validator";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import CreateAddressDto from "./create-address.dto";
import EditAddressDto from "./edit-address.dto";
import { Role } from "../utils/role.enum";

class EditEmployeeDto{

    @IsString()
    @IsNotEmpty()
    name:string;
    
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    @ValidateNested({
        each: true
    })
    @Type(()=>EditAddressDto)
    address: Address

    @IsNotEmpty()
    @IsEnum(Role)
    role : Role;

    @IsNotEmpty()
    @IsNumber()
    departmentId: number;

    @IsDateString()
    @IsNotEmpty()
    joiningDate: string;

    @IsPositive()
    @IsNotEmpty()
    experience : number;
}

export default EditEmployeeDto;