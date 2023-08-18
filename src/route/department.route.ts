import DepartmentController from "../controller/department.controller";
import dataSource from "../db/postgres.db";
import Department from "../entity/department.entity";
import DepartmentRepository from "../repository/department.repository";
import DepartmentService from "../service/department.service";

const departmentService = new DepartmentService(
    new DepartmentRepository(
        dataSource.getRepository(Department)
    )
);

const departmentRoute = new DepartmentController(departmentService).router;

export { departmentRoute, departmentService };