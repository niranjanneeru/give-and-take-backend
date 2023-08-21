import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    comment: string;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    url: string;
}

export default CreateCommentDto;
