import CreateDepartmentDto from "../dto/create.department.dto";
import EditDepartmentDto from "../dto/edit.department.dto";
import PatchDepartmentDto from "../dto/patch.department";
import Department from "../entity/department.entity";
import HttpException from "../exception/http.exception";
import DepartmentRepository from "../repository/department.repository";

class DepartmentService{
    constructor(
        private departmentRepository: DepartmentRepository
    ){}

    getAllDepartment(): Promise<Department []>{
        return this.departmentRepository.find();
    }

    getDepartmentById =async (id:number, employees = true): Promise<Department> => {
        if(isNaN(id)){
            throw new HttpException(404, `Department Not Found`);
        }
        const department = await this.departmentRepository.findDepartmentById(id, employees);
        if(!department){
            throw new HttpException(404, `Department with id ${id} not found`);
        }
        return department;
    }

    createDepartment(departmentDto:CreateDepartmentDto) : Promise<Department>{
        const department = new Department();
        department.name = departmentDto.name;
        department.description = departmentDto.description;

        return this.departmentRepository.createDepartment(department);
    }

    editDepartment = async(id: number, departmentDto: EditDepartmentDto | PatchDepartmentDto): Promise<Department> => {
        if(isNaN(id)){
            throw new HttpException(404, `Department Not Found`);
        }
        const department = await this.departmentRepository.findDepartmentById(id);
        if(!department){
            throw new HttpException(404, `Department with id ${id} not found`);
        }
        let keys = Object.getOwnPropertyNames(departmentDto);
        keys.forEach(key => {
            department[key] = departmentDto[key];
        });
        return this.departmentRepository.updateDepartment(department);
    }

    removeDepartment = async(id: number): Promise<Department> => {
        if(isNaN(id)){
            throw new HttpException(404, `Department Not Found`);
        }
        const department = await this.departmentRepository.findDepartmentById(id);
        if(!department){
            throw new HttpException(404, `Department with id ${id} not found`);
        }
        return this.departmentRepository.deleteDepartment(department);
    }
}

export default DepartmentService;