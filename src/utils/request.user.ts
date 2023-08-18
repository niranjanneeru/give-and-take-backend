import { Request } from "express";
import { Role } from "./role.enum";

interface RequestWithUser extends Request{
    name: string,
    email : string,
    role : Role
}

export default RequestWithUser;