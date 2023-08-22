import Role from "../entity/role.entity";


type jwtPayload = {
    name: string,
    email: string,
    role: string,
    id: string
}

export default jwtPayload;