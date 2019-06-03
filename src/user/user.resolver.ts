import { Resolver, Query, Args, ResolveProperty, Parent, Mutation, Context } from '@nestjs/graphql';
import { UserService } from './user/user.service';
import { CommentService } from 'src/comment/comment/comment.service';
import { UserDto } from './user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { async } from 'rxjs/internal/scheduler/async';
@Resolver('User')
export class UserResolver {
    constructor(private userService: UserService,
                private commentService: CommentService,
    ) { }
    @Query()
    Users(@Args('page') page: number) {
        return this.userService.showAll(page);
    }
    @Query()
    user(@Args('username') username: string) {
        return this.userService.read(username);
    }
    @Query()
    @UseGuards(new AuthGuard())
    whoami(@Context('user') user) {
        const {username} = user;

        return this.userService.read(username);
    }

    @Mutation()
    async login(@Args('username') username: string, @Args('password') password: string) {
        const user: UserDto = { username, password };
        return await this.userService.login(user);
    }
    @Mutation()
    async register(@Args('username') username: string,
                   @Args('password') password: string,
    ) {
        const user: UserDto = { username, password };
        return await this.userService.register(user);
    }

    @ResolveProperty()
    comments(@Parent() user) {
        const { id } = user;
        return this.commentService.showByUser(id);
    }

}
