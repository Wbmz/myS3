import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from './User.entity';
import { IsDate } from 'class-validator';
import { Blob } from './Blob.entity';

@Entity()
export class Bucket extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @OneToMany(() => Blob, blob => blob.bucket)
    blobs!: Blob[];

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
