import { Controller, Get, Post, Body, Put, Delete, Param, UsePipes, Logger, UseGuards } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';

@Controller('api/idea')
export class IdeaController {
    private logger = new Logger();
    constructor(private ideaService: IdeaService) { }
    @Get()
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
    createIdea(@Body() data: IdeaDTO) {
        this.logger.log(JSON.stringify(data));
        return this.ideaService.createIdea(data);
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
