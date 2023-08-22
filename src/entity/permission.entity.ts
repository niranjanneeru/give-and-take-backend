import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import AbstractEntity from "./abstract.enitiy";

@Entity()
export default class Permission extends AbstractEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}