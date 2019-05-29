import { IsNotEmpty } from "class-validator";
import { IdeaEntity } from "src/idea/idea.entity";

export class UserDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}

export class userRO {
    id: string;
    updated: string;
    userName: string;
    created: Date;
    token?:string;
    bookmarks?: IdeaEntity[];
}
