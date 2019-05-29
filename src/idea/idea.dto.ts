import {IsString } from 'class-validator';
import { userRO } from 'src/user/user.dto';
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from 'src/comment/comment.entity';

export class IdeaDTO {
    @IsString()
    idea: string;
    @IsString()
    description: string;

}
export class  IdeaRo {
    id?: string;
    updated: Date;
    createdAt:Date;
    idea: string;
    description: string;
    author: userRO;
    downvotes?: number;
    upvotes?: number;
    comment?:CommentEntity[];
}
