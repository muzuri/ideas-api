import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment/comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { IdeaEntity } from 'src/idea/idea.entity';
import { CommentEntity } from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, UserEntity, IdeaEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
