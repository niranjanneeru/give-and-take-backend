import { Column, Entity, Index, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm'
import Address from './address.entity';
import Department from './department.entity';
import AbstractEntity from './abstract.enitiy';
import { Role } from '../utils/role.enum';
import { Exclude, instanceToPlain } from 'class-transformer';
import { Status } from '../utils/status.enum';

@Entity()
@Index(["email"], { unique: true })
export default class Employee extends AbstractEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @OneToOne(() => Address, (address) => address.employee, {
        cascade: true
    })
    address: Address

    @ManyToOne(() => Department, (deparment) => deparment.employees, {
        onDelete: 'CASCADE'
    })
    department: Department;

    @Column()
    departmentId: number;


    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column({ default: Role.DEVELOPER })
    role: Role;

    @Column()
    joiningDate: string;

    @Column({ default: Status.ACTIVE })
    status: Status;

    @Column()
    experience: number

    toJSON() {
        return instanceToPlain(this);
    }
}