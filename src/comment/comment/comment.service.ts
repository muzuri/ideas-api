import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from '../comment.entity';
import { CommentDto } from '../comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,
    ) { }

    private toResponseObject(comment: CommentEntity){
        const responseObject: any = comment;
        if (comment.author) {
             responseObject.author = comment.author.toResponseObject();
        }
        return responseObject;
    }

    async showComment(id: string) {
        const comment = await this.commentRepository.findOne({ where: { id }, relations: ['author', 'idea'] });

        return this.toResponseObject(comment);
    }

    async createComment(ideaId: string, data: CommentDto, userId: string) {
        const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const comment = await this.commentRepository.create({ ...data, idea, author: user });
        await this.commentRepository.save(comment);
        return this.toResponseObject(comment);
    }
    async destroy(id: string, userId: string) {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['author', 'idea']
        });

        if (comment.author.id !== userId) {
            throw new HttpException('you are not the own of this comment', HttpStatus.UNAUTHORIZED)
        }
        await this.commentRepository.remove(comment);
        return this.toResponseObject(comment);

    }
    async showByidea(ideaId: string, page: number = 1) {
        const comments = await this.commentRepository.find(
            {where : {idea: {ideaId}},
            relations: ['author'],
            skip: 3 * (page - 1),
            take: 3,
        });
        return comments.map(comment => this.toResponseObject(comment));
    }
    async showByUser(userId: string, page: number = 1) {
        const comments = await this.commentRepository.find(
            {where : {author: {userId}}, relations: ['author'],
            skip: 3 * (page - 1 ),
            take: 3,
        });
        return comments.map(comment => this.toResponseObject(comment));
    }
}
