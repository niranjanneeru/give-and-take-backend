import EmployeeController from "../controller/employee.controller";
import dataSource from "../db/postgres.db";
import Employee from "../entity/employee.entity";
import EmployeeRepository from "../repository/employee.repository";
import EmployeeService from "../service/employee.service";
import { departmentService } from "./department.route";


const employeeRepository = new EmployeeRepository(dataSource.getRepository(Employee));
export const employeeService = new EmployeeService(employeeRepository,departmentService);
const employeeController = new EmployeeController(employeeService);
const employeeRoute = employeeController.router;

export default employeeRoute;