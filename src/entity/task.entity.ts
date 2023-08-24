import Employee from './employee.entity';
import AbstractEntity from './abstract.enitiy';
import { TaskStatus } from '../utils/taskStatus.enum';
import Comment from './comment.entity';

import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export default class Task extends AbstractEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToMany(() => Employee, (employee) => employee.tasks, { cascade: ["update"]})
    @JoinTable()
    employees: Employee[];
  

    @Column({type:'date'})
    deadline:Date;

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

    @OneToMany(() => Comment, (comment) => comment.task)
    comments: Comment[];


}
