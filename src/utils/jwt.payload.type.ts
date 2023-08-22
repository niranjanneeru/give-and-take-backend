import Role from "../entity/role.entity";


type jwtPayload = {
    name: string,
    email: string,
    role: string
}

export default jwtPayload;