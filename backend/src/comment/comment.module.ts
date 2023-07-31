import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentVoteService } from './commentVote.service';

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentVoteService],
})
export class CommentModule {}
