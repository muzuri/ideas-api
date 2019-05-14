import { IsNotEmpty } from "class-validator";

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
}
