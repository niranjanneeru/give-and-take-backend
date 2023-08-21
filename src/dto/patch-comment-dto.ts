import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

class PatchCommentDto {
    @IsNotEmpty()
    @IsString()
    comment: string;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @IsUrl()
    url: string;
}

export default PatchCommentDto;
