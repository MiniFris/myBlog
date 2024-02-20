import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ length: 50 })
    firstName: string;

    @Column({ length: 50, unique: true })
    email: string;

    @Column('text')
    password: string;

    @CreateDateColumn({ default: 'NOW()' })
    createdAt: Date;

    @UpdateDateColumn({ default: 'NOW()', onUpdate: 'NOW()' })
    updatedAt: Date;
}