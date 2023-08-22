import RoleController from "../controller/role.controller";
import dataSource from "../db/postgres.db";
import Role from "../entity/role.entity";
import RoleRepository from "../repository/role.repository";
import RoleService from "../service/role.service";

const roleService = new RoleService(new RoleRepository(dataSource.getRepository(Role)));
const roleController = new RoleController(roleService);
const roleRoute = roleController.router;

export {roleRoute, roleService};
