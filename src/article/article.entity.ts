import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'articles' })
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column('text')
    description: string;

    @Column()
    authorId: number;

    @CreateDateColumn({ default: 'NOW()' })
    createdAt: Date;

    @UpdateDateColumn({ default: 'NOW()', onUpdate: 'NOW()' })
    updatedAt: Date;


    //FOREIGN KEY
    @ManyToOne(() => User, (user) => user.articles, { onDelete: 'CASCADE' })
    author: User;
}