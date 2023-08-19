import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import AbstractEntity from "./abstract.enitiy";
import Permission from "./permission.entity";
import Employee from "./employee.entity";

@Entity()
export default class Role extends AbstractEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Permission)
    @JoinTable()
    permissions: Permission[];

    @OneToMany(()=> Employee, (employee) => employee.role)
    employees: Employee[];
}
