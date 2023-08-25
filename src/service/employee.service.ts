import bcrypt from 'bcrypt'
import Employee from "../entity/employee.entity";
import EmployeeRepository from "../repository/employee.repository"
import Address from "../entity/address.entity";
import HttpException from "../exception/http.exception";
import CreateEmployeeDto from "../dto/create-employee.dto";
import LoginEmployeeDto from '../dto/login.employee.dto';
import jwt from 'jsonwebtoken';
import EditAddressDto from '../dto/edit-address.dto';
import EditEmployeeDto from '../dto/edit-employee.dto';
import SetAddressDto from '../dto/patch-address.dto';
import jwtPayload from '../utils/jwt.payload.type';
import DepartmentService from './department.service';
import { StatusCodes } from '../utils/status.code.enum';
import RoleService from './role.service';

class EmployeeService {

    // getAllEmployeesFilter(arg: boolean) {
    //     return this.employeeRepository.findByFilter(arg);
    // }
    constructor(private employeeRepository: EmployeeRepository,
        private departmentService: DepartmentService,
        private roleService: RoleService) { }

    getAllEmployees(params) {
        let pageSize = 100;
        let page = 0;
        if (params) {
            if (params.pageSize) pageSize = +params.pageSize;
            if (params.page) page = +params.page;
        }
        return { "employeePromise": this.employeeRepository.find(page * pageSize, pageSize), "page": page + 1, "pageSize": pageSize };
    }

    getEmployeeCount(): Promise<number> {
        return this.employeeRepository.countEmployee();
    }

    async getEmployeeByID(id: string): Promise<Employee | null> {
        const employee = await this.employeeRepository.findEmployeeById(id);
        if (!employee) {
            throw new HttpException(StatusCodes.NOT_FOUND, `Employee with id ${id} not found`);
        }
        return employee;
    }
    
    async getEmployeeTasksByID(id: string): Promise<Employee | null> {
        const employee = await this.employeeRepository.findEmployeeByIDWithTasks(id);
        if (!employee) {
            throw new HttpException(StatusCodes.NOT_FOUND, `Employee with id ${id} not found`);
        }
        return employee;
    }


    async createEmployee(employeeDta: CreateEmployeeDto): Promise<Employee> {
        const existingEmployee = await this.employeeRepository.findEmployeeByEmail(employeeDta.email);
        if (existingEmployee) {
            throw new HttpException(StatusCodes.BAD_REQUEST, `Employee already exist`);
        }
        const employee = new Employee();
        employee.name = employeeDta.name;
        employee.email = employeeDta.email;
        employee.password = await bcrypt.hash(employeeDta.password, +process.env.PASSWORD_HASH_ROUND);
        employee.experience = employeeDta.experience;
        employee.joiningDate = employeeDta.joiningDate;

        const role = await this.roleService.getRoleByName(employeeDta.role);
        if(!role){
            throw new HttpException(StatusCodes.NOT_FOUND, `Role ${employeeDta.role} not found`);
        }
        employee.role = role;

        const department = await this.departmentService.getDepartmentById(employeeDta.departmentId, false);
        if (!department) {
            throw new HttpException(StatusCodes.NOT_FOUND, `Department with id ${employeeDta.departmentId} not found`);
        }
        employee.department = department;

        const newAddress = new Address();
        newAddress.addressLine1 = employeeDta.address.addressLine1;
        newAddress.addressLine2 = employeeDta.address.addressLine2;
        newAddress.state = employeeDta.address.state;
        newAddress.city = employeeDta.address.city;
        newAddress.country = employeeDta.address.country;
        newAddress.pincode = employeeDta.address.pincode;
        employee.address = newAddress;

        return this.employeeRepository.createEmployee(employee);
    }

    editEmployee = async (id: string, employeeDta: EditEmployeeDto): Promise<Employee | null> => {
        if (employeeDta.email) {
            const existingEmployee = await this.employeeRepository.findEmployeeByEmail(employeeDta.email);
            if (existingEmployee && existingEmployee.id !== id) {
                throw new HttpException(StatusCodes.BAD_REQUEST, `Employee already exist`);
            }
        }
        const employee = await this.employeeRepository.findEmployeeById(id);
        if (!employee) {
            throw new HttpException(StatusCodes.NOT_FOUND, `Employee with id ${id} not found`);
        }
        // console.log(employeeDta);
        let keys = Object.getOwnPropertyNames(employeeDta);
        for (const key of keys) {
            if (key === 'password') {

            }
            else if (key === 'departmentId') {
                const department = await this.departmentService.getDepartmentById(employeeDta[key], false);
                if (!department) {
                    throw new HttpException(StatusCodes.NOT_FOUND, `Department with id ${employeeDta.departmentId} not found`);
                }
                if (employee.department != department) {
                    employee.department = department;
                }
            } else if (employeeDta[key] instanceof EditAddressDto || employeeDta[key] instanceof SetAddressDto) {
                let keys = Object.getOwnPropertyNames(employeeDta[key]);
                keys.forEach(k => {
                    employee[key][k] = employeeDta[key][k];
                })
            } else {
                employee[key] = employeeDta[key];
            }
        }
        return this.employeeRepository.updateEmployee(employee);
    }

    removeEmployee = async (id: string): Promise<Employee | null> => {
        const employee = await this.employeeRepository.findEmployeeById(id);
        if (!employee) {
            throw new HttpException(StatusCodes.NOT_FOUND, `Employee with id ${id} not found`);
        }
        return this.employeeRepository.deleteEmployee(employee);
    }

    loginEmployee = async (loginEmployeeDto: LoginEmployeeDto) => {
        const employee = await this.employeeRepository.findEmployeeByEmail(loginEmployeeDto.email);
        if (!employee) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, 'Incorrect username or password');
        }
        const result = await bcrypt.compare(loginEmployeeDto.password, employee.password);
        if (!result) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, 'Incorrect username or password');
        }

        const payload: jwtPayload = {
            name: employee.name,
            email: employee.email,
            role: employee.role.name,
            id: employee.id
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRY
        });

        return { token, employeeDetails: employee };
    }

    getEmployeeByEmail=async (email:string)=>{
        return this.employeeRepository.findEmployeeByEmail(email);
    }
}

export default EmployeeService