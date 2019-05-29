import { Resolver, Query, Args, ResolveProperty, Parent, Mutation } from '@nestjs/graphql';
import { UserService } from './user/user.service';
import { CommentService } from 'src/comment/comment/comment.service';
import { UserDto } from './user.dto';

@Resolver('User')
export class UserResolver {
    constructor(private userService: UserService,
                private commentService: CommentService,
    ) { }
    @Query()
    Users(@Args('page') page: number) {
        return this.userService.showAll(page);
    }
    @Mutation()
    login(@Args('username') username: string, @Args('password') password: string) {
        const user: UserDto = { username, password };
        return this.userService.login(user);
    }
    @Mutation()
    register(@Args() { username, password }) {
        const user: UserDto = { username, password };
        return this.userService.register(user);
    }

    @ResolveProperty()
    comments(@Parent() user) {
        const { id } = user;
        return this.commentService.showByUser(id);
    }

}
