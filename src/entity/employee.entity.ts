import {
    Column,
    Entity,
    Index,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    RelationId,
    OneToMany,
    ManyToMany,
} from "typeorm";
import Address from "./address.entity";
import Department from "./department.entity";
import AbstractEntity from "./abstract.enitiy";
import { Exclude, instanceToPlain } from "class-transformer";
import { Status } from "../utils/status.enum";
import Role from "./role.entity";
import Task from "./task.entity";
import TaskComments from "./comment.entity";
import RedeemRequest from "./redeem.entity";


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
        cascade: true,
    })
    address: Address;

    @ManyToOne(() => Department, (deparment) => deparment.employees, {
        onDelete: "CASCADE",
    })
    department: Department;

    @Column()
    departmentId: number;

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    @ManyToOne(() => Role, (role) => role.employees)
    role: Role;

    @Column()
    joiningDate: string;

    @Column({ default: Status.ACTIVE })
    status: Status;

    @Column()
    experience: number;

    @Column({ default: 0 })
    bounty: number;

    @Column({ default: 0 })
    redeemed_bounty: number;

    @ManyToMany(() => Task, (task) => task.employees)
    tasks: Task[];

    @OneToMany(() => Task, (task) => task.createdBy)
    tasksCreated: Task[];

    @OneToMany(() => Task, (task) => task.approvedBy)
    tasksApproved: Task[];

    @OneToMany(() => TaskComments, (taskComment) => taskComment.postedBy)
    comments: TaskComments[];

    @OneToMany(() => RedeemRequest, (redeemRequest) => redeemRequest.employee)
    requests: RedeemRequest[];

    @OneToMany(() => RedeemRequest, (request) => request.approvedBy)
    requestsApproved: RedeemRequest[];



    toJSON() {
        return instanceToPlain(this);
    }
}
