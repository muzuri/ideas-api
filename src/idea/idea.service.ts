import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaEntity } from './idea.entity';
// import { IdeaModel } from './idea.model';
import { IdeaDTO, IdeaRo } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';
import { Votes } from 'src/shared/votes.enum';

@Injectable()
export class IdeaService {
    cars: string[] = ['e', ''];
    constructor(
        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }
    private toResponseObject(idea: IdeaEntity): IdeaRo {
        const responseObject: any = { ...idea, author: idea.author.toResponseObject(false) };
        if (responseObject.upvotes) {
            responseObject.upvotes = idea.upvotes.length;
        }
        if (responseObject.downvotes) {
            responseObject.downvotes = idea.downvotes.length;
        }
        return responseObject;
    }
    private ensureOwneship(idea: IdeaEntity, userId: string) {
        if (idea.author.id !== userId) {
            throw new HttpException('incorrect user', HttpStatus.UNAUTHORIZED);
        }
    }
    private async vote(idea: IdeaEntity, user: UserEntity, vote: Votes) {
        const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
        if (idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
            idea[vote].filter(voter => voter.id === user.id).length > 0) {
            idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
            idea[vote] = idea[vote].filter(voter => voter.id !== user.id);
            await this.ideaRepository.save(idea);
        } else if (idea[vote].filter(voter => voter.id === user.id)) {
            idea[vote].push(user);
            await this.ideaRepository.save(idea);

        } else {
            throw new HttpException('unable to cast vote', HttpStatus.BAD_REQUEST);
        }
        return idea;
    }

    async  showAllIdeas(page: number = 1): Promise<IdeaRo[]> {
        const ideas = await this.ideaRepository.find({
    relations: ['author', 'upvotes', 'downvotes', 'comments'],
    take: 3,
    skip: 3 * (page - 1 ),

    });
        return ideas.map(idea => this.toResponseObject(idea));
    }

    async createIdea(userId: string, data: IdeaDTO): Promise<IdeaRo> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const idea = await this.ideaRepository.create({ ...data, author: user });
        await this.ideaRepository.save(idea);
        return this.toResponseObject(idea);
    }

    async readById(id: string): Promise<IdeaRo> {
        const idea = await this.ideaRepository.findOne({
            where: { id },
            relations: ['author', 'downvotes', 'upvotes', 'comments'],
        });
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return this.toResponseObject(idea);
    }
    // we are going to use dto partial because user will not always update all
    async update(id: string, userId: string, data: Partial<IdeaDTO>): Promise<IdeaRo> {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
        if (!idea) {
            throw new HttpException('Not found any data', HttpStatus.NOT_FOUND);
        }
        this.ensureOwneship(idea, userId);
        await this.ideaRepository.update({ id }, data);
        idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'comments'] });
        return this.toResponseObject(idea);
    }
    async  deleteIdea(id: string, userId: string) {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
        if (!idea) {
            throw new HttpException('No Data found ', HttpStatus.NOT_FOUND);
        }
        this.ensureOwneship(idea, userId);
        await this.ideaRepository.delete({ id });
        return { deleted: true };
    }
    async bookmark(id: string, userId: string) {
        const idea = await this.ideaRepository.findOne({ where: { id } });
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['bookmarks'],

        });

        if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
            user.bookmarks.push(idea);
            await this.userRepository.save(user);
        } else {
            throw new HttpException('idea already bookmarked', HttpStatus.BAD_REQUEST);
        }
        return user.toResponseObject();
    }
    async ubookmark(id: string, userId: string) {
        const idea = await this.ideaRepository.findOne({ where: { id } });
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] });
        if (user.bookmarks.filter(bookmarks => bookmarks.id === idea.id).length > 0) {
            user.bookmarks = user.bookmarks.filter(bookmarks => bookmarks.id !== idea.id);
            await this.userRepository.save(user);
        } else {
            throw new HttpException('not yet booked ', HttpStatus.BAD_REQUEST);
        }
    }
    async upvote(id: string, userId: string) {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'upvotes', 'downvotes', 'comments'] });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        idea = await this.vote(idea, user, Votes.UP);
        return this.toResponseObject(idea);
    }
    async downvote(id: string, userId: string) {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['downvotes', 'upvotes', 'author', 'comments'] });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        idea = await this.vote(idea, user, Votes.DOWN);
        return this.toResponseObject(idea);
    }
}
