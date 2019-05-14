import { Controller, Get, Post, Body, Put, Delete, Param, UsePipes, Logger, UseGuards } from '@nestjs/common';
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
    showAllIdeas() {
        return this.ideaService.showAllIdeas();
    }

    @Get(':id')
    readIdea(@Param('id') id: string) {
        return this.ideaService.readById(id);
    }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createIdea(@User('id') user, @Body() data: IdeaDTO) {
        // this.logData({user, data});
        this.logger.log(JSON.stringify(data));
        return this.ideaService.createIdea(user, data);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDTO>) {
        this.logger.log(JSON.stringify(data));
        return this.ideaService.update(id, data);
    }

    @Delete(':id')
    deleteIdea(@Param('id') id: string) {

        return this.ideaService.deleteIdea(id);
    }
}
