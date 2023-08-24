import { Repository } from "typeorm";
import Role from "../entity/role.entity";

class RoleRepository{

    constructor(
        private repository: Repository<Role>
    ){}

    getAllRoles(){
        return this.repository.find();
    }

    getRoleByName(name: string){
        return this.repository.findOne({
            where: {name},
            relations:{
                permissions: true
            }
        })
    }
}

export default RoleRepository;