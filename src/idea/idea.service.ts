import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaEntity } from './idea.entity';
// import { IdeaModel } from './idea.model';
import { IdeaDTO } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class IdeaService {
    constructor(
        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        ) { }

    async  showAllIdeas() {
        return await this.ideaRepository.find({relations: ['author']});
    }
    async createIdea(data: IdeaDTO) {
        const idea = await this.ideaRepository.create(data);
        await this.ideaRepository.save(idea);
        return idea;
    }

    async readById(id: string) {
        const idea = await this.ideaRepository.findOne({ where: { id } });
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return idea;
    }
    // we are going to use dto partial because user will not always update all
    async update(id: string, data: Partial<IdeaDTO>) {
        let idea = await this.ideaRepository.findOne({ where: { id } });
        if (!idea) {
            throw new HttpException('Not found any data', HttpStatus.NOT_FOUND);
        }
        await this.ideaRepository.update({ id }, data);
        idea = await this.ideaRepository.findOne({ where: { id } });
        return idea;
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
