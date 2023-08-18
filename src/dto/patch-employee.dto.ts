import { IsEmail, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import SetAddressDto from "./patch-address.dto";

class SetEmployeeDto{
    
    @IsNotEmpty()
    @IsString()
    name:string;
    
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    @ValidateNested({
        each: true
    })
    @Type(()=>SetAddressDto)
    address: Address
}

export default SetEmployeeDto;