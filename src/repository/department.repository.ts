import { Repository } from "typeorm";
import Department from "../entity/department.entity";
import employeeRoute from "../route/employee.route";

class DepartmentRepository{
    constructor(
        private repository: Repository<Department>
    ){}

    find(): Promise<Department []>{
        return this.repository.find();
    }

    findDepartmentById(id:number, employees = false): Promise<Department | null> {
        return this.repository.findOne({
            where : {id : id},
            relations: {
                employees
            }
        });
    }

    createDepartment(department: Department): Promise<Department>{
        return this.repository.save(department);
    }

    updateDepartment(department: Department): Promise<Department>{
        return this.repository.save(department);
    }

    deleteDepartment(deparment: Department): Promise<Department>{
        return this.repository.softRemove(deparment);
    }
}

export default DepartmentRepository;