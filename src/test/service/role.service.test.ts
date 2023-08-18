import HttpException from "../../exception/http.exception";

import RoleService from "../../service/role.service";
import RoleRepository from "../../repository/role.repository";
import { Role } from "../../utils/role.enum";


describe('Employee Service', () => {

    let roleService;

    beforeAll(() => {
        const roleRepo = new RoleRepository()
        roleService = new RoleService(roleRepo);
    })

    test('Test Role', async () => {
        expect(roleService.getRoles()).toStrictEqual(Object.keys(Role))
    })


})
