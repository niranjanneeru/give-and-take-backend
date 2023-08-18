import StatusController from "../controller/status.controller";
import StatusRepository from "../repository/status.repository";
import StatusService from "../service/status.service";

const statusRoute = new StatusController(new StatusService(new StatusRepository())).router;

export default statusRoute;
