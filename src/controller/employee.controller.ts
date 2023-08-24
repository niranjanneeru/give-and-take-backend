import { NextFunction, Request, Response, Router } from "express";
import EmployeeService from "../service/employee.service";
import ResponseBody from "../utils/response.body";
import EditEmployeeDto from "../dto/edit-employee.dto";
import SetEmployeeDto from "../dto/patch-employee.dto";
import CreateEmployeeDto from "../dto/create-employee.dto";
import LoginEmployeeDto from "../dto/login.employee.dto";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import { StatusMessages } from "../utils/status.message.enum";
import { StatusCodes } from "../utils/status.code.enum";
import RequestWithLogger from "../utils/request.logger";
import Logger from "../logger/logger.singleton";
import validateMiddleware from "../middleware/validate.middleware";
import RequestWithUser from "../utils/request.user";
import { Permission } from "../utils/permission.enum";

class EmployeeController {
    public router: Router;

    constructor(private employeeService: EmployeeService) {
        this.router = Router();

        this.router.get("/", authenticate, this.getAllEmployees);
        this.router.get("/me", authenticate, this.getLoggedEmployee);
        this.router.post("/", authenticate, authorize(Permission.EMPLOYEE_CREATE), validateMiddleware(CreateEmployeeDto), this.createEmployee);
        this.router.get("/:id", authenticate, this.getEmployeeById);
        this.router.put("/:id", authenticate, authorize(Permission.EMPLOYEE_EDIT), validateMiddleware(EditEmployeeDto), this.editEmployee);
        this.router.patch("/:id", authenticate, authorize(Permission.EMPLOYEE_EDIT), validateMiddleware(SetEmployeeDto, { skipMissingProperties: true }), this.setFieldEmployee);
        this.router.delete("/:id", authenticate,  authorize(Permission.EMPLOYEE_DELETE), this.removeEmployee);
        this.router.post("/login", validateMiddleware(LoginEmployeeDto, { forbidUnknownValues: false }), this.loginEmployee);
    }

    getLoggedEmployee = async (req: RequestWithUser, res: Response) => {
        const responseBody = new ResponseBody(
            { name: req.name, email: req.email, role: req.role, id: req.userId },
            null,
            StatusMessages.OK
        );
        res.status(StatusCodes.OK).send(responseBody);
    };

    getAllEmployees = async (req: Request, res: Response) => {
        const params = req.query;
        let { employeePromise, page, pageSize } =
            this.employeeService.getAllEmployees(params);
        const employees = await employeePromise;
        const responseBody = new ResponseBody(
            employees,
            null,
            StatusMessages.OK
        );
        const responseCount = await this.employeeService.getEmployeeCount();
        if (page * pageSize > responseCount) {
            responseBody.set_meta(employees.length, responseCount);
        } else {
            responseBody.set_meta(
                employees.length,
                responseCount,
                { pageSize },
                { page }
            );
        }
        res.status(StatusCodes.OK).send(responseBody);
    };

    getEmployeeById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const employeeId = req.params.id;
            const employee = await this.employeeService.getEmployeeTasksByID(
                employeeId
            );
            const responseBody = new ResponseBody(
                employee,
                null,
                StatusMessages.OK
            );
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (error) {
            next(error);
        }
    };

    createEmployee = async (req: RequestWithLogger, res: Response, next) => {
        try {
            const employee = await this.employeeService.createEmployee(req.dto);
            const responseBody = new ResponseBody(
                employee,
                null,
                StatusMessages.CREATED
            );
            responseBody.set_meta(1);
            res.status(StatusCodes.CREATED).send(responseBody);
            Logger.getLogger().log({
                level: "info",
                message: `Employee Created (${employee.id})`,
                label: req.req_id,
            });
        } catch (err) {
            next(err);
        }
    };

    editEmployee = async (
        req: RequestWithLogger,
        res: Response,
        next: NextFunction
    ) => {
        let employeeId = req.params.id;
        try {
            const employee = await this.employeeService.editEmployee(
                employeeId,
                req.dto
            );
            const responseBody = new ResponseBody(
                employee,
                null,
                StatusMessages.OK
            );
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (err) {
            next(err);
        }
    };

    setFieldEmployee = async (
        req: RequestWithLogger,
        res: Response,
        next: NextFunction
    ) => {
        let employeeId = req.params.id;
        try {
            const employee = await this.employeeService.editEmployee(
                employeeId,
                req.dto
            );
            const responseBody = new ResponseBody(
                employee,
                null,
                StatusMessages.OK
            );
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (err) {
            next(err);
        }
    };

    removeEmployee = async (
        req: RequestWithLogger,
        res: Response,
        next: NextFunction
    ) => {
        const employeeId = req.params.id;
        try {
            const employee = await this.employeeService.removeEmployee(
                employeeId
            );
            res.status(StatusCodes.NO_CONTENT).send();
            Logger.getLogger().log({
                level: "info",
                message: `Employee Deleted (${employee.id})`,
                label: req.req_id,
            });
        } catch (err) {
            next(err);
        }
    };

    loginEmployee = async (
        req: RequestWithLogger,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data = await this.employeeService.loginEmployee(req.dto);
            const responseBody = new ResponseBody(
                data,
                null,
                StatusMessages.OK
            );
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (err) {
            next(err);
        }
    };
}

export default EmployeeController;
