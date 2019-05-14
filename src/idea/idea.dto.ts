import {IsString } from 'class-validator';
import { userRO } from 'src/user/user.dto';

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
}
