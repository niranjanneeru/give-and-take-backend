import { DataSource, Repository } from "typeorm";
import Employee from "../entity/employee.entity";

class EmployeeRepository {
    constructor(private repository: Repository<Employee>) { }

    find(skip, take): Promise<Employee[]> {
        // return this.repository.find();
        return this.repository
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.department', 'department')
            .addSelect('employee.departmentId')
            .orderBy("employee.createdAt")
            .skip(skip)
            .take(take)
            .getMany();
    }

    findEmployeeById(id: string): Promise<Employee> {
        return this.repository.findOne({
            where: { id },
            relations: {
                address: true,
                department: true
            }
        });
    }

    countEmployee(): Promise<number> {
        return this.repository.count();
    }

    findEmployeeByEmail(email: string): Promise<Employee> {
        return this.repository
            .createQueryBuilder('employee')
            .addSelect('employee.password')
            .where('email = :email', { email })
            .getOne();
    }

    createEmployee(employee: Employee): Promise<Employee> {
        return this.repository.save(employee);
    }

    updateEmployee(employee: Employee): Promise<Employee> {
        return this.repository.save(employee);
    }

    deleteEmployee(employee: Employee): Employee | PromiseLike<Employee> {
        return this.repository.softRemove(employee);
    }

    findByFilter(params: boolean): Promise<Employee[]> {
        return this.repository.createQueryBuilder()
            .where('is_active = :status', { status: params })
            .getMany()
    }
}


export default EmployeeRepository;