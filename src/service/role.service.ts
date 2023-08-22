import Role from "../entity/role.entity";
import RoleRepository from "../repository/role.repository";

class RoleService{

    constructor(
        private repository: RoleRepository
    ){}
    getRoles(): Promise<Role[]>{
        return this.repository.getAllRoles();
    }

    getRoleByName(name: string): Promise<Role>{
        return this.repository.getRoleByName(name);
    }
}

export default RoleService;