import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import { Bucket } from './Bucket.entity';
import { IsDate } from 'class-validator';

@Entity()
export class Blob extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    path!: string;

    @Column()
    mimetype!: string;

    @Column()
    size!: number;

    @ManyToOne(() => Bucket, bucket => bucket.blobs)
    bucket!: Bucket;

    @Column()
    @CreateDateColumn()
    @IsDate()
    createdAt!: Date;

    @Column()
    @UpdateDateColumn()
    @IsDate()
    updatedAt!: Date;
}
