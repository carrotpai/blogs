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
import { sleep } from 'src/utils/sleep';
import { CommentVoteService } from './commentVote.service';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly commentVoteService: CommentVoteService,
  ) {}
  @Get('forpost/:id')
  async getCommenstForPost(
    @Param('id') postId: number,
    @Query('page') page: number,
  ) {
    await sleep(5000);
    return this.commentService.getNotNestedComments(postId, page);
  }

  @Get('forcomment/:id')
  async getNestedComments(
    @Param('id') commentId: number,
    @Query('page') page: number,
  ) {
    await sleep(5000);
    return this.commentService.getNestedComments(commentId, page);
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

  @UseGuards(JwtAuthGuard)
  @Get('forcomment/withuser/:id')
  async getNestedCommentsForCommentAndUser(
    @Request() { user }: RequestWithUser,
    @Param('id') commentId: number,
    @Query('page') page: number,
  ) {
    await sleep(5000);
    return this.commentService.getNestedCommentsForUser(
      user.id,
      commentId,
      page,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('forpost/withuser/:id')
  async getRootCommentsForPostAndUser(
    @Request() { user }: RequestWithUser,
    @Param('id') postId: number,
    @Query('page') page: number,
  ) {
    await sleep(5000);
    return this.commentService.getRootCommentsForUser(user.id, postId, page);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/upvote/:id')
  async upvoteComment(
    @Request() { user }: RequestWithUser,
    @Param('id') commentId: number,
  ) {
    return this.commentVoteService.upvote(user.id, commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/upvote/:id')
  async downvoteComment(
    @Request() { user }: RequestWithUser,
    @Param('id') commentId: number,
  ) {
    return this.commentVoteService.downvote(user.id, commentId);
  }
}
