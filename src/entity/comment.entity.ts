import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import Employee from "./employee.entity";
import AbstractEntity from "./abstract.enitiy";
import Task from "./task.entity";

@Entity()
class Comment extends AbstractEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @Column({nullable: true})
    url: string;

    @ManyToOne(() => Task, (task) => task.comments)
    task: Task;

    @ManyToOne(() => Employee, (employee) => employee.comments)
    @JoinColumn({ name: "postedBy" })
    postedBy: Employee;
}



export default Comment;
