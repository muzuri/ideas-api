import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import { CommentService } from '../comment/comment/comment.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { CommentDto } from './comment.dto';

@Resolver('comment')
export class Comment {
    constructor(private commentService: CommentService) {

    }

    @Query()
    @UseGuards(new AuthGuard())
    async commment(@Args('id')id: string) {
        return await this.commentService.showComment(id);
    }
    @Mutation()
    @UseGuards(new AuthGuard())
    async createComment(@Args('idea') ideaId: string, @Args('comment') comment: string, @Context('user') user) {
        const data: CommentDto = {comment};
        const { id: userId } = user;
        return await this.commentService.createComment(ideaId, data, userId);
    }
    @Mutation()
    @UseGuards(new AuthGuard())
    async deleteComment(@Args('id') id: string, @Context('user') user) {
        const {userId} = user;
        return await this.commentService.destroy(id, userId);
    }

}
