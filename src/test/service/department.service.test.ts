import { DataSource } from "typeorm";
import { when } from "jest-when";
import HttpException from "../../exception/http.exception";
import DepartmentService from "../../service/department.service";
import DepartmentRepository from "../../repository/department.repository";
import Department from "../../entity/department.entity";
import CreateDepartmentDto from "../../dto/create.department.dto";
import EditDepartmentDto from "../../dto/edit.department.dto";
import PatchDepartmentDto from "../../dto/patch.department";



describe('Department Service', () => {
    let departmentRepository: DepartmentRepository;
    let departmentService: DepartmentService;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;

        departmentRepository = new DepartmentRepository(dataSource.getRepository(Department));
        departmentService = new DepartmentService(departmentRepository);

    });

    describe('Test for getDepartmentById', () => {
        test('Test Department for id 1 - Error Case', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(1).mockResolvedValueOnce(null);
            departmentRepository.findDepartmentById = mockFunction;
            await expect(async () => {
                await departmentService.getDepartmentById(1);
            }).rejects.toThrow(HttpException);
        })

        test('Test Department for id 7 - Success Case', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(7, true).mockResolvedValue({
                "id": 7,
                "name": "Lav",
            });
            departmentRepository.findDepartmentById = mockFunction;
            const employee = await departmentService.getDepartmentById(7);
            expect(employee).toStrictEqual({
                "id": 7,
                "name": "Lav",
            });
        })

        test('Test for id NaN', async () => {
            await expect(async () => {
                await departmentService.getDepartmentById(NaN);
            }).rejects.toThrow(HttpException);
        })
    });

    describe('Test for getAllEmployees', () => {
        test('Test GetAll Department End Point', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith().mockResolvedValueOnce([]);
            departmentRepository.find = mockFunction;
            const employees = await departmentService.getAllDepartment();
            expect(employees).toStrictEqual([]);
        })

        test('Test GetAll Employees End Point', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith().mockResolvedValueOnce([{}, {}]);
            departmentRepository.find = mockFunction;
            const employees = await departmentService.getAllDepartment();
            expect(employees.length).toEqual(2);
        })
    })

    describe('createDepartment', () => {
        const createDepartmentDto: CreateDepartmentDto = {
            name: 'HR Department',
            description: 'Human Resources Department',
        };

        it('should create a new department', async () => {
            const department = new Department();
            department.id = 1;
            department.name = createDepartmentDto.name;
            department.description = createDepartmentDto.description;

            const mockFunction = jest.fn();
            when(mockFunction).calledWith(createDepartmentDto).mockResolvedValueOnce(department);
            departmentRepository.createDepartment = mockFunction;

            const result = await departmentService.createDepartment(createDepartmentDto);

            expect(result).toEqual(department);
            expect(departmentRepository.createDepartment).toHaveBeenCalledWith(expect.any(Department));
            expect(departmentRepository.createDepartment).toHaveBeenCalledTimes(1);
        });
    });

    describe('editDepartment', () => {
        const departmentId = 1;

        it('should edit the department using EditDepartmentDto', async () => {
            const department = new Department();
            department.id = departmentId;
            department.name = 'Original Department';
            department.description = 'Original Description';

            const mockFunction = jest.fn();
            when(mockFunction).calledWith(1).mockResolvedValue(department);
            departmentRepository.findDepartmentById = mockFunction;

            const mockFunction2 = jest.fn();

            const editDepartmentDto: EditDepartmentDto = {
                name: 'Updated Department',
                description: 'Updated Description',
            };

            when(mockFunction2).calledWith(department).mockResolvedValueOnce(department);
            departmentRepository.updateDepartment = mockFunction2;



            const result = await departmentService.editDepartment(departmentId, editDepartmentDto);

            expect(result).toEqual(department);
            expect(departmentRepository.findDepartmentById).toHaveBeenCalledWith(departmentId);
            expect(departmentRepository.updateDepartment).toHaveBeenCalledWith(department);
            expect(department.name).toBe(editDepartmentDto.name);
            expect(department.description).toBe(editDepartmentDto.description);
        });

        it('should edit the department using PatchDepartmentDto', async () => {
            const department = new Department();
            department.id = departmentId;
            department.name = 'Original Department';
            department.description = 'Original Description';


            const mockFunction = jest.fn();
            when(mockFunction).calledWith(1).mockResolvedValue(department);
            departmentRepository.findDepartmentById = mockFunction;

            const mockFunction2 = jest.fn();

            const editDepartmentDto: EditDepartmentDto = {
                name: 'Updated Department',
                description: 'Updated Description',
            };

            when(mockFunction2).calledWith(department).mockResolvedValueOnce(department);
            departmentRepository.updateDepartment = mockFunction2;

            const result = await departmentService.editDepartment(departmentId, {
                description: 'Updated Description',
            } as unknown as PatchDepartmentDto);

            expect(result).toEqual(department);
            expect(departmentRepository.findDepartmentById).toHaveBeenCalledWith(departmentId);
            expect(departmentRepository.updateDepartment).toHaveBeenCalledWith(department);
            expect(department.name).toBe('Original Department');
        });

        it('should throw an error if department with the given id does not exist', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(1).mockResolvedValue(null);
            departmentRepository.findDepartmentById = mockFunction;

            await expect(
                departmentService.editDepartment(1, { name: 'Updated Department' } as unknown as EditDepartmentDto)
            ).rejects.toThrow(new HttpException(404, `Department with id ${departmentId} not found`));

            expect(departmentRepository.findDepartmentById).toHaveBeenCalledWith(departmentId);
        });

        test('Test for id NaN', async () => {
            await expect(async () => {
                await departmentService.editDepartment(NaN, {} as unknown as EditDepartmentDto);
            }).rejects.toThrow(HttpException);
        })
    });

    describe('removeDepartment', () => {
        const departmentId = 1;

        test('Test for id NaN', async () => {
            await expect(async () => {
                await departmentService.removeDepartment(NaN);
            }).rejects.toThrow(HttpException);
        })

        it('should remove the department', async () => {
            const department = new Department();
            department.id = departmentId;
            department.name = 'HR Department';
            department.description = 'Human Resources Department';

            const mockFunction = jest.fn();
            when(mockFunction).calledWith(1).mockResolvedValue(department);
            departmentRepository.findDepartmentById = mockFunction;

            const mockFunction2 = jest.fn();

            const editDepartmentDto: EditDepartmentDto = {
                name: 'Updated Department',
                description: 'Updated Description',
            };

            when(mockFunction2).calledWith(department).mockResolvedValueOnce(department);
            departmentRepository.deleteDepartment = mockFunction2;


            const result = await departmentService.removeDepartment(departmentId);

            expect(result).toEqual(department);
            expect(departmentRepository.findDepartmentById).toHaveBeenCalledWith(departmentId);
            expect(departmentRepository.deleteDepartment).toHaveBeenCalledWith(department);
        });

        it('should throw an error if department with the given id does not exist', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(1).mockResolvedValue(null);
            departmentRepository.findDepartmentById = mockFunction;

            await expect(departmentService.removeDepartment(departmentId)).rejects.toThrow(
                new HttpException(404, `Department with id ${departmentId} not found`)
            );

            expect(departmentRepository.findDepartmentById).toHaveBeenCalledWith(departmentId);
        });
    });
})
