import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
} from 'typeorm';
import { Length, IsDate } from 'class-validator';
import { hashSync, compareSync, genSaltSync } from 'bcryptjs';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: number;

    @Column()
    nickname!: string;

    @Column()
    email!: string;

    @Column({ select: false })
    @Length(4, 100)
    password!: string;

    @Column()
    @CreateDateColumn()
    @IsDate()
    createdAt!: Date;

    @Column()
    @UpdateDateColumn()
    @IsDate()
    updatedAt!: Date;

    @BeforeInsert()
    hashPassword(): void {
        this.password = hashSync(this.password, genSaltSync());
    }

    isPasswordValid(password: string): boolean {
        return compareSync(password, this.password);
    }
}
