import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert, OneToMany } from "typeorm";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { userRO } from "./user.dto";
import { IdeaEntity } from "src/idea/idea.entity";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @Column({
        type: 'text',
        unique: true,
    })
    username: string;
    @Column('text')
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
    @OneToMany( type => IdeaEntity, idea => idea.author)
    ideas: IdeaEntity[];

    toResponseObject(showToken: boolean = true): userRO {
        const { id, created, username, token } = this;
        const responseObject: any = { id, created, username, token};
        if (showToken) {
            responseObject.token = token;
        }
        return responseObject;

    }
    comparePassword(attempt: string) {
        return bcrypt.compare(attempt, this.password);
    }
    private get token() {

        const { id, username} = this;
        return jwt.sign({ id, username },
            process.env.SECRET, { expiresIn: '7d' });
    }

}
