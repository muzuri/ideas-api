import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaEntity } from './idea.entity';
// import { IdeaModel } from './idea.model';
import { IdeaDTO, IdeaRo } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class IdeaService {
    constructor(
        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }
    private toResponseObject(idea: IdeaEntity): IdeaRo {

        return { ...idea, author: idea.author.toResponseObject(true) };
    }

    async  showAllIdeas(): Promise<IdeaRo[]> {
        const ideas = await this.ideaRepository.find({ relations: ['author'] });
        return ideas.map(idea => this.toResponseObject(idea));
    }
    async createIdea(userId: string, data: IdeaDTO): Promise<IdeaRo> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const idea = await this.ideaRepository.create({ ...data, author: user });
        await this.ideaRepository.save(idea);
        return this.toResponseObject(idea);
    }

    async readById(id: string): Promise<IdeaRo> {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return this.toResponseObject(idea);
    }
    // we are going to use dto partial because user will not always update all
    async update(id: string, data: Partial<IdeaDTO>): Promise<IdeaRo> {
        let idea = await this.ideaRepository.findOne({ where: { id } });
        if (!idea) {
            throw new HttpException('Not found any data', HttpStatus.NOT_FOUND);
        }
        await this.ideaRepository.update({ id }, data);
        idea = await this.ideaRepository.findOne({ where: { id } });
        return this.toResponseObject(idea);
    }
    async   deleteIdea(id: string) {
        const idea = await this.ideaRepository.findOne({ where: { id } });
        if (!idea) {
            throw new HttpException('Not ready for deleted ', HttpStatus.NOT_FOUND);
        }
        await this.ideaRepository.delete({ id });
        return { deleted: true };
    }
}
