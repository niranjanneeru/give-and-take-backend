import HttpException from "../../exception/http.exception";

import RoleService from "../../service/role.service";
import RoleRepository from "../../repository/role.repository";
import { DataSource } from "typeorm";
import Role from "../../entity/role.entity";
import { when } from "jest-when";


describe('Role Service', () => {

    let roleService;
    let roleRepository;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;

        roleRepository = new RoleRepository(dataSource.getRepository(Role))
        roleService = new RoleService(roleRepository);
    })

    test('Test Role', async () => {
        const f1 = jest.fn();
        when(f1).mockResolvedValue({})
        roleRepository.getAllRoles = f1
        const role = await roleService.getRoles();
        expect(role).toStrictEqual({})
    })

    it('should return a role when a valid role name is provided', async () => {
        const roleName = 'admin';
        const expectedRole = {
            id: '1',
            name: 'admin',
        };
        roleRepository.getRoleByName = jest.fn().mockResolvedValue(expectedRole);

        const result = await roleService.getRoleByName(roleName);

        expect(result).toEqual(expectedRole);
        expect(roleRepository.getRoleByName).toHaveBeenCalledWith(roleName);
    });


})
