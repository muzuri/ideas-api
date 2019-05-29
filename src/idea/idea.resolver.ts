import { Resolver, Query, Args, ResolveProperty, Parent } from '@nestjs/graphql';
import { IdeaService } from './idea.service';
import { CommentService } from 'src/comment/comment/comment.service';

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
}
