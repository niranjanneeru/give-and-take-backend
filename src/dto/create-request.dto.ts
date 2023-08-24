import {
    IsBoolean,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";

class CreateRedeeemRequest {
    @IsNotEmpty()
    @IsNumber()
    bounty: number;
}

export default CreateRedeeemRequest;
