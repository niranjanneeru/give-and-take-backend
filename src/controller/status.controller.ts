import { Request, Response, Router } from "express";
import ResponseBody from "../utils/response.body";
import { StatusMessages } from "../utils/status.message.enum";
import { StatusCodes } from "../utils/status.code.enum";
import StatusService from "../service/status.service";

class StatusController {
    public router: Router;
    constructor(
        private statusService: StatusService
    ) {
        this.router = Router();
        this.router.get("/", this.getAllStatus);
    }

    getAllStatus = async (req: Request, res: Response) => {
        const roles = this.statusService.getStatus();
        const responseBody = new ResponseBody(roles, null, StatusMessages.OK);
        responseBody.set_meta(roles.length);
        res.status(StatusCodes.OK).send(responseBody);
    }
}

export default StatusController;