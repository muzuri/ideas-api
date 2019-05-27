import { Controller, Post, Get, UseGuards, Body, Delete, Param, Put, UsePipes, Query } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { CommentDto } from './comment.dto';
import { CommentService } from './comment/comment.service';
import { User } from 'src/user/user.decorator';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller('api/comments')
export class CommentController {
    constructor(private commentService: CommentService) { }
    @Get()
    @UseGuards(new AuthGuard())
    showAllComments() {}
    @Get('idea/:id')
    @UseGuards(new AuthGuard())
    showCommentByIdea(@Param('id') id: string, @Query('page') page: number) {

        return this.commentService.showByidea(id, page);
    }

    @Get('user/:id')
   //  @UseGuards(new AuthGuard())
    showCommentByUser(@Param('id') id: string, @Query('page') page: number) {

        return this.commentService.showByUser(id, page);
    }

    @Get(':id')
    showComment(@Param('id') id: string) {

        return this.commentService.showComment(id);
    }

    @Post('idea/:id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createComment(@Param('id') idea: string, @Body() data: CommentDto, @User('id') userId: string) {

        return this.commentService.createComment(idea, data, userId);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    destroy(@Param('id') id: string, @User('id') userId: string) {

        return this.commentService.destroy(id, userId);
    }

}
// idea-id : 5427118f-5f66-44ec-9632-f8e9c7d2214d
// userId:   b1065d25-bb7c-43dd-be13-845f2bd5dbc2
