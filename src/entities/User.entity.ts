import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Length, IsDate } from 'class-validator';
import { hashSync, compareSync, genSaltSync } from 'bcryptjs';

@Entity()
@Unique(['email', 'pseudo'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

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

    hashPassword(): void {
        this.password = hashSync(this.password, genSaltSync());
    }

    generateHash(password: string): void {
        this.password = hashSync(password, genSaltSync());
    }

    isPasswordValid(password: string): boolean {
        return compareSync(password, this.password);
    }
}
