import RoleController from "../controller/role.controller";
import RoleRepository from "../repository/role.repository";
import RoleService from "../service/role.service";

const roleService = new RoleService(new RoleRepository());
const roleController = new RoleController(roleService);
const roleRoute = roleController.router;

export default roleRoute;
