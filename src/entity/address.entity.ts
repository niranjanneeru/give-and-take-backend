import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Employee from "./employee.entity";
import AbstractEntity from "./abstract.enitiy";

@Entity()
class Address extends AbstractEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    addressLine1: string;

    @Column()
    addressLine2: string;

    @Column()
    city: string

    @Column()
    state: string

    @Column()
    country: string

    @Column()
    pincode: string;

    @OneToOne(() => Employee, (employee) => employee.address)
    @JoinColumn()
    employee: Employee
}


export default Address;