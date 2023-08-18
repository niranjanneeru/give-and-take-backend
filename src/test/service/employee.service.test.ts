import { DataSource } from "typeorm";
import EmployeeRepository from "../../repository/employee.repository";
import EmployeeService from "../../service/employee.service";
import Employee from "../../entity/employee.entity";
import { when } from "jest-when";
import HttpException from "../../exception/http.exception";
import DepartmentService from "../../service/department.service";
import DepartmentRepository from "../../repository/department.repository";
import Department from "../../entity/department.entity";
import { StatusCodes } from "../../utils/status.code.enum";
import { StatusMessages } from "../../utils/status.message.enum";
import CreateEmployeeDto from "../../dto/create-employee.dto";
import { Role } from "../../utils/role.enum";
import EditEmployeeDto from "../../dto/edit-employee.dto";

import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken';
import LoginEmployeeDto from "../../dto/login.employee.dto";
import EditAddressDto from "../../dto/edit-address.dto";
import Address from "../../entity/address.entity";

describe('Employee Service', () => {
    let employeeService: EmployeeService;
    let employeeRepository: EmployeeRepository;
    let departmentService: DepartmentService;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;

        employeeRepository = new EmployeeRepository(dataSource.getRepository(Employee));
        departmentService = new DepartmentService(new DepartmentRepository(dataSource.getRepository(Department)));
        employeeService = new EmployeeService(employeeRepository, departmentService);

    });

    describe('Test for getEmployeeById', () => {
        test('Test Employee for id 1 - Error Case', async () => {
            const val = StatusMessages.OK;
            const mockFunction = jest.fn();
            when(mockFunction).calledWith("1").mockResolvedValueOnce(null);
            employeeRepository.findEmployeeById = mockFunction;
            await expect(async () => {
                await employeeService.getEmployeeByID("1");
            }).rejects.toThrow(HttpException);
        })

        test('Test Employee for id 7 - Success Case', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith("7").mockResolvedValue({
                "id": "7",
                "createdAt": "2023-08-03T23:53:50.969Z",
                "updatedAt": "2023-08-04T03:43:18.688Z",
                "deletedAt": null,
                "name": "Lav",
                "email": "lav@mel.com",
                "password": "$2b$10$Rwk.TCczha0RVHAc43Yw/ebHccohS984Q3togJ60VYGlpfeAv4N/.",
                "role": "DEVELOPER",
                "address": {
                    "id": 12,
                    "createdAt": "2023-08-03T23:53:50.969Z",
                    "updatedAt": "2023-08-04T03:22:25.360Z",
                    "deletedAt": null,
                    "line1": "Key 1 Value",
                    "pincode": "324234"
                },
                "department": null
            });
            employeeRepository.findEmployeeById = mockFunction;
            const employee = await employeeService.getEmployeeByID("7");
            expect(employee).toStrictEqual({
                "id": "7",
                "createdAt": "2023-08-03T23:53:50.969Z",
                "updatedAt": "2023-08-04T03:43:18.688Z",
                "deletedAt": null,
                "name": "Lav",
                "email": "lav@mel.com",
                "password": "$2b$10$Rwk.TCczha0RVHAc43Yw/ebHccohS984Q3togJ60VYGlpfeAv4N/.",
                "role": "DEVELOPER",
                "address": {
                    "id": 12,
                    "createdAt": "2023-08-03T23:53:50.969Z",
                    "updatedAt": "2023-08-04T03:22:25.360Z",
                    "deletedAt": null,
                    "line1": "Key 1 Value",
                    "pincode": "324234"
                },
                "department": null
            });
        })
    });

    describe('Test for getAllEmployees', () => {
        test('Test GetAll Employees End Point', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith().mockResolvedValueOnce([]);
            employeeRepository.find = mockFunction;
            const {employeePromise, page, pageSize} = employeeService.getAllEmployees({});
            expect(page).toBe(1);
        })

        test('Test GetAll Employees End Point', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith().mockResolvedValueOnce([{}, {}]);
            employeeRepository.find = mockFunction;
            const {employeePromise, page, pageSize} = employeeService.getAllEmployees({page:1, pageSize:1});
            expect(page).toBe(2);
        })
    })

    describe('Test for getCount', () => {
        test('Test getCount End Point', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith().mockResolvedValueOnce(2);
            employeeRepository.countEmployee = mockFunction;
            const employees = await employeeService.getEmployeeCount()
            expect(employees).toBe(2);
        })
    })

    describe('createEmployee', () => {
        const createEmployeeDto = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            role: Role.DEVELOPER,
            experience: 2,
            joiningDate: "2022-12-12",
            departmentId: 1,
            address: {
                addressLine1: 'Address line 1',
                addressLine2: 'Address line 2',
                state: 'State',
                city: 'City',
                country: 'Country',
                pincode: '12345',
            },
        };

        it('should create a new employee', async () => {
            const department = { id: 1, name: 'Department A' };
            const f = jest.fn();
            when(f).calledWith(1, false).mockResolvedValue(department)
            departmentService.getDepartmentById = f;

            const f2 = jest.fn();
            when(f2).calledWith(createEmployeeDto.email).mockResolvedValue(null)
            employeeRepository.findEmployeeByEmail = f2;

            const savedEmployee = new Employee()


            const f3 = jest.fn();
            when(f3).calledWith(savedEmployee).mockResolvedValue(savedEmployee);
            employeeRepository.createEmployee = f3;

            const result = await employeeService.createEmployee(createEmployeeDto as CreateEmployeeDto);

            expect(employeeRepository.findEmployeeByEmail).toHaveBeenCalledWith(
                createEmployeeDto.email
            );

            expect(employeeRepository.createEmployee).toHaveBeenCalledWith(expect.any(Employee));

            expect(departmentService.getDepartmentById).toHaveBeenCalledWith(
                createEmployeeDto.departmentId,
                false
            );
        });

        it('should throw an error if employee with the same email already exists', async () => {
            const existingEmployee = new Employee();
            const f2 = jest.fn();
            when(f2).calledWith(createEmployeeDto.email).mockResolvedValue({ 'email': 'email' })
            employeeRepository.findEmployeeByEmail = f2;

            await expect(async () => {
                await employeeService.createEmployee(createEmployeeDto as CreateEmployeeDto)
            }).rejects.toThrow(HttpException);

            expect(employeeRepository.findEmployeeByEmail).toHaveBeenCalledWith(
                createEmployeeDto.email
            );
        });

        it('Invalid Department ID', async () => {
            const existingEmployee = new Employee();
            const f2 = jest.fn();
            when(f2).calledWith(createEmployeeDto.email).mockResolvedValue(null)
            employeeRepository.findEmployeeByEmail = f2;

            const f = jest.fn();
            when(f).calledWith(1, false).mockResolvedValue(null)
            departmentService.getDepartmentById = f;



            await expect(async () => {
                await employeeService.createEmployee(createEmployeeDto as CreateEmployeeDto)
            }).rejects.toThrow(HttpException);

            expect(employeeRepository.findEmployeeByEmail).toHaveBeenCalledWith(
                createEmployeeDto.email
            );
        });

    });

    describe('editEmployee', () => {
        const employeeId = "1";
        const editEmployeeDto = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            role: Role.DEVELOPER,
            experience: 2,
            joiningDate: "2022-12-12",
            departmentId: 1,
            address: {
                addressLine1: 'Address line 1',
                addressLine2: 'Address line 2',
                state: 'State',
                city: 'City',
                country: 'Country',
                pincode: '12345',
            },
        };

        test('Test Employee for id 1 - Error Case', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith("1").mockResolvedValueOnce(null);
            employeeRepository.findEmployeeById = mockFunction;
            await expect(async () => {
                await employeeService.editEmployee("1", {} as EditEmployeeDto);
            }).rejects.toThrow(HttpException);
        })

        it('should throw an error if employee with the same email already exists', async () => {
            const existingEmployee = new Employee();
            const f2 = jest.fn();
            when(f2).calledWith(editEmployeeDto.email).mockResolvedValue({ 'email': 'email' })
            employeeRepository.findEmployeeByEmail = f2;

            await expect(async () => {
                await employeeService.editEmployee("1", editEmployeeDto as unknown as EditEmployeeDto)
            }).rejects.toThrow(HttpException);

            expect(employeeRepository.findEmployeeByEmail).toHaveBeenCalledWith(
                editEmployeeDto.email
            );
        });

        it('should update the employee data', async () => {
            const existingEmployee = new Employee();
            existingEmployee.id = employeeId;
            existingEmployee.name = 'Original Employee';
            existingEmployee.email = 'original.employee@example.com';
            existingEmployee.departmentId = 1;
            existingEmployee.address = new Address();

            const f1 = jest.fn();
            when(f1).calledWith(1, false).mockResolvedValue("UI");
            departmentService.getDepartmentById = f1;

            const f = jest.fn();
            when(f).calledWith("1").mockResolvedValue(existingEmployee);
            employeeRepository.findEmployeeById = f;


            const f2 = jest.fn();
            when(f2).calledWith(editEmployeeDto.email).mockResolvedValue(null);
            employeeRepository.findEmployeeByEmail = f2;

            const f3 = jest.fn();
            when(f3).calledWith(existingEmployee).mockResolvedValue(existingEmployee);
            employeeRepository.updateEmployee = f3;

            let address = new EditAddressDto();
            address.addressLine1 = "Something";
            await employeeService.editEmployee(employeeId, { email: 'john.doe@example.com', 'departmentId': 1, 'address': address, password: "No Use" } as unknown as EditEmployeeDto);

            expect(employeeRepository.findEmployeeById).toHaveBeenCalledWith(employeeId);
            expect(employeeRepository.findEmployeeByEmail).toHaveBeenCalledWith(
                editEmployeeDto.email
            );
        });

        it('Invalid Department', async () => {
            const existingEmployee = new Employee();
            existingEmployee.id = employeeId;
            existingEmployee.name = 'Original Employee';
            existingEmployee.email = 'original.employee@example.com';
            existingEmployee.departmentId = 0;

            const f1 = jest.fn();
            when(f1).calledWith(0, false).mockResolvedValue(null);
            departmentService.getDepartmentById = f1;

            const f = jest.fn();
            when(f).calledWith("1").mockResolvedValue(existingEmployee);
            employeeRepository.findEmployeeById = f;


            const f2 = jest.fn();
            when(f2).calledWith(editEmployeeDto.email).mockResolvedValue(null);
            employeeRepository.findEmployeeByEmail = f2;

            const f3 = jest.fn();
            when(f3).calledWith(existingEmployee).mockResolvedValue(existingEmployee);
            employeeRepository.updateEmployee = f3;

            await expect(async () => {
                await employeeService.editEmployee(employeeId, { email: 'john.doe@example.com', 'departmentId': 0 } as unknown as EditEmployeeDto);
            }).rejects.toThrow(HttpException);

            expect(employeeRepository.findEmployeeById).toHaveBeenCalledWith(employeeId);
            expect(employeeRepository.findEmployeeByEmail).toHaveBeenCalledWith(
                editEmployeeDto.email
            );
        });

    });

    describe('removeEmployee', () => {
        const employeeId = "1";
        const existingEmployee = new Employee();
        existingEmployee.id = employeeId;
        existingEmployee.name = 'John Doe';
        existingEmployee.email = 'john.doe@example.com';

        it('should remove the employee', async () => {


            const f = jest.fn();
            when(f).calledWith("1").mockResolvedValue(existingEmployee);
            employeeRepository.findEmployeeById = f;


            const f2 = jest.fn();
            when(f2).calledWith(existingEmployee).mockResolvedValue(existingEmployee);
            employeeRepository.deleteEmployee = f2;

            const result = await employeeService.removeEmployee(employeeId);

            expect(result).toEqual(existingEmployee);
            expect(employeeRepository.findEmployeeById).toHaveBeenCalledWith(employeeId);
            expect(employeeRepository.deleteEmployee).toHaveBeenCalledWith(existingEmployee);
        });

        it('should throw an error if employee with the given id does not exist', async () => {

            const f = jest.fn();
            when(f).calledWith(1).mockResolvedValue(null);
            employeeRepository.findEmployeeById = f;

            await expect(employeeService.removeEmployee("1")).rejects.toThrow(
                new HttpException(StatusCodes.NOT_FOUND, `Employee with id ${employeeId} not found`)
            );

            expect(employeeRepository.findEmployeeById).toHaveBeenCalledWith(employeeId);
        });
    });

    describe('loginEmployee', () => {
        const loginEmployeeDto: LoginEmployeeDto = {
            email: 'john.doe@example.com',
            password: 'password123',
        };

        it('should successfully login an employee', async () => {
            const employee = new Employee();
            employee.id = "1";
            employee.name = 'John Doe';
            employee.email = loginEmployeeDto.email;
            employee.role = Role.DEVELOPER;
            employee.password = await bcrypt.hash(loginEmployeeDto.password, 10);

            const f2 = jest.fn();
            when(f2).calledWith(loginEmployeeDto.email).mockResolvedValue(employee);
            employeeRepository.findEmployeeByEmail = f2;

            const f = jest.fn();
            when(f).calledWith(loginEmployeeDto.password, employee.password).mockResolvedValue(true);
            bcrypt.compare = f;

            const f3 = jest.fn();
            when(f3).calledWith(employee.password).mockResolvedValue(true);
            jwt.sign = f3;


            const token = 'jwt_token';

            const result = await employeeService.loginEmployee(loginEmployeeDto);

            expect(result.employeeDetails).toEqual(employee);
            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    name: employee.name,
                    email: employee.email,
                    role: employee.role,
                },
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn: process.env.JWT_EXPIRY,
                }
            );
        });

        it('should throw an error if employee with the given email does not exist', async () => {
            const f2 = jest.fn();
            when(f2).calledWith(loginEmployeeDto.email).mockResolvedValue(null);
            employeeRepository.findEmployeeByEmail = f2;

            await expect(employeeService.loginEmployee(loginEmployeeDto)).rejects.toThrow(
                new HttpException(StatusCodes.UNAUTHORIZED, 'Incorrect username or password')
            );


        });

        it('should throw an error if the password does not match', async () => {
            const employee = new Employee();
            employee.id = "1";
            employee.email = loginEmployeeDto.email;
            employee.password = await bcrypt.hash('wrong_password', 10);

            const f2 = jest.fn();
            when(f2).calledWith(loginEmployeeDto.email).mockResolvedValue("abcd");
            employeeRepository.findEmployeeByEmail = f2;

            const f = jest.fn();
            when(f).calledWith(loginEmployeeDto.password, employee.password).mockResolvedValue(false);
            bcrypt.compare = f;

            await expect(employeeService.loginEmployee(loginEmployeeDto)).rejects.toThrow(
                new HttpException(StatusCodes.UNAUTHORIZED, 'Incorrect username or password')
            );
        });
    });
})
