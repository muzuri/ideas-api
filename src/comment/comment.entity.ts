import { Entity, CreateDateColumn, Column, ManyToOne, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { IdeaEntity } from "src/idea/idea.entity";
import { UserEntity } from "src/user/user.entity";

@Entity('comment')
export class CommentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column('text')
    comment: string;

    @ManyToOne(type => UserEntity)
    @JoinTable()
    author: UserEntity;

    // let me make a relationship between idea and comment
    // one idea-> many comment
    @ManyToOne(type => IdeaEntity, idea => idea.comments)
    idea: IdeaEntity;

}
