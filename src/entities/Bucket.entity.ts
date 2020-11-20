import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { User } from './User.entity';
import { IsDate } from 'class-validator';

@Entity()
export class Bucket extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(() => User, user => user.buckets)
    user!: User;

    @Column()
    @CreateDateColumn()
    @IsDate()
    createdAt!: Date;

    @Column()
    @UpdateDateColumn()
    @IsDate()
    updatedAt!: Date;
}
