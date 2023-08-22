import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Employee from "./employee.entity";

@Entity()
export default class RedeemRequest{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Employee, (employee) => employee.requests)
    @JoinColumn({ name: "employee" })
    employee: Employee;

    @Column()
    bounty: number;
}