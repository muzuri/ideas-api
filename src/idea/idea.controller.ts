import { Controller, Get, Post, Body, Put, Delete, Param, UsePipes, Logger, UseGuards, Query } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';


@Controller('api/idea')
export class IdeaController {
    private logger = new Logger('IdeaController');
    constructor(private ideaService: IdeaService) { }

    private logData(options: any) {
        options.user && this.logger.log('USER' + JSON.stringify(options.id));
        options.data && this.logger.log('DATA' + JSON.stringify(options.id));
        options.id && this.logger.log('IDEA' + JSON.stringify(options.id));
    }
    @Get()
    @UseGuards(new AuthGuard())
    showAllIdeas(@Query('page') page: number) {
        return this.ideaService.showAllIdeas(page);
    }
    // @Get('/newest')
    // showNewest(@Query('page') page: number) {
    //     return this.ideaService.showAllIdeas(page, true);
    // }

    @Get(':id')
    readIdea(@Param('id') id: string) {
        return this.ideaService.readById(id);
    }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createIdea(@User('id') user, @Body() data: IdeaDTO) {
        this.logData({ user, data });
        return this.ideaService.createIdea(user, data);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateIdea(@Param('id') id: string, @User('id') user: string, @Body() data: Partial<IdeaDTO>) {
        this.logData({ id, user, data });
        // this.logger.log(JSON.stringify(data));
        return this.ideaService.update(id, user, data);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    deleteIdea(@Param('id') id: string, @User('id') user) {
        this.logData({ id, user });
        return this.ideaService.deleteIdea(id, user);
    }
    @Post(':id/bookmark')
    @UseGuards(new AuthGuard())
    bookmark(@Param('id') id: string, @User('id') user) {
        this.logData({ user, id });
        return this.ideaService.bookmark(id, user);
    }
    @Delete(':id/bookmark')
    @UseGuards(new AuthGuard())
    Unbookmark(@Param('id') id: string, @User('id') userId: string) {
        this.logData({ id, userId });
        return this.ideaService.ubookmark(id, userId);

    }
    @Post(':id/upvote')
    @UseGuards(new AuthGuard())
    upvoteIdea(@Param('id') id: string, @User('id') userId: string ) {
        console.log(`${userId} and ${id}`);
        return this.ideaService.upvote(id, userId);
    }

    @Post(':id/downvote')
    @UseGuards(new AuthGuard())
    downVoteIdea(@Param('id') id: string, @User('id') userId: string) {
        return this.ideaService.downvote(id, userId);
    }
}
