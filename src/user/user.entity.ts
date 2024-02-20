import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    firstName: string;

    @Column({ length: 50, unique: true })
    email: string;

    @Column('text')
    password: string;

    @Column('text', { nullable: true })
    refreshToken: string;

    @CreateDateColumn({ default: 'NOW()' })
    createdAt: Date;

    @UpdateDateColumn({ default: 'NOW()', onUpdate: 'NOW()' })
    updatedAt: Date;
}