import { IsNotEmpty } from "class-validator";

class PatchTaskAssigneesDto {

    @IsNotEmpty()
    assignees: string[];
}

export default PatchTaskAssigneesDto;