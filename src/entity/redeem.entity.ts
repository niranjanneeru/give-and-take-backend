import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Employee from "./employee.entity";
import AbstractEntity from "./abstract.enitiy";

@Entity()
export default class RedeemRequest extends AbstractEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Employee, (employee) => employee.requests)
    @JoinColumn({ name: "employee" })
    employee: Employee;

    @Column()
    bounty: number;

    @Column({ default: false })
    isApproved: boolean;

    @ManyToOne(() => Employee, (employee) => employee.requestsApproved, {
        nullable: true
    })
    @JoinColumn({ name: "approvedBy" })
    approvedBy: Employee
}