import EmployeeController from "../controller/employee.controller";
import dataSource from "../db/postgres.db";
import Employee from "../entity/employee.entity";
import EmployeeRepository from "../repository/employee.repository";
import EmployeeService from "../service/employee.service";
import { departmentService } from "./department.route";


const employeeRoute = new EmployeeController(
    new EmployeeService(
        new EmployeeRepository(
            dataSource.getRepository(Employee)
        ),
        departmentService
    )
).router;

export default employeeRoute;