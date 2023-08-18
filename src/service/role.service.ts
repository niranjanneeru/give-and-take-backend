import RoleRepository from "../repository/role.repository";

class RoleService{

    constructor(
        private repository: RoleRepository
    ){}
    getRoles(){
        return this.repository.getAllRoles();
    }
}

export default RoleService;