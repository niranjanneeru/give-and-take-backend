import { IsNotEmpty, IsString, IsUrl } from "class-validator";

class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    comment: string;

    @IsNotEmpty()
    @IsString()
    @IsUrl()
    url: string;
}

export default CreateCommentDto;
