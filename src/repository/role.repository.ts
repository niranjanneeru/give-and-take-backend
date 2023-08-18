import { Role } from "../utils/role.enum";

class RoleRepository{
    getAllRoles(){
        return Object.keys(Role);
    }
}

export default RoleRepository;