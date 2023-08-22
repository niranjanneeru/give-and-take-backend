import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    IsUUID,
} from "class-validator";
import Employee from "../entity/employee.entity";

class PatchRedeemRequestDto {
    @IsNotEmpty()
    @IsBoolean()
    isApproved: boolean;

    @IsNotEmpty()
    approvedBy: Employee;
}

export default PatchRedeemRequestDto;
