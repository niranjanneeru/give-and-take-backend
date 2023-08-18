import { Role } from "./role.enum";

type jwtPayload = {
    name: string,
    email: string,
    role: Role
}

export default jwtPayload;