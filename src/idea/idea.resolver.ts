import { Resolver, Query, Args, ResolveProperty, Parent, Mutation, Context } from '@nestjs/graphql';
import { IdeaService } from './idea.service';
import { CommentService } from 'src/comment/comment/comment.service';
import { async } from 'rxjs/internal/scheduler/async';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { IdeaDTO } from './idea.dto';

@Resolver()
export class IdeaResolver {
    constructor(private ideaService: IdeaService, private commentService: CommentService) { }
    @Query()
    ideas(@Args('page') page: number) {
        return this.ideaService.showAllIdeas(page);
    }
    @ResolveProperty()
    comments(@Parent() idea) {
        const { id } = idea;
        return this.commentService.showByidea(id);
    }
    @Query()
    idea(@Args('id')id: string) {
        return this.ideaService.readById(id);
    }
    @Mutation()
    @UseGuards(new AuthGuard())
    async createIdea(@Args('idea') idea: string,@Args('description') description: string, @Context('user') user) {
        const data: IdeaDTO = {idea, description};
        const {id: userId} = user;
        return await this.ideaService.createIdea(userId, data);
    }

}
