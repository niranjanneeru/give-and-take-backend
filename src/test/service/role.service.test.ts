import HttpException from "../../exception/http.exception";

import RoleService from "../../service/role.service";
import RoleRepository from "../../repository/role.repository";
import { DataSource } from "typeorm";
import Role from "../../entity/role.entity";
import { when } from "jest-when";


describe('Employee Service', () => {

    let roleService;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;
        const roleRepo = new RoleRepository(dataSource.getRepository(Role))
        roleService = new RoleService(roleRepo);
    })

    test('Test Role', async () => {
        const f1 = jest.fn();
        when(f1).mockResolvedValue({})
        roleService.getRoles = f1
        const role = await roleService.getRoles();
        expect(role).toStrictEqual({})
    })


})
