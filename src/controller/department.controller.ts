import { Request, Response, Router } from "express";
import DepartmentService from "../service/department.service";
import { NextFunction } from "express-serve-static-core";
import CreateDepartmentDto from "../dto/create.department.dto";
import authenticate from "../middleware/authenticate.middleware";
import authorize from "../middleware/authorize.middleware";
import EditDepartmentDto from "../dto/edit.department.dto";
import PatchDepartmentDto from "../dto/patch.department";
import { Role } from "../utils/role.enum";
import { StatusMessages } from "../utils/status.message.enum";
import ResponseBody from "../utils/response.body";
import { StatusCodes } from "../utils/status.code.enum";
import RequestWithLogger from "../utils/request.logger";
import Logger from "../logger/logger.singleton";
import validateMiddleware from "../middleware/validate.middleware";

class DepartmentController {
    public router: Router;
    constructor(
        private departmentService: DepartmentService
    ) {
        this.router = Router();

        this.router.get("/", this.getAllDepartments)
        this.router.post("/",  validateMiddleware(CreateDepartmentDto), this.createDepartment);
        this.router.get("/:id", this.getDepartmentById);
        this.router.put("/:id", authenticate, authorize(Role.HR), validateMiddleware(EditDepartmentDto), this.editDepartment);
        this.router.patch("/:id", authenticate, authorize(Role.HR), validateMiddleware(PatchDepartmentDto, { skipMissingProperties: true }), this.setDepartment);
        this.router.delete("/:id", authenticate, authorize(Role.HR), this.removeDepartment);
    }

    getAllDepartments = async (req: Request, res: Response) => {
        const departments = await this.departmentService.getAllDepartment();
        const responseBody = new ResponseBody(departments, null, StatusMessages.OK);
        responseBody.set_meta(departments.length);
        res.status(StatusCodes.OK).send(responseBody);
    }

    getDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deptId = +req.params.id;
            const department = await this.departmentService.getDepartmentById(deptId);
            const responseBody = new ResponseBody(department, null, StatusMessages.OK);
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (err) {
            next(err);
        }
    }

    createDepartment = async (req: RequestWithLogger, res: Response, next: NextFunction) => {
        try {
            const department = await this.departmentService.createDepartment(req.dto);
            const responseBody = new ResponseBody(department, null, StatusMessages.CREATED);
            responseBody.set_meta(1);
            res.status(StatusCodes.CREATED).send(responseBody);
            Logger.getLogger().log({ level: 'info', message: `Department Created (${department.id})`, label: req.req_id });
        } catch (err) {
            next(err);
        }
    }

    editDepartment = async (req: RequestWithLogger, res: Response, next: NextFunction) => {
        try {
            const deptId = +req.params.id;
            const department = await this.departmentService.editDepartment(deptId, req.dto);
            const responseBody = new ResponseBody(department, null, StatusMessages.OK);
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (err) {
            next(err);
        }
    }

    setDepartment = async (req: RequestWithLogger, res: Response, next: NextFunction) => {
        try {
            const deptId = +req.params.id;
            const department = await this.departmentService.editDepartment(deptId, req.dto);
            const responseBody = new ResponseBody(department, null, StatusMessages.OK);
            responseBody.set_meta(1);
            res.status(StatusCodes.OK).send(responseBody);
        } catch (err) {
            next(err);
        }
    }

    removeDepartment = async (req: RequestWithLogger, res: Response, next: NextFunction) => {
        try {
            const deptId = +req.params.id;
            const department = await this.departmentService.removeDepartment(deptId);
            res.status(StatusCodes.NO_CONTENT).send();
            Logger.getLogger().log({ level: 'info', message: `Department Deleted (${department.id})`, label: req.req_id });
        } catch (err) {
            next(err);
        }
    }
}

export default DepartmentController;