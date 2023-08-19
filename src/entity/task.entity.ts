import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    RelationId,
    Timestamp,
} from "typeorm";
import Address from "./address.entity";
import Department from "./department.entity";
import Employee from "./employee.entity";
import AbstractEntity from "./abstract.enitiy";
import { Role } from "../utils/role.enum";
import { Exclude, instanceToPlain } from "class-transformer";
import { Status } from "../utils/status.enum";
import { TaskStatus } from "../utils/taskStatus.enum";
import TaskComments from "./taskComments.entity";

@Entity()
export default class Task extends AbstractEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToMany(() => Employee, (employee) => employee.tasks)
    @JoinTable()
    employees: Employee[];

    @Column({ type: "date" })
    deadline: string;

    @Column()
    maxParticipants: number;

    @Column({ default: TaskStatus.CREATED })
    status: TaskStatus;

    @Column({ default: 0 })
    bounty: number;

    @Column()
    skills: string;

    @Column({ default: false })
    isDirectBounty: boolean;

    @ManyToOne(() => Employee, (employee) => employee.tasksCreated)
    @JoinColumn({ name: "createdBy" })
    createdBy: Employee;

    @ManyToOne(() => Employee, (employee) => employee.tasksApproved)
    @JoinColumn({ name: "approvedBy" })
    approvedBy: Employee;

    @OneToMany(() => TaskComments, (taskComment) => taskComment.task)
    taskcomments: TaskComments[];
}
