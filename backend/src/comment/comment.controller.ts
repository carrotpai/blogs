import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/types';
import { CreateCommentDTO } from './dtos/createCommentDTO';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Get('forpost/:id')
  getCommenstForPost(@Param('id') postId: number) {
    return this.commentService.getNotNestedComments(postId);
  }

  @Get('forcomment/:id')
  getNestedComments(@Param('id') commentId: number) {
    return this.commentService.getNestedComments(commentId);
  }

  @Get('count/forpost/:id')
  getCountForRootComments(@Param('id') postId: number) {
    return this.commentService.getCountForRootComments(postId);
  }

  @Get('count/forcomment/:id')
  getCountForNestedComments(@Param('id') commentId: number) {
    return this.commentService.getCountForNestedComments(commentId);
  }

  @Get('count/all/:id')
  getCountForAllComments(@Param('id') postId: number) {
    return this.commentService.getCountForAllCommentsForPost(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create/forpost/:id')
  createCommentForPost(
    @Request() { user }: RequestWithUser,
    @Param('id') postId: number,
    @Body() createCommentDto: CreateCommentDTO,
  ) {
    return this.commentService.createNotNestedComment(
      postId,
      user.id,
      createCommentDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('create/forcomment/:id')
  createNestedComment(
    @Request() { user }: RequestWithUser,
    @Param('id') commentId: number,
    @Query('postId') postId: number,
    @Body() createCommentDto: CreateCommentDTO,
  ) {
    return this.commentService.createNestedComment(
      commentId,
      postId,
      user.id,
      createCommentDto,
    );
  }
}
