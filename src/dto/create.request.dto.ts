import { IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl, isPositive } from "class-validator";

class CreateRequestDto {
    @IsNotEmpty()
    @IsPositive()
    bounty: number;
}

export default CreateRequestDto;
