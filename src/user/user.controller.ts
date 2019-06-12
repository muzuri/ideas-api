import { Controller, Post, Get, Body, UsePipes, UseGuards, Query, Param } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserDto } from './user.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from './user.decorator';
import { get } from 'https';

@Controller()
export class UserController {
    constructor(private userService: UserService) { }

    @Get('api/users')
    @UseGuards(new AuthGuard())
    showAllUsers(@Query('page') page: number, @User('password') user) {
        console.log(user);
        return this.userService.showAll(page);
    }
    @Post('api/login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: UserDto) {
        return this.userService.login(data);

    }
    @Post('api/register')
    @UsePipes(new ValidationPipe())
    register(@Body() data: UserDto) {
        return this.userService.register(data);
    }
    @Get('api/whoami')
    @UseGuards(new AuthGuard())
    async showMe(@User('username') username: string){
        return this.userService.read(username);
    }
    @Get('api/users/:username')
    showOneUser(@Param('username') username: string) {
        return this.userService.read(username);
    }
}
