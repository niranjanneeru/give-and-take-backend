import { Request } from "express";
import Role from "../entity/role.entity";

interface RequestWithUser extends Request{
    name: string,
    email : string,
    role : string,
    userId: string
}

export default RequestWithUser;