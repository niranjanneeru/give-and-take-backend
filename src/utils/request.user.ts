import { Request } from "express";
import Role from "../entity/role.entity";

interface RequestWithUser extends Request{
    name: string,
    email : string,
    role : string
}

export default RequestWithUser;